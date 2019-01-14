import * as React from 'react'
import { withBenderStyles } from 'react-bender';

const View = ({ style, styleDefinitions, children }) => {
  return (
    <yoga-view style={style}>{children}</yoga-view>
  )
}

// type Props = {
//   flexible?: boolean
// }


// const mapPropsToStyleName = (ownStyleNames: StyleNames, props: Props): StyleNames => {
//   if (props.flexible)
//     return ['flexible']
// }

// export default withBenderStyles('View', undefined, mapPropsToStyleName)(View);

export default withBenderStyles('View')(View);
