import * as constants from '../constants';

const initalState = {
  userId: null,
  initialLoad: true,
  socket: null,
  lobbyChannel: null,
  gameChannel: null
};

function socket(state = initalState, action) {
  switch (action.type) {
    case constants.GENERATE_INITIAL_COLOURS:
      return { ...state, initialLoad: false };

    case constants.CREATE_SOCKET:
      return {
        ...state,
        socket: action.payload.socket,
        userId: action.payload.userId
      };

    case constants.CONNECT_TO_LOBBY:
      return { ...state, lobbyChannel: action.payload };

    case constants.LEAVE_LOBBY:
      return { ...state, lobbyChannel: null };

    case constants.CONNECT_TO_GAME:
      return { ...state, gameChannel: action.payload };

    case constants.LEAVE_GAME:
      return { ...state, gameChannel: null };

    default:
      return state;
  }
}

export default socket;
