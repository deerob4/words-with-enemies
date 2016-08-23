import * as constants from 'constants';
import { browserHistory } from 'react-router';

const Phoenix = require('../phoenix');
const Presence = Phoenix.Presence;

const Actions = {
  connectToLobby(socket) {
    return (dispatch, getState) => {
      const lobby = socket.channel('games:lobby');

      lobby.join().receive('ok', () => {
        dispatch({
          type: constants.CONNECT_TO_LOBBY,
          payload: lobby
        });

        dispatch(Actions.fetchGames(lobby));
      });

      lobby.on('presence_state', state => {
        const presences = getState().lobby.presences;

        dispatch({
          type: constants.INITIALISE_PRESENCE_STATE,
          payload: Presence.syncState(presences, state)
        });
      });

      lobby.on('presence_diff', diff => {
        const presences = getState().lobby.presences;

        dispatch({
          type: constants.RECEIVE_PRESENCE_DIFF,
          payload: Presence.syncDiff(presences, diff)
        });
      });

      lobby.on('add_game', (r) => {
        dispatch({
          type: constants.RECEIVE_JOINABLE_GAME,
          payload: r.game
        });
      });

      lobby.on('remove_game', (r) => {
        dispatch({
          type: constants.REMOVE_JOINABLE_GAME,
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
        .receive('ok', (r) => {
          dispatch({
            type: constants.FETCH_AVAILABLE_GAMES,
            payload: r.games
          });
        });
    };
  },

  hostGame(lobby, hostName) {
    return (dispatch, getState) => {
      const params = {
        host_name: hostName,
        host_id: getState().sessions.userId
      };

      console.log(hostName);

      lobby.push('games:create', params)
        .receive('ok', (r) => {
          dispatch({
            type: constants.HOST_GAME,
            payload: r.id
          });
        });
    };
  },

  cancelHosting(lobby, id) {
    return dispatch => {
      lobby.push('games:delete', { id })
        .receive('ok', (r) => {
          dispatch({
            type: constants.CANCEL_HOSTING,
          });
        });
    };
  },

  joinGame(lobby, gameId) {
    return {
      type: constants.JOIN_GAME,
      payload: gameId
    };
  }
};

export default Actions;
