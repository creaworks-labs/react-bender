import * as React from 'react'
import { withBenderStyles } from 'react-bender';

const View = ({ style, styleDefinitions, children }) => {
  return (
    <div style={style}>{children}</div>
  )
}

export default withBenderStyles('View')(View);