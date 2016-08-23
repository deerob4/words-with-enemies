import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

import Button from 'components/Button';
import ButtonGroup from 'components/ButtonGroup';

const MenuButtons = props => {
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
          onClick={props.showInstructions}>
          Instructions
        </Button>

        <Button
          type="single-player"
          style={props.buttonStyle}
          onClick={props.showDifficultyButtons}>
          Single player
        </Button>

        <Button
          type="two-player"
          style={props.buttonStyle}
          onClick={props.transitionToLobby}>
          Two players
        </Button>
      </ButtonGroup>
    </div>
  );
};

MenuButtons.propTypes = {
  animation: PropTypes.string.isRequired,
  buttonStyle: PropTypes.object.isRequired,
  display: PropTypes.bool.isRequired,
  showInstructions: PropTypes.func.isRequired,
  showDifficultyButtons: PropTypes.func.isRequired,
  transitionToLobby: PropTypes.func.isRequired
};

export default MenuButtons;
