import React, { PropTypes } from 'react';
import ButtonGroup from 'components/ButtonGroup';
import Button from 'components/Button';
import classnames from 'classnames';
import { EASY, MEDIUM, HARD } from 'constants/index';

const DifficultyButtons = props => {
  const buttonsClass = classnames({
    [`animated ${props.animation}`]: props.animation,
    hidden: !props.display
  });

  return (
    <div className={buttonsClass}>
      <ButtonGroup type="lobby">
        <Button
          type="instructions"
          style={props.buttonStyle}
          onClick={() => props.startGame(EASY)}>
          Easy
        </Button>

        <Button
          type="single-player"
          style={props.buttonStyle}
          onClick={() => props.startGame(MEDIUM)}>
          Medium
        </Button>

        <Button
          type="two-player"
          style={props.buttonStyle}
          onClick={() => props.startGame(HARD)}>
          Hard
        </Button>
      </ButtonGroup>
    </div>
  );
};

DifficultyButtons.propTypes = {
  animation: PropTypes.string.isRequired,
  buttonStyle: PropTypes.object.isRequired,
  display: PropTypes.bool.isRequired,
  startGame: PropTypes.func.isRequired
};

export default DifficultyButtons;
