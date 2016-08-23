import {
  ADD_LETTER,
  CHANGE_LETTERS,
  RECEIVE_INITIAL_LETTERS,
} from '../constants';

const letters = (state = {}, action) => {
  switch (action.type) {
    case ADD_LETTER:
      return {
        ...state,
        [action.payload.id]: action.payload.letter
      };

    case RECEIVE_INITIAL_LETTERS:
    case CHANGE_LETTERS:
      return action.payload.letters.reduce((obj, letter, i) => ({
        ...obj,
        [i]: letter
      }), {});

    default:
      return state;
  }
};

export default letters;
