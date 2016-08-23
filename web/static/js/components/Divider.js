import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from 'css/components/divider.css';

const Divider = props => (
  <div
    styleName="divider"
    style={{ backgroundColor: props.colour }}>
  </div>
);

Divider.propTypes = {
  colour: PropTypes.string.isRequired
};

export default CSSModules(Divider, styles);
