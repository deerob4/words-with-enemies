import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import animationToggle from 'utils/animationToggle';

import UsernamePicker from 'components/Lobby/UsernamePicker';
import WaitingForPlayers from 'components/Lobby/WaitingForPlayers';

import styles from 'css/components/host-game.css';

class HostGame extends Component {
  constructor(props) {
    super(props);

    this.chooseUsername = this.chooseUsername.bind(this);

    this.state = {
      usernamePicker: {
        display: true,
        animation: ''
      },
      waitingForPlayers: {
        display: false,
        animation: ''
      }
    };
  }

  chooseUsername(username) {
    const { beginHosting } = this.props;

    this.setState({
      usernamePicker: {
        display: true,
        animation: 'bounceOutRight'
      }
    });

    setTimeout(() => {
      this.setState({
        usernamePicker: {
          display: false,
          animation: ''
        },
        waitingForPlayers: {
          display: true,
          animation: 'bounceInLeft'
        }
      });
    }, 400);

    beginHosting(username);
  }

  render() {
    const { animation, display, colours, cancelHosting } = this.props;

    const messageStyle = {
      color: colours.secondary
    };

    const buttonStyle = {
      color: colours.button,
      borderColor: colours.button
    };

    const hostGameClass = animationToggle(animation, display);

    return (
      <div className={hostGameClass}>
        <UsernamePicker
          animation={this.state.usernamePicker.animation}
          display={this.state.usernamePicker.display}
          messageStyle={messageStyle}
          buttonStyle={buttonStyle}
          colours={colours}
          onClick={this.chooseUsername}
          buttonMessage="Begin hosting" />

        <WaitingForPlayers
          animation={this.state.waitingForPlayers.animation}
          display={this.state.waitingForPlayers.display}
          cancelHosting={cancelHosting}
          messageStyle={messageStyle}
          buttonStyle={buttonStyle} />
      </div>
    );
  }
}

HostGame.propTypes = {
  animation: PropTypes.string.isRequired,
  colours: PropTypes.object.isRequired,
  display: PropTypes.bool.isRequired,
  beginHosting: PropTypes.func.isRequired,
  cancelHosting: PropTypes.func.isRequired
};

export default CSSModules(HostGame, styles);
