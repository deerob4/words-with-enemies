import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from 'css/components/round.css';

const Round = props => (
  <span style={{ color: props.colour }} styleName="round">
    Round {props.round}
  </span>
);

Round.propTypes = {
  round: PropTypes.number.isRequired
};

export default CSSModules(Round, styles);

