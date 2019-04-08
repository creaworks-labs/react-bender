import * as React from 'react'
import { withBenderStyles } from 'react-bender';

const View = ({ classNames, style, styleDefinitions, children }) => {
  return (
    <yoga-view style={style} class={classNames.join(' ')}>{children}</yoga-view>
  )
}

const mapPropsToStyleName = (ownStyleNames, props) => {
  const styleNames = [...ownStyleNames]
  if (props.liquid)
    styleNames.push('flexible')

  return styleNames;
}

export default withBenderStyles('View', {
  // borderWidth: 20
}, mapPropsToStyleName)(View);

// export default withBenderStyles('View')(View);
