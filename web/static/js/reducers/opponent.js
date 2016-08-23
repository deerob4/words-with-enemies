import { combineReducers } from 'redux';
import * as constants from '../constants';

const name = (state = 'Computer', action) => {
  switch (action.type) {
    case constants.SET_OPPONENT_NAME:
      return action.payload;

    default:
      return state;
  }
};

const score = (state = 0, action) => {
  switch (action.type) {
    case constants.INCREMENT_OPPONENT_SCORE:
      return state + 1;

    default:
      return state;
  }
};

const word = (state = [], action) => {
  switch (action.type) {
    case constants.ADD_LETTER_TO_OPPONENT_WORD:
      return [...state, action.payload];

    case constants.REMOVE_LETTER_FROM_OPPONENT_WORD:
      return state.filter(x => x !== action.payload);

    case constants.SET_OPPONENT_WORD:
      return action.payload;

    default:
      return state;
  }
};

export default combineReducers({
  name,
  word,
  score,
});
