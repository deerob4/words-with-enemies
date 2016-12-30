import * as constants from 'constants';
import GameActions from 'actions/GameActions';
import { browserHistory } from 'react-router';

const Phoenix = require('../phoenix');
const Presence = Phoenix.Presence;

const LobbyActions = {
  connectToLobby(socket) {
    return (dispatch, getState) => {
      const lobby = socket.channel('games:lobby');

      lobby.join().receive('ok', () => {
        dispatch({
          type: constants.CONNECT_TO_LOBBY,
          payload: lobby
        });

        dispatch(LobbyActions.fetchGames(lobby));
      });

      // Keeps track of the # of online users.

      lobby.on('player_presence_state', state => {
        const players = getState().lobby.players;

        dispatch({
          type: constants.INITIALISE_PLAYER_PRESENCE_STATE,
          payload: Presence.syncState(players, state)
        });
      });

      lobby.on('presence_diff', diff => {
        const players = getState().lobby.players;

        dispatch({
          type: constants.PLAYER_DIFF,
          payload: Presence.syncDiff(players, diff)
        });
      });

      // Keeps track of the games that are available to join.

      lobby.on('add_game', game => {
        dispatch({
          type: constants.ADD_LOBBY_GAME,
          payload: game
        });
      });

      lobby.on('remove_game', r => {
        dispatch({
          type: constants.REMOVE_LOBBY_GAME,
          payload: r.id
        });
      });
    };
  },

  leaveLobby(lobby) {
    lobby.leave();

    return {
      type: constants.LEAVE_LOBBY
    };
  },

  fetchGames(lobby) {
    return dispatch => {
      lobby.push('games:fetch')
        .receive('ok', r => {
          dispatch({
            type: constants.FETCH_LOBBY_GAMES,
            payload: r.games
          });
        });
    };
  },

  hostGame(lobby, hostName) {
    return (dispatch, getState) => {
      const params = {
        name: hostName,
      };

      lobby.push('games:create', params)
        .receive('ok', (r) => {
          const socket = getState().sessions.socket;

          dispatch({
            type: constants.HOST_GAME,
            payload: r.id
          });

          dispatch(GameActions.connectToGame(socket, r.id));
        });
    };
  },

  joinGame(lobby, id) {
    return (dispatch, getState) => {
      // Create initial contact with the game
      lobby.push('games:connect', { id, name: 'theunlawfultruth' })
        .receive('ok', r => {
          const socket = getState().sessions.socket;
          // Connect to the actual game channel. Future
          // actions are in GameActions.
          dispatch(GameActions.connectToGame(socket, id));
        });
    };
  },

  cancelHosting(lobby, id) {
    return (dispatch, getState) => {
      lobby.push('games:delete', { id })
        .receive('ok', (r) => {
          const gameChannel = getState().sessions.gameChannel;

          dispatch({
            type: constants.CANCEL_HOSTING,
          });

          dispatch(GameActions.leaveGame(gameChannel, id));
        });
    };
  },
};

export default LobbyActions;
