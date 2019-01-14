import * as React from 'react'
import { withBenderStyles } from 'react-bender';

const Text = ({ style, styleDefinitions, children }) => {
  return (
    <yoga-text style={style}>{children}</yoga-text>
  )
}

export default withBenderStyles('Text')(Text);