![React Bender](./react-bender-logo.svg)


[![NPM](https://img.shields.io/npm/v/react-bender.svg)](https://www.npmjs.com/package/react-bender) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Bender is the only unified way to define and apply styles to your **React** components using **React DOM** structure.

## Install

```bash
yarn add react-bender
```
 
## What is React Bender?

There are a lot of different approaches exists in the community for styling React components, but there was no unified approach for both* **React** (for Web) and **React Native** hence we invented this powerful library!

We all know that the **CSS** has lots of problems at scale. [Here](https://speakerdeck.com/vjeux/react-css-in-js) @vjeux already explained the problems mentioned years ago. Today, all the best practices and 3rd party libraries encouraging mostly CSS-in-JS approach. (Please refer to [here](https://github.com/MicheleBertoli/css-in-js).)
  
But conversely, Bender aims to use CSS practices to React and YES! This is yet another styling approach but not in CSS-in-JS way.


## Motivation

Bender introduces the *CSS-ish* way of defining style rules for React components. Of course, does not inherit problems of CSS into the React world but trying to bring some of the good stuff that you experienced from CSS.

 
### Why *CSS-ish* way of definition?  

As mentioned above, the CSS already exists in the browser environment but exist with its problems. Open Source Community trying to bring some practices like; **css-modules**, **styled-components** to avoid these issues but all these efforts are not addressing all the problems. A small summary can be found [here](https://survivejs.com/react/advanced-techniques/styling-react/).

On the other hand, CSS does not exist on the React Native and it has a strict way of defining styles and styling components. Yes, it doesn't have any special language or syntax. You just style you components using plain-old JavaScript. 

Most of the time component styles are defined as a static variable along with the component itself. This makes it easy to build self-contained components that always look and behave the same way. At the same time, it complicates building customizable and themable components that could have multiple alternative styles which could be customized without changing the component’s source code.

Bender using its own markup to bring a new approach to React component styling. With Bender you can write your components and their styles once and use them on both React & React Native projects.

## Approach

Bender has its own markup but if you are familiar with CSS or SCSS kind of supersets, it makes your job easy. Because you will feel like you are using something you already know.

Bender's main idea is to create set of targeted styles based on components and enhance them with additional alternative style combinations if needed.

### Component Specific Styles
You can create component styles using `#ComponentName` keyword in Bender stylesheet. Attached component name must start with `#`, must be *unique* in the stylesheet file and has to be defined as **PascalCase**.

Component styles can contain style definitions with **kebab-case**. These definitions will be default style properties of the matching component. But additionally, alternative styles can be defined as described in the next section.

Here's the basic style definition for a component named `Text`.

```scss
#Text {
	font-size: 14px;
	color: 'black';
}
```
> Please note that **Bender !== CSS** but, **Bender == CSS**.
> It doesn't have the same **CSS** features, rules and selectors but uses **CSS** syntax to define styles. 

After defining your component styles you should attach this definition to desired React component using `withBenderStyles` HoC. 

```javascript
// Text.js
import { Text as RNText } from 'react-native';
import { withBenderStyles } from 'react-bender';

export const Text = withBenderStyles('Text')(RNText)
```
This method will enrich your component and gather definitions named as `Text` inside your stylesheet then pass as `style` property automatically.

Final component can be used as the example below.

```jsx
<Text>Hey! This is a sample text inside a bender styled component.</Text>
```

### Alternative Styles
Alternative styles are the coolest way to add additional style flavours to your components using `styleName` property of your target react component.

```scss
#Text {
	font-size: 14px;
	color: 'black';
	
	// Alternate 1
	.bold {
		font-weight: 'bold';
	}
	
	// Alternate 2
	.underline {
		text-decoration: underline;
	}
}
```
> These style definitions must always be wrapped with a **component style** definition.

Alternate style definitions must be start with `.` and can contain nested alternative styles. Also, Bender has style cascading and nesting support. You can define a specific alternate rule to apply when you nest your components using React DOM.

There are **two** different ways to specify alternative styles to a Bender styled component. 

First option would be passing desired alternate definition name into the `styleName` prop of your React component.

```jsx
<Text styleName="bold">Hey! This is a inside a bender styled component.</Text>
```
If you are nesting your components, nested component will inherit styles resolved by super's `styleName` props. At the example; you should see the whole as **bold** and just `sample text` section **bold** and **italic** styled.
```jsx
<Text styleName="bold">Hey! This is a <Text styleName="italic">sample text</Text> inside a bender styled component.</Text>
```
> `styleName` property can be a string or array of strings. If you want to pass multiple modifiers into a component, you can use *array* approach or use *string* with *spaces* between each modifier style names.


### Rules Specificity

Specificity is basically a measure of how specific a rule definition is. 

The amount of specificity a rule has is measured using four different values, which can be thought of as thousands, hundreds, tens and ones — four single digits in four columns:

|Rule|Thousands|Hundreds|Tens|Ones|Total Specificity|
|--------|---------|--------|----|----|-----------------|
| ```#ComponentName {...}``` |0|0|0|1|1|
|```.styleName {...}```|0|0|5|0|50|
| No rule, with an inline style over element's `style` property |1|0|0|0|1000|


## How does it work?

- PostCSS

- Babel Plugin

- Metro Bundler

- Webpack Loader

## Performance  

Processing on both compile time and runtime.


## License

MIT © [omerduzyol](https://github.com/omerduzyol)
