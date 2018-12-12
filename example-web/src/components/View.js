import * as React from 'react'
import { withBenderStyles } from 'react-bender';

const View = ({ style, styleDefinitions, children }) => {
  return (
    <div style={style}>{children}</div>
  )
}

type Props = {
  flexible?: boolean
}


const mapPropsToStyleName = (ownStyleNames: StyleNames, props: Props): StyleNames => {
  if (props.flexible)
    return ['flexible']
}

export default withBenderStyles('View', undefined, mapPropsToStyleName)(View);
