import { combineReducers } from 'redux';
import * as constants from '../constants';

const games = (state = [], action) => {
  switch (action.type) {
    case constants.FETCH_AVAILABLE_GAMES:
      return action.payload;

    case constants.RECEIVE_JOINABLE_GAME:
      return [...state, action.payload];

    case constants.REMOVE_JOINABLE_GAME:
      return state.filter(g => g.id !== action.payload);

    default:
      return state;
  }
};

const hostedGame = (state = null, action) => {
  switch (action.type) {
    case constants.HOST_GAME:
      return action.payload;

    case constants.CANCEL_HOSTING:
      return null;

    default:
      return state;
  }
};

const presences = (state = {}, action) => {
  switch (action.type) {
    case constants.INITIALISE_PRESENCE_STATE:
    case constants.RECEIVE_PRESENCE_DIFF:
      return action.payload;

    default:
      return state;
  }
};

export default combineReducers({
  games,
  presences,
  hostedGame
});
