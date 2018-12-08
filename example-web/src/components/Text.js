import * as React from 'react'
import { withBenderStyles } from 'react-bender';

const Text = ({ style, styleDefinitions, children }) => {
  return (
    <span style={style}>{children}</span>
  )
}

export default withBenderStyles('Text')(Text);