import * as React from 'react'
import { withBenderStyles } from 'react-bender';

const Text = ({ classNames, style, styleDefinitions, children }) => {
  return (
    <yoga-text style={style} class={classNames.join(' ')}>{children}</yoga-text>
  )
}

export default withBenderStyles('Text')(Text);