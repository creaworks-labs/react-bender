import * as React from "react";
import * as ReactIs from "react-is";
import * as PropTypes from "prop-types";

import { isPlainObject, isString, isEqual, uniq, omit } from "lodash-es";
import hoistNonReactStatics from "hoist-non-react-statics";

// @ts-ignore
import Theme, { ThemeShape } from "./utils/Theme";
import { resolveComponentStyle } from "./utils/resolveComponentStyle";
import { StyleProp, ImpreciseStyle, transformStyle } from "./Style";

type ValuesOf<T extends any[]>= T[number];
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

interface MapPropsToStyleNames<TProps> {
  // tslint:disable-next-line
  (ownStyleNames: StyleNames, props: TProps): StyleNames;
}

type MapPropsToStyleNamesParams<TProps> =
  | MapPropsToStyleNames<TProps>
  | null
  | undefined;

type StyleNames = Array<string> | undefined;

// these are the props to be injected by the HOC
interface WithBenderProps {
  style: StyleProp<ImpreciseStyle>;
  styleDefinitions?: ImpreciseStyle;
  classNames?: Array<string>;
}

interface RestrictedStylingProp<TAllowedStyleNames extends string[]> {
  // The predifed style variant names to apply to this component,
  styleName: Array<ValuesOf<TAllowedStyleNames>>
}

interface FreeStylingProp {
  // The style variant names to apply to this component,
  // multiple variants may be separated with a space character
  styleName: string | StyleNames;
}

type StylingProp<TAllowedStyleNames> = TAllowedStyleNames extends string[] ? RestrictedStylingProp<TAllowedStyleNames> : FreeStylingProp

type BenderProps<T = {}> = StylingProp<T> & {
  // Element style that overrides any other style of the component
  style: StyleProp<ImpreciseStyle>;
    
  // styleName: string | StyleNames;
  // Virtual elements will propagate the parent
  // style to their children, i.e., the children
  // will behave as they are placed directly below
  // the parent of a virtual element.
  virtual: boolean;
  // Extracts @style-def definitions as a separate style definitions
  // that will be passed into wrapped component as `extractDefinitions` prop.
  extractDefinitions: boolean;
}

type PossibleStyleOrClassNames = StyleProp<ImpreciseStyle> & {
  __classNames__?: Array<string>
}

interface BenderState {
  styleNames?: Array<string>;
  styles: {
    component: PossibleStyleOrClassNames;
    definitions?: PossibleStyleOrClassNames;
  };
  // addedProps: Object,
  childrenStyle: object;
}


interface ResolveStyleHandler<TProps> {
  // tslint:disable-next-line
  (props: TProps): ImpreciseStyle;
}

interface StyleContextChild<TProps> {
  parentStyle: object;
  resolveStyle: ResolveStyleHandler<TProps>;
}

interface BenderContext {
  theme: object;
  parentStyle: object | null;
}

interface BenderStyleOptions {
  virtual?: boolean;
  withRef?: boolean;
}

/**
 * Formats and throws an error when connecting component style with the theme.
 *
 * @param errorMessage The error message.
 * @param componentDisplayName The name of the component that is being connected.
 */
function throwBenderStylesError(
  errorMessage: string,
  componentDisplayName: string
) {
  throw Error(
    `${errorMessage} - when connecting ${componentDisplayName} component to style.`
  );
}

/**
 * Returns the theme object from the provided context,
 * or an empty theme if the context doesn't contain a theme.
 *
 * @param context The React component context.
 * @returns {Theme} The Theme object.
 */
function getTheme(context: React.ValidationMap<any>) {
  // Fallback to a default theme if the component isn't
  // rendered in a StyleProvider.
  return context.theme || Theme.getDefaultTheme();
}


function checkIsStateful<C>(WrappedComponent: React.ComponentType<C>): boolean {
  return (
    (WrappedComponent.prototype !== undefined &&
      WrappedComponent.prototype.render !== undefined) ||
    // @ts-ignore
    WrappedComponent.render !== undefined
  );
}


const REGEX_SLICER = /\s/g

function getStyleNameProp(styleName: string | StyleNames) : StyleNames {
  if (!styleName)
    return []

  if (typeof styleName === 'string')
    return styleName.split(REGEX_SLICER)

  return styleName
}

export default function withBenderStyles<S = {}, C ={}>(
  componentStyleName: string,
  mapPropsToStyleNames?: MapPropsToStyleNamesParams<C>,
  componentStyle?: object,
  options?: BenderStyleOptions) {
  return function<P extends WithBenderProps>(
    WrappedComponent: React.ComponentType<C>
  ) {
    if (!ReactIs.isValidElementType(WrappedComponent))
      throw new Error("WrappedComponent is not a valid React component!");

    const wrappedComponentName =
      WrappedComponent.displayName ||
      WrappedComponent.name ||
      componentStyleName;

    if (componentStyle && !isPlainObject(componentStyle))
      throwBenderStylesError(
        "Component style must be plain object",
        wrappedComponentName
      );

    if (!isString(componentStyleName))
      throwBenderStylesError(
        "Component Style Name must be string",
        wrappedComponentName
      );

    const isStateful = checkIsStateful(WrappedComponent)
    
    type Props = JSX.LibraryManagedAttributes<C, Omit<P, keyof WithBenderProps>> & C & Partial<BenderProps<S>>
    // Creating the inner component. The calculated Props type here is the where the magic happens.
    const BenderComponent = class extends React.PureComponent<Props, BenderState> {
      static displayName = `withBenderStyles(${wrappedComponentName})`;
      static WrappedComponent = WrappedComponent;

      static contextTypes: React.ValidationMap<BenderContext> = {
        theme: ThemeShape,
        // The style inherited from the parent
        parentStyle: PropTypes.object
      };

      static childContextTypes: React.ValidationMap<
        StyleContextChild<BenderProps>
      > = {
        // Provide the parent style to child components
        parentStyle: PropTypes.object.isRequired,
        resolveStyle: PropTypes.func.isRequired
      };

      static defaultProps = {
        virtual: options && options.virtual,
        extractDefinitions: true
      };

      wrappedRef: any = null;

      constructor(
        props: Props,
        context: React.ValidationMap<BenderContext>
      ) {
        super(props, context);
        const styleNames = this.resolveStyleNames(props);
        const {
          componentStyle,
          componentDefinitions,
          childrenStyle
        } = this.resolveStyle(
          context,
          props.style,
          styleNames,
          props.extractDefinitions !== undefined ? props.extractDefinitions : false
        );

        this.state = {
          styles: {
            component: props.extractDefinitions
              ? transformStyle(componentStyle)
              : componentStyle,
            definitions: componentDefinitions
          },
          childrenStyle,
          styleNames
        };

        this.setWrappedRef = this.setWrappedRef.bind(this);
      }

      getChildContext(): StyleContextChild<Props> {
        return {
          // if virtual is set then propagate the connected parent style
          // otherwise use resolved children styles.
          parentStyle: this.props.virtual
            ? this.context.parentStyle
            : this.state.childrenStyle,
          resolveStyle: this.resolveConnectedComponentStyle
        };
      }

      componentWillReceiveProps(
        nextProps: Props,
        nextContext: React.ValidationMap<BenderContext>
      ) {
        const styleNames = this.resolveStyleNames(nextProps);

        if (this.shouldRebuildStyle(nextProps, nextContext, styleNames)) {
          const {
            componentStyle,
            childrenStyle,
            componentDefinitions
          } = this.resolveStyle(
            nextContext,
            nextProps.style,
            styleNames,
            nextProps.extractDefinitions !== undefined ? nextProps.extractDefinitions : false
          );

          this.setState({
            styles: {
              component: nextProps.extractDefinitions
                ? transformStyle(componentStyle)
                : componentStyle,
              definitions: componentDefinitions
            },
            childrenStyle,
            styleNames
          });
        }
      }

      setNativeProps(nativeProps: object) {
        if (!this.wrappedRef) {
          // tslint:disable-next-line
          console.warn("setNativeProps can't be used on stateless components");
          return;
        }

        if (this.wrappedRef.setNativeProps)
          this.wrappedRef.setNativeProps(nativeProps);
      }

      setWrappedRef(component: any) {
        if (!component) return;

        if (component.wrappedRef) this.wrappedRef = component.wrappedRef;
        else this.wrappedRef = component;
      }

      hasStyleNameChanged(nextProps: Props, styleNames: StyleNames) {
        return (
          mapPropsToStyleNames &&
          this.props !== nextProps &&
          // Even though props did change here,
          // it doesn't necessary means changed props are those which affect styleName
          !isEqual(this.state.styleNames, styleNames)
        );
      }

      shouldRebuildStyle(
        nextProps: Props,
        nextContext: React.ValidationMap<BenderContext>,
        styleNames: StyleNames
      ) {
        return (
          nextProps.style !== this.props.style ||
          nextProps.styleName !== this.props.styleName ||
          nextContext.theme !== this.context.theme ||
          nextContext.parentStyle !== this.context.parentStyle ||
          this.hasStyleNameChanged(nextProps, styleNames)
        );
      }


      resolveStyleNames(props: Props): StyleNames {
        const { styleName } = props;

        const styleNames = getStyleNameProp(styleName)

        if (!mapPropsToStyleNames) return styleNames;

        // We only want to keep the unique style names
        return uniq(mapPropsToStyleNames(styleNames, props));
      }

      resolveStyle(
        context: React.ValidationMap<BenderContext>,
        styleProp: StyleProp<ImpreciseStyle>,
        styleNames: StyleNames,
        extractDefinitions: boolean
      ) {
        const { parentStyle } = context;

        const theme = getTheme(context);
        // @ts-ignore
        const themeStyle = theme.createComponentStyle(
          componentStyleName,
          componentStyle
        );

        return resolveComponentStyle(
          componentStyleName,
          styleNames,
          themeStyle,
          parentStyle,
          styleProp,
          extractDefinitions
        );
      }

      /**
       * A helper function provided to child components that enables
       * them to resolve their style for any set of prop values.
       *
       * @param props The component props to use to resolve the style values.
       * @returns {*} The resolved component style.
       */
      resolveConnectedComponentStyle(props: Props): ImpreciseStyle {
        const styleNames = this.resolveStyleNames(props);
        return this.resolveStyle(
          this.context,
          props.style,
          styleNames,
          props.extractDefinitions !== undefined ? props.extractDefinitions : false
        ).componentStyle;
      }

      render() {
        const { styles } = this.state;
        const addedProps = isStateful
          ? { ref: this.setWrappedRef }
          : undefined;

        const { 
          __classNames__: classNames
        } = styles.component

        const style: StyleProp<ImpreciseStyle> = omit(styles.component, '__classNames__');

        return (
          <WrappedComponent
            {...this.props}
            {...addedProps}
            style={style}
            styleDefinitions={styles.definitions}
            classNames={classNames}
          />
        );
      }
    }

    return hoistNonReactStatics(BenderComponent, WrappedComponent);
  };
}
