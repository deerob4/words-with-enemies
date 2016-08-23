import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from 'css/components/letters.css';

const Letter = props => (
  <li
    onClick={props.onClick}
    // className="animated flip"
    styleName="letter"
    style={props.colours}>
    {props.value}
  </li>
);

Letter.propTypes = {
  value: PropTypes.string.isRequired,
  colours: PropTypes.shape({
    backgroundColor: PropTypes.string,
    borderColor: PropTypes.string,
    color: PropTypes.string
  }).isRequired,
};

export default CSSModules(Letter, styles);
