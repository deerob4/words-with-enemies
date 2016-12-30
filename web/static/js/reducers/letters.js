import {
  ADD_LETTER,
  CHANGE_LETTERS,
  RECEIVE_INITIAL_LETTERS,
  SET_OPPONENT_WORD,
  BEGIN_MULTIPLAYER_GAME,
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

    case BEGIN_MULTIPLAYER_GAME:
      return action.payload.letters;

    case SET_OPPONENT_WORD:
      let newLetters = action.payload.reduce((obj, letter) => ({
        ...obj,
        [letter.id]: letter.value
      }), {});

      return { ...state, ...newLetters };

    default:
      return state;
  }
};

export default letters;


