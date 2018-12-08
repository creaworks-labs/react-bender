
type FlexAlignType = "flex-start" | "flex-end" | "center" | "stretch" | "baseline";

/**
 * Flex Prop Types
 * @see https://facebook.github.io/react-native/docs/flexbox.html#proptypes
 * @see https://facebook.github.io/react-native/docs/layout-props.html
 * @see https://github.com/facebook/react-native/blob/master/Libraries/StyleSheet/LayoutPropTypes.js
 */
export interface FlexStyle {
    alignContent?: "flex-start" | "flex-end" | "center" | "stretch" | "space-between" | "space-around";
    alignItems?: FlexAlignType;
    alignSelf?: "auto" | FlexAlignType;
    aspectRatio?: number;
    borderBottomWidth?: number;
    borderEndWidth?: number | string;
    borderLeftWidth?: number;
    borderRightWidth?: number;
    borderStartWidth?: number | string;
    borderTopWidth?: number;
    borderWidth?: number;
    bottom?: number | string;
    display?: "none" | "flex";
    end?: number | string;
    flex?: number;
    flexBasis?: number | string;
    flexDirection?: "row" | "column" | "row-reverse" | "column-reverse";
    flexGrow?: number;
    flexShrink?: number;
    flexWrap?: "wrap" | "nowrap" | "wrap-reverse";
    height?: number | string;
    justifyContent?: "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly";
    left?: number | string;
    margin?: number | string;
    marginBottom?: number | string;
    marginEnd?: number | string;
    marginHorizontal?: number | string;
    marginLeft?: number | string;
    marginRight?: number | string;
    marginStart?: number | string;
    marginTop?: number | string;
    marginVertical?: number | string;
    maxHeight?: number | string;
    maxWidth?: number | string;
    minHeight?: number | string;
    minWidth?: number | string;
    overflow?: "visible" | "hidden" | "scroll";
    padding?: number | string;
    paddingBottom?: number | string;
    paddingEnd?: number | string;
    paddingHorizontal?: number | string;
    paddingLeft?: number | string;
    paddingRight?: number | string;
    paddingStart?: number | string;
    paddingTop?: number | string;
    paddingVertical?: number | string;
    position?: "absolute" | "relative";
    right?: number | string;
    start?: number | string;
    top?: number | string;
    width?: number | string;
    zIndex?: number;

    /**
     * @platform ios
     */
    direction?: "inherit" | "ltr" | "rtl";
}


export interface ShadowStyleIOS {
  shadowColor?: string;
  shadowOffset?: { width: number; height: number };
  shadowOpacity?: number;
  shadowRadius?: number;
}


interface PerpectiveTransform {
  perspective: number;
}

interface RotateTransform {
  rotate: string;
}

interface RotateXTransform {
  rotateX: string;
}

interface RotateYTransform {
  rotateY: string;
}

interface RotateZTransform {
  rotateZ: string;
}

interface ScaleTransform {
  scale: number;
}

interface ScaleXTransform {
  scaleX: number;
}

interface ScaleYTransform {
  scaleY: number;
}

interface TranslateXTransform {
  translateX: number;
}

interface TranslateYTransform {
  translateY: number;
}

interface SkewXTransform {
  skewX: string;
}

interface SkewYTransform {
  skewY: string;
}

export interface TransformsStyle {
  transform?: (
      | PerpectiveTransform
      | RotateTransform
      | RotateXTransform
      | RotateYTransform
      | RotateZTransform
      | ScaleTransform
      | ScaleXTransform
      | ScaleYTransform
      | TranslateXTransform
      | TranslateYTransform
      | SkewXTransform
      | SkewYTransform)[];
  transformMatrix?: Array<number>;
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
  translateX?: number;
  translateY?: number;
}

/**
 * @see https://facebook.github.io/react-native/docs/view.html#style
 * @see https://github.com/facebook/react-native/blob/master/Libraries/Components/View/ViewStylePropTypes.js
 */
export interface ViewStyle extends FlexStyle, ShadowStyleIOS, TransformsStyle {
  backfaceVisibility?: "visible" | "hidden";
  backgroundColor?: string;
  borderBottomColor?: string;
  borderBottomEndRadius?: number;
  borderBottomLeftRadius?: number;
  borderBottomRightRadius?: number;
  borderBottomStartRadius?: number;
  borderBottomWidth?: number;
  borderColor?: string;
  borderEndColor?: string;
  borderLeftColor?: string;
  borderLeftWidth?: number;
  borderRadius?: number;
  borderRightColor?: string;
  borderRightWidth?: number;
  borderStartColor?: string;
  borderStyle?: "solid" | "dotted" | "dashed";
  borderTopColor?: string;
  borderTopEndRadius?: number;
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  borderTopStartRadius?: number;
  borderTopWidth?: number;
  borderWidth?: number;
  opacity?: number;
  testID?: string;
  /**
    * Sets the elevation of a view, using Android's underlying
    * [elevation API](https://developer.android.com/training/material/shadows-clipping.html#Elevation).
    * This adds a drop shadow to the item and affects z-order for overlapping views.
    * Only supported on Android 5.0+, has no effect on earlier versions.
    *
    * @platform android
    */
  elevation?: number;
}



export interface TextStyleIOS extends ViewStyle {
  letterSpacing?: number;
  textDecorationColor?: string;
  textDecorationStyle?: "solid" | "double" | "dotted" | "dashed";
  textTransform?: "none" | "capitalize" | "uppercase" | "lowercase";
  writingDirection?: "auto" | "ltr" | "rtl";
}

export interface TextStyleAndroid extends ViewStyle {
  textAlignVertical?: "auto" | "top" | "bottom" | "center";
  includeFontPadding?: boolean;
}

// @see https://facebook.github.io/react-native/docs/text.html#style
export interface TextStyle extends TextStyleIOS, TextStyleAndroid, ViewStyle {
  color?: string;
  fontFamily?: string;
  fontSize?: number;
  fontStyle?: "normal" | "italic";
  /**
   * Specifies font weight. The values 'normal' and 'bold' are supported
   * for most fonts. Not all fonts have a variant for each of the numeric
   * values, in that case the closest one is chosen.
   */
  fontWeight?: "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
  letterSpacing?: number;
  lineHeight?: number;
  textAlign?: "auto" | "left" | "right" | "center" | "justify";
  textDecorationLine?: "none" | "underline" | "line-through" | "underline line-through";
  textDecorationStyle?: "solid" | "double" | "dotted" | "dashed";
  textDecorationColor?: string;
  textShadowColor?: string;
  textShadowOffset?: { width: number; height: number };
  textShadowRadius?: number;
  testID?: string;
}

export type ImageResizeMode = "cover" | "contain" | "stretch" | "repeat" | "center";

/**
 * Image style
 * @see https://facebook.github.io/react-native/docs/image.html#style
 * @see https://github.com/facebook/react-native/blob/master/Libraries/Image/ImageStylePropTypes.js
 */
export interface ImageStyle extends FlexStyle, ShadowStyleIOS, TransformsStyle {
  resizeMode?: ImageResizeMode;
  backfaceVisibility?: "visible" | "hidden";
  borderBottomLeftRadius?: number;
  borderBottomRightRadius?: number;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  overflow?: "visible" | "hidden";
  overlayColor?: string;
  tintColor?: string;
  opacity?: number;
}

export type ImpreciseStyle = TextStyle | ViewStyle | ImageStyle

type Falsy = undefined | null | false;
interface RecursiveArray<T> extends Array<T | RecursiveArray<T>> {}
export type StyleProp<T> = T | RecursiveArray<T | Falsy> | Falsy;

export function flattenStyle<T = ImpreciseStyle>(style?: StyleProp<T>) {
  if (style === null || typeof style !== 'object') {
    return undefined;
  }

  if (!Array.isArray(style)) {
    return style;
  }

  const result = {};
  for (let i = 0, styleLength = style.length; i < styleLength; ++i) {
    const computedStyle = flattenStyle(style[i]);
    if (computedStyle) {
      for (const key in computedStyle) {
        // @ts-ignore
        result[key] = computedStyle[key];
      }
    }
  }

  return result;
}

export function transformStyle(style?: ImpreciseStyle) {
  if (!style)
    return {};

  if (__DEV__)
    return Object.freeze(style);

  return style;
}