import { combineReducers } from 'redux';
import * as constants from '../constants';

const name = (state = 'Dee', action) => {
  switch (action.type) {
    case constants.SET_PLAYER_NAME:
      return action.payload;

    default:
      return state;
  }
};

const bank = (state = [], action) => {
  switch (action.type) {
    case constants.RECEIVE_INITIAL_LETTERS:
    case constants.CHANGE_LETTERS:
      return action.payload.letters.map((l, i) => i);

    case constants.BEGIN_MULTIPLAYER_GAME:
      return action.payload.playerLetters;

    case constants.ADD_LETTER:
      return [...state, action.payload.id];

    case constants.MOVE_LETTER_TO_BANK:
      return [...state, action.payload];

    case constants.MOVE_LETTER_TO_WORD:
      return state.filter(x => x !== action.payload);

    default:
      return state;
  }
};

const word = (state = [], action) => {
  switch (action.type) {
    case constants.MOVE_LETTER_TO_WORD:
      return [...state, action.payload];

    case constants.MOVE_LETTER_TO_BANK:
      return state.filter(x => x !== action.payload);

    case constants.CHANGE_LETTERS:
      return [];

    default:
      return state;
  }
};

const score = (state = 0, action) => {
  switch (action.type) {
    case constants.INCREMENT_SCORE:
      return state + 1;

    default:
      return state;
  }
};

export default combineReducers({
  name,
  score,
  word,
  bank
});
