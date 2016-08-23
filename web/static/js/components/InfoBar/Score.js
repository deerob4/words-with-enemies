import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from 'css/components/score.css';

const Score = props => (
  <span
    style={{ color: props.colour }}
    styleName={props.user}>
    {props.name} - {props.score}
  </span>
);

Score.propTypes = {
  name: PropTypes.string.isRequired,
  user: PropTypes.oneOf(['player', 'opponent']).isRequired,
  score: PropTypes.number.isRequired
};

export default CSSModules(Score, styles);
