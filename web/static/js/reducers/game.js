import { combineReducers } from 'redux';
import * as constants from '../constants';

const round = (state = 1, action) => {
  switch (action.type) {
    case constants.NEXT_ROUND:
      return state + 1;

    default:
      return state;
  }
};

const difficulty = (state = '', action) => {
  switch (action.type) {
    case constants.SET_DIFFICULTY:
      return action.payload;

    default:
      return state;
  }
};

const hints = (state = [], action) => {
  switch (action.type) {
    case constants.RECEIVE_HINTS:
      return action.payload;

    case constants.CHANGE_LETTERS:
      return [];

    default:
      return state;
  }
};

export default combineReducers({
  round,
  hints,
  difficulty
});
