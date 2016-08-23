import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from 'css/components/button-group.css';

const ButtonGroup = props => (
  <div styleName={props.type}>
    {props.children}
  </div>
);

ButtonGroup.propTypes = {
  type: PropTypes.string.isRequired
};

export default CSSModules(ButtonGroup, styles);
