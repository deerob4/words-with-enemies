import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from 'css/components/button.css';

const Button = props => (
  <div
    styleName={props.type}
    style={props.style}
    onClick={props.onClick}>
    {props.children}
  </div>
);

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired
};

export default CSSModules(Button, styles);
