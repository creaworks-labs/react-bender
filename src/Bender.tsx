import * as React from "react";
import * as PropTypes from "prop-types";
// @ts-ignore
import Theme, { ThemeShape } from "./utils/Theme";

interface BenderProps {
  stylesheet: any;
}

interface BenderStates {
  theme: any;
}

/**
 *  Provides a theme to child components trough context.
 */
export default class Bender extends React.Component<BenderProps, BenderStates> {
  static propTypes = {
    children: PropTypes.element.isRequired,
    stylesheet: PropTypes.object
  };

  static defaultProps = {
    stylesheet: {}
  };

  static childContextTypes = {
    theme: ThemeShape.isRequired
  };

  constructor(props: BenderProps) {
    super(props);
    this.state = {
      theme: this.createTheme(props)
    };
  }

  getChildContext() {
    return {
      theme: this.state.theme
    };
  }

  componentWillReceiveProps(nextProps: BenderProps) {
    if (nextProps.stylesheet !== this.props.stylesheet)
      this.setState({
        theme: this.createTheme(nextProps)
      });
  }

  createTheme(props: BenderProps) {
    return new Theme(props.stylesheet);
  }

  render() {
    const { children } = this.props;

    return React.Children.only(children);
  }
}
