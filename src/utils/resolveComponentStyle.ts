import { reduce, map, merge } from "lodash-es";

import { StyleProp, ImpreciseStyle, flattenStyle } from "../Style";

/**
 * Matches any style properties that represent component style variants.
 * Those styles can be applied to the component by using the styleName
 * prop. All style variant property names must start with a single '.'
 * character, e.g., '.variant'.
 *
 * @param propertyName The style property name.
 * @returns {boolean} True if the style property represents a component variant, false otherwise.
 */
const REGEX_ISSTYLE_VARIANT = /^\./;
function isStyleVariant(propertyName: string) {
  return REGEX_ISSTYLE_VARIANT.test(propertyName);
}


const REGEX_ISCLASS_NAME = /^--class-/;
function isClassName(propertyName: string) {
  return REGEX_ISCLASS_NAME.test(propertyName);
}

/**
 * Matches any style properties that represent style rules that target the
 * component children. Those styles can have two formats, they can either
 * target the components by component name ('Slider-Container'), or by component
 * name and variant ('Text.line-through'). Beside specifying the
 * component name, those styles can also target any component by using the
 * '*' wildcard ('*', or '*.line-through'). The rule to identify those styles is
 * that they have to contain a '.' character in their name or be a '*'.
 *
 * @param propertyName The style property name.
 * @returns {boolean} True if the style property represents a child style, false otherwise.
 */
const REGEX_IS_CHILD_STYLE = /(^[^\.].*\.)|(^[A-Z][^\s]*)|^\*$/;
function isChildStyle(propertyName: string) {
  return REGEX_IS_CHILD_STYLE.test(propertyName);
}

/**
 * Splits the style into its parts:
 * component style - concrete style that needs to be applied to a component
 * style variants - variants that can be applied to a component by using styleName prop
 * children style - style rules that need to be propagated to component children
 *
 * @param style The style to split.
 * @param extractDefinitions Flag to extract child @style-def based definitions
 * @returns {*} An object with the componentStyle, styleVariants, and childrenStyle keys.
 */
function splitStyle(style: any, extractDefinitions: boolean) {
  return reduce(
    style,
    (result, value, key) => {
      let styleSection: any = result.componentStyle;
      
    
      if (isStyleVariant(key)) styleSection = result.styleVariants;
      else if (isChildStyle(key)) styleSection = result.childrenStyle;
      else if (value && extractDefinitions && typeof value === "object")
        styleSection = result.componentDefinitions;

      if (isClassName(key)) {
        const classNames = styleSection['__classNames__'] || []
        // @ts-ignore
        classNames.push(key.replace(REGEX_ISCLASS_NAME, ''))
        
        styleSection['__classNames__'] = classNames
      } else {
        styleSection[key] = value;
      }
      
      return result;
    },
    {
      componentStyle: {},
      componentDefinitions: {},
      styleVariants: {},
      childrenStyle: {},
    }
  );
}

/**
 * Resolves the final component style by merging all of the styles that can be
 * applied to a component in the proper order.
 *
 * This function extracts the applicable parts of the theme, parent and element
 * styles, and merges the styles that target the component, and component variants
 * with those styles to get the final style.
 *
 * The styles are merged in the following order, where the styles with the
 * higher index override the styles with the lower one:
 * 1. Theme component style
 * 2. Parent component style
 * 3. Theme style variants specified through styleName
 * 4. Parent style variants specified through styleName
 * 5. Element style passed through the style prop
 *
 * @param componentName The component name ('shoutem.ui.Text')
 * @param styleName Style names ('large rounded')
 * @param themeStyle The theme style that should include the theme and base component style
 * @param parentStyle The style rules inherited from the parent component
 * @param elementStyle The style passed through the style prop of the component
 * @returns {{componentStyle, componentDefinitions, childrenStyle}} The resolved component and children styles.
 */
export function resolveComponentStyle(
  componentName: string,
  styleNames: Array<string> = [],
  themeStyle: any = {},
  parentStyle: any = {},
  elementStyle: StyleProp<ImpreciseStyle> = {},
  extractDefinitions: boolean = true
): {
  componentStyle: ImpreciseStyle;
  componentDefinitions: ImpreciseStyle;
  childrenStyle: ImpreciseStyle;
} {
  const styleAllFromAncestor = parentStyle["*"];
  const styleComponentFromAncestor = parentStyle[componentName];
  const styleAllByNameFromAncestor = map(
    styleNames,
    sn => parentStyle[`*.${sn}`]
  );
  const styleByComponentAndNameFromAncestor = map(
    styleNames,
    sn => parentStyle[`${componentName}.${sn}`]
  );
  const styleByProps = flattenStyle(elementStyle);

  // Phase 1: merge the styles in the correct order to resolve the variant styles,
  // the component style will be merged as well in this step, but the component
  // style merge results are ignored after this step. We need to perform this
  // step separately because the style variants may be overridden by any style, so
  // the purpose of this phase is to determine the final state of the variant styles.
  const mergedStyle = merge(
    {},
    themeStyle,
    styleAllFromAncestor,
    styleComponentFromAncestor,
    ...map(styleNames, sn => themeStyle[`.${sn}`]),
    ...styleAllByNameFromAncestor,
    ...styleByComponentAndNameFromAncestor,
    styleByProps
  );

  // Phase 2: merge the component styles, this step is performed by using the
  // style from phase 1, so that we are sure that the final style variants are
  // applied to component style.
  const resolvedStyle = merge(
    {},
    mergedStyle,
    styleAllFromAncestor,
    styleComponentFromAncestor,
    ...map(styleNames, sn => mergedStyle[`.${sn}`]),
    ...styleAllByNameFromAncestor,
    ...styleByComponentAndNameFromAncestor,
    styleByProps
  );

  const { componentStyle, childrenStyle, componentDefinitions } = splitStyle(
    resolvedStyle,
    extractDefinitions
  );

  return {
    componentStyle,
    componentDefinitions,
    childrenStyle,
  };
}
