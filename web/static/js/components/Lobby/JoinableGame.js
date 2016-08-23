import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';

import Button from 'components/Button';

import styles from 'css/components/joinable-games.css';

const JoinableGame = props => (
  <li style={{borderColor: props.borderColor }} styleName="game">
    <h2 style={props.messageStyle} styleName="message">
      {props.game.host.name} is looking for a game!
    </h2>

    <div styleName="buttons">
      <Button
        type="small-lobby"
        onClick={props.joinGame}
        style={props.buttonStyle}>
        Join
      </Button>

      <Button
        type="small-lobby"
        onClick={props.joinGame}
        style={props.buttonStyle}>
        Watch
      </Button>
    </div>
  </li>
);

JoinableGame.propTypes = {
  game: PropTypes.object.isRequired,
  joinGame: PropTypes.func.isRequired,
  buttonStyle: PropTypes.object.isRequired,
  borderColor: PropTypes.string.isRequired,
  messageStyle: PropTypes.object.isRequired
};

export default CSSModules(JoinableGame, styles);
