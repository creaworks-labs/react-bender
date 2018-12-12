import * as React from 'react';
import * as ReactIs from 'react-is';

import * as PropTypes from 'prop-types'
import hoistNonReactStatics from 'hoist-non-react-statics'
// import hoistNonReactStatics = require('hoist-non-react-statics');
import * as _ from "lodash";

import { StyleProp, ImpreciseStyle, transformStyle } from './Style'

import { resolveComponentStyle } from "./resolveComponentStyle";
// import normalizeStyle from "./StyleNormalizer/normalizeStyle";

// @ts-ignore 
import Theme, { ThemeShape } from "./Theme";



/**
 * Formats and throws an error when connecting component style with the theme.
 *
 * @param errorMessage The error message.
 * @param componentDisplayName The name of the component that is being connected.
 */
function throwConnectStyleError(errorMessage: string, componentDisplayName: string) {
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

type StyleNames = Array<string> | undefined;

interface MapPropsToStyleNames<TProps> {
  (ownStyleNames: StyleNames, props: TProps): StyleNames;
}

type MapPropsToStyleNamesParams<TProps> = MapPropsToStyleNames<TProps> | null | undefined

// interface StyleContext extends React.ValidationMap<any> {
//   parentStyle: Object,
//   theme: any
// }

// type StyleContext = React.ValidationMap<any>;


interface ResolveStyleHandler<TProps> {
  (props: TProps): ImpreciseStyle
}

interface StyleContextChild<TProps> {
  parentStyle: Object,
  resolveStyle: ResolveStyleHandler<TProps>
}

interface BentContext {
  theme: Object,
  parentStyle: Object | null
}

interface ConnectStyleOptions {
  virtual?: Boolean,
  withRef?: Boolean
}

// // Applies LibraryManagedAttributes (proper handling of defaultProps
// // and propTypes), as well as defines WrappedComponent.
// type ConnectedComponentClass<C, P> = React.ComponentClass<JSX.LibraryManagedAttributes<C, P>> & {
// 	WrappedComponent: C;
// }

// interface ConnectStyle {
//   (componentStyleName: String): ;

// }

interface WrappableProps {
  style? : StyleProp<ImpreciseStyle>
  styleDefinitions?: Object
}

type WrappableComponent = React.ComponentType<WrappableProps>

// interface ForwardedComponent {
//   $$typeof$$: string
//   propTypes?: Object
//   render: () => any
//   name?: string
//   displayName?: string
// }

// interface StyleResolver<TProps> {
//   resolveConnectedComponentStyle(props: TProps): Style
// }

/**
 * Resolves the final component style by using the theme style, if available and
 * merging it with the style provided directly through the style prop, and style
 * variants applied through the styleName prop.
 *
 * @param componentStyleName The component name that will be used
 * to target this component in style rules.
 * @param componentStyle The default component style.
 * @param mapPropsToStyleNames Pure function to customize styleNames depending on props.
 * @param options The additional connectStyle options
 * @param options.virtual The default value of the virtual prop
 * @param options.withRef Create component ref with addedProps; if true, ref name is wrappedInstance
 * @returns {StyledComponent} The new component that will handle
 * the styling of the wrapped component.
 */
export default function (
  componentStyleName: string,
  componentStyle: Object = {},
  mapPropsToStyleNames: MapPropsToStyleNamesParams<any>,
  options:ConnectStyleOptions = {}
): any {


  return function bendComponent(WrappedComponent: WrappableComponent) {
    if (!ReactIs.isValidElementType(WrappedComponent))
      throw new Error(
        "WrappedComponent is not a valid React component!"
      );

    const wrappedComponentName = WrappedComponent.displayName
      || WrappedComponent.name
      || componentStyleName

    if (!_.isPlainObject(componentStyle)) {
      throwConnectStyleError(
        "Component style must be plain object",
        wrappedComponentName
      );
    }

    if (!_.isString(componentStyleName)) {
      throwConnectStyleError(
        "Component Style Name must be string",
        wrappedComponentName
      );
    }

    function isStateful():boolean {
      //@ts-ignore
      return (WrappedComponent.prototype !== undefined && WrappedComponent.prototype.render !== undefined) || (WrappedComponent.render !== undefined)
    }

    interface BentProps {
      // Element style that overrides any other style of the component
      style: StyleProp<ImpreciseStyle>,
      // The style variant names to apply to this component,
      // multiple variants may be separated with a space character
      styleName: string,
      // Virtual elements will propagate the parent
      // style to their children, i.e., the children
      // will behave as they are placed directly below
      // the parent of a virtual element.
      virtual: boolean,
      // Extracts @style-def definitions as a separate style definitions
      // that will be passed into wrapped component as `styleDefinitons` prop.
      extractDefinitions: boolean,
    }
    
    interface BentStates {
      styleNames?: Array<string>,
      styles: {
        component: Object,
        definitions?: Object
      },
      // addedProps: Object,
      childrenStyle: Object
    }

    
    class BentComponent extends React.Component<BentProps, BentStates>
      implements 
        React.ChildContextProvider<StyleContextChild<BentProps>>
     {
      static contextTypes: React.ValidationMap<BentContext> = {
        theme: ThemeShape,
        // The style inherited from the parent
        parentStyle: PropTypes.object
      };
      
      static childContextTypes: React.ValidationMap<StyleContextChild<BentProps>> = {
        // Provide the parent style to child components
        parentStyle: PropTypes.object.isRequired,
        resolveStyle: PropTypes.func.isRequired
      };
    
      static defaultProps = {
        virtual: options.virtual,
        extractDefinitions: true
      };
    
      static displayName = `withBenderStyles(${wrappedComponentName})`;
      static WrappedComponent: WrappableComponent = WrappedComponent;
    
      wrappedRef:any = null

      constructor(props: BentProps, context: React.ValidationMap<BentContext>) {
        super(props, context);
        const styleNames = this.resolveStyleNames(props);
        const { componentStyle, componentDefinitions, childrenStyle } = this.resolveStyle(context, props.style, styleNames, props.extractDefinitions);
        
        this.state = {
          styles: {
            component: props.extractDefinitions ? transformStyle(componentStyle) : componentStyle,
            definitions: componentDefinitions
          },
          childrenStyle: childrenStyle,
          styleNames
        };

        this.setWrappedRef = this.setWrappedRef.bind(this);
      }
    
      getChildContext(): StyleContextChild<BentProps> {
        return {
          // if virtual is set then propagate the connected parent style
          // otherwise use resolved children styles.
          parentStyle: this.props.virtual
            ? this.context.parentStyle
            : this.state.childrenStyle,
          resolveStyle: this.resolveConnectedComponentStyle
        };
      }
    
      componentWillReceiveProps(nextProps: BentProps, nextContext: React.ValidationMap<BentContext>) {
        const styleNames = this.resolveStyleNames(nextProps);
        
        if (this.shouldRebuildStyle(nextProps, nextContext, styleNames)) {
          const { componentStyle, childrenStyle, componentDefinitions } = this.resolveStyle(
            nextContext,
            nextProps.style,
            styleNames,
            nextProps.extractDefinitions
          );

          this.setState({
            styles: {
              component: nextProps.extractDefinitions ? transformStyle(componentStyle) : componentStyle,
              definitions: componentDefinitions
            },
            childrenStyle,
            styleNames
          });
        }
      }
    
      setNativeProps(nativeProps:Object) {
        if (!this.wrappedRef) {
          console.warn('setNativeProps can\'nt be used on stateless components');
          return;
        }

        if (this.wrappedRef.setNativeProps) {
          this.wrappedRef.setNativeProps(nativeProps);
        }
      }
    
      setWrappedRef(component: any) {
        if (!component)
          return;

        if (component.wrappedRef) {
          this.wrappedRef = component.wrappedRef;
        } else {
          this.wrappedRef = component;
        }
      }
    
      hasStyleNameChanged(nextProps: BentProps, styleNames: StyleNames) {
        return (
          mapPropsToStyleNames &&
          this.props !== nextProps &&
          // Even though props did change here,
          // it doesn't necessary means changed props are those which affect styleName
          !_.isEqual(this.state.styleNames, styleNames)
        );
      }
    
      shouldRebuildStyle(nextProps: BentProps, nextContext: React.ValidationMap<BentContext>, styleNames: StyleNames) {
        return (
          nextProps.style !== this.props.style ||
          nextProps.styleName !== this.props.styleName ||
          nextContext.theme !== this.context.theme ||
          nextContext.parentStyle !== this.context.parentStyle ||
          this.hasStyleNameChanged(nextProps, styleNames)
        );
      }
    
      resolveStyleNames(props: BentProps): StyleNames {
        const { styleName } = props;

        const styleNames = styleName ? styleName.split(/\s/g) : [];
    
        if (!mapPropsToStyleNames) {
          return styleNames;
        }
    
        // We only want to keep the unique style names
        return _.uniq(mapPropsToStyleNames(styleNames, props));
      }
    
      resolveStyle(context: React.ValidationMap<BentContext>, 
        styleProp: StyleProp<ImpreciseStyle>, 
        styleNames: StyleNames,
        extractDefinitions: boolean) {
        const { parentStyle } = context;
    
        const theme = getTheme(context);
        //@ts-ignore
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
          extractDefinitions,
        );
      }
    
      /**
       * A helper function provided to child components that enables
       * them to resolve their style for any set of prop values.
       *
       * @param props The component props to use to resolve the style values.
       * @returns {*} The resolved component style.
       */
      resolveConnectedComponentStyle(props: BentProps): ImpreciseStyle {
        debugger
        const styleNames = this.resolveStyleNames(props);
        return this.resolveStyle(this.context, props.style, styleNames, props.extractDefinitions)
          .componentStyle;
      }

      // flattenStylesOverProps(props: BentProps, style: Object): any {
      //   if (props.style) {
      //     return StyleSheet.flatten([props.style, style])
      //   }

      //   return style;
      // }
    
      render() {
        const { styles } = this.state;
        const addedProps = isStateful() ? { ref: this.setWrappedRef } : undefined

        return (
          <WrappedComponent
            {...this.props}
            {...addedProps}
            style={styles.component}
            styleDefinitions={styles.definitions}
          />
        );
      }
    }

    return hoistNonReactStatics(BentComponent, WrappedComponent);
  };
};
