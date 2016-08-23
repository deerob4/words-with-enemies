import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import CSSModules from 'react-css-modules';
import classnames from 'classnames';

import FlexContainer from 'components/FlexContainer';
import HostGame from 'components/Lobby/HostGame';
import PlayerCount from 'components/Lobby/PlayerCount';
import JoinableGameList from 'components/Lobby/JoinableGameList';

import LobbyActions from 'actions/LobbyActions';
import GameActions from 'actions/GameActions';

import styles from 'css/components/lobby.css';

class Lobby extends Component {
  constructor(props) {
    super(props);

    this.doJoinGame = this.doJoinGame.bind(this);
    this.doCancelHosting = this.doCancelHosting.bind(this);
    this.navigateToMenu = this.navigateToMenu.bind(this);
    this.transitionToHostGame = this.transitionToHostGame.bind(this);

    this.state = {
      joinableGames: {
        display: true,
        animation: ''
      },
      hostGame: {
        display: false,
        animation: ''
      },
      lobbyAnimation: 'bounceInDown',
    };
  }

  componentWillMount() {
    const { sessions, connectToLobby } = this.props;
    connectToLobby(sessions.socket);
  }

  componentWillUnmount() {
    const { leaveLobby, hostedGame, cancelHosting } = this.props;
    const lobbyChannel = this.props.sessions.lobbyChannel;

    if (hostedGame) {
      cancelHosting(lobbyChannel, hostedGame);
    }

    leaveLobby(lobbyChannel);
  }

  navigateToMenu() {
    this.setState({
      lobbyAnimation: 'bounceOutDown'
    });

    setTimeout(() => browserHistory.push('/'), 600);
  }

  transitionToHostGame() {
    this.setState({
      joinableGames: {
        display: true,
        animation: 'bounceOutRight'
      }
    });

    setTimeout(() => {
      this.setState({
        joinableGames: {
          display: false,
          animation: ''
        },
        hostGame: {
          display: true,
          animation: 'bounceInLeft'
        }
      });
    }, 400);
  }

  doCancelHosting() {
    const { hostedGame, cancelHosting, sessions } = this.props;

    this.setState({
      hostGame: {
        display: true,
        animation: 'bounceOutRight'
      }
    });

    setTimeout(() => {
      this.setState({
        hostGame: {
          display: false,
          animation: ''
        },
        joinableGames: {
          display: true,
          animation: 'bounceInLeft'
        }
      });
    }, 400);

    cancelHosting(sessions.lobbyChannel, hostedGame);
  }

  doJoinGame(gameId) {
    const { sessions, connectToGame } = this.props;

    let params = {
      opponent: {
        id: sessions.userId,
        name: 'Dee'
      }
    };

    connectToGame(sessions.socket, gameId, params);
  }

  render() {
    const { colours, hostGame, lobbyChannel, hostedGame, connectToGame, sessions } = this.props;

    const lobbyClass = `animated ${this.state.lobbyAnimation}`;
    const gameListClass = `animated ${this.state.gameListAnimation}`;
    const hostGameClass = `animated ${this.state.hostGameAnimation}`;

    const titleStyle = { color: colours.interface.primary };
    const playerCountStyle = { color: colours.interface.button };

    return (
      <FlexContainer>
        <div className={lobbyClass}>
          <div styleName="lobby">
            <h1 styleName="title" style={titleStyle}>
              Game Lobby
            </h1>

            <PlayerCount style={playerCountStyle} />

            <JoinableGameList
              display={this.state.joinableGames.display}
              animation={this.state.joinableGames.animation}
              games={this.props.games}
              joinGame={this.doJoinGame}
              colours={colours.interface}
              transitionToHostGame={this.transitionToHostGame}
              navigateToMenu={this.navigateToMenu} />

            <HostGame
              display={this.state.hostGame.display}
              colours={colours.interface}
              beginHosting={name => {
                hostGame(lobbyChannel, name);
                connectToGame(sessions.socket);
              }}
              animation={this.state.hostGame.animation}
              cancelHosting={this.doCancelHosting} />
          </div>
        </div>
      </FlexContainer>
    );
  }
}

const mapDispatchToProps = {
  connectToLobby: LobbyActions.connectToLobby,
  connectToGame: GameActions.connectToGame,
  leaveLobby: LobbyActions.leaveLobby,
  fetchGames: LobbyActions.fetchGames,
  hostGame: LobbyActions.hostGame,
  cancelHosting: LobbyActions.cancelHosting
};

const mapStateToProps = state => ({
  lobbyChannel: state.sessions.lobbyChannel,
  gameChannel: state.sessions.gameChannel,
  games: state.lobby.games,
  hostedGame: state.lobby.hostedGame,
  players: state.lobby.presences,
  colours: state.colours,
  sessions: state.sessions,
});

Lobby = CSSModules(Lobby, styles);

export default connect(mapStateToProps, mapDispatchToProps)(Lobby);
