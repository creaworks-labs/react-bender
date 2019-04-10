import { View as RNView } from 'react-native';
import { withBenderStyles } from 'react-bender';

const mapPropsToStyleName = (ownStyleNames, props) => {
  const styleNames = [...ownStyleNames]
  if (props.liquid)
    styleNames.push('flexible')

  return styleNames;
}

export const View = withBenderStyles('View', mapPropsToStyleName, {
  // borderWidth: 20
})(RNView);

// export const View = withBenderStyles('View')(RNView)

