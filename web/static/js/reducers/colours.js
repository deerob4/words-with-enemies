import { combineReducers } from 'redux';
import nextId from 'utils/nextId';

import {
  GENERATE_INITIAL_COLOURS,
  RECEIVE_INITIAL_LETTERS,
  BEGIN_MULTIPLAYER_GAME,
  SET_OPPONENT_WORD,
  CHANGE_COLOURS,
  ADD_LETTER
} from '../constants';

const letters = (state = {}, action) => {
  switch (action.type) {
    case RECEIVE_INITIAL_LETTERS:
    case BEGIN_MULTIPLAYER_GAME:
      return action.payload.colours.reduce((letters, colours, i) => ({
        ...letters,
        [i]: colours
      }), {});

    case CHANGE_COLOURS:
      return action.payload.letters;

    case SET_OPPONENT_WORD:
      const newColours = action.payload.reduce((colours, letter) => ({
        ...colours,
        [letter.id]: letter.colours
      }), {});

      return { ...state, ...newColours };

    case ADD_LETTER:
      return {
        ...state,
        [action.payload.id]: action.payload.colours
      };

    default:
      return state;
  }
};

const _interface = (state = {}, action) => {
  switch (action.type) {
    case GENERATE_INITIAL_COLOURS:
    case CHANGE_COLOURS:
      return action.payload.interface;

    default:
      return state;
  }
};

const players = (state = {}, action) => {
  switch (action.type) {
    case GENERATE_INITIAL_COLOURS:
    case CHANGE_COLOURS:
      return action.payload.players;

    default:
      return state;
  }
};

export default combineReducers({
  interface: _interface,
  letters,
  players
});
