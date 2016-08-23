import React, { PropTypes } from 'react';
import Button from 'components/Button';
import ButtonGroup from 'components/ButtonGroup';

const GameButtons = props => {
  return (
    <ButtonGroup type="game">
      <Button
        type="game"
        style={props.buttonStyle}
        onClick={props.checkValidity}>
        I'm finished!
      </Button>

      <Button
        type="game"
        style={props.buttonStyle}
        onClick={props.getHint}>
        I'm stuck!
      </Button>

      <Button
        type="game"
        style={props.buttonStyle}
        onClick={props.getAnswers}>
        Word please!
      </Button>

      <Button
        type="game"
        style={props.buttonStyle}
        onClick={props.changeLetters}>
        New letters!
      </Button>

      <Button
        type="last"
        style={props.buttonStyle}
        onClick={props.changeColours}>
        Change the colours!
      </Button>
    </ButtonGroup>
  );
};

export default GameButtons;
