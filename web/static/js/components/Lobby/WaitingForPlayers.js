import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import animationToggle from 'utils/animationToggle';

import Button from 'components/Button';

const WaitingForPlayers = props => {
  const { animation, display, buttonStyle, cancelHosting } = props;

  const waitingForPlayersClass = animationToggle(animation, display);

  return (
    <div className={waitingForPlayersClass}>
      <h2>Waiting for players to join...</h2>

      <Button
        type="cancel-hosting"
        style={props.buttonStyle}
        onClick={props.cancelHosting}>
        Cancel hosting
      </Button>
    </div>
  );
};

WaitingForPlayers.propTypes = {
  buttonStyle: PropTypes.object.isRequired,
  cancelHosting: PropTypes.func.isRequired
};

export default WaitingForPlayers;
