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

const message = (state = 'Go on friend, you can do it!', action) => {
  switch (action.type) {
    case constants.GET_HINT:
      const hint = action.payload;
      return `Hint: ${hint.definition} (${hint.word})`;

    case constants.HINTS_NOT_AVAILABlE:
      return 'Hints aren\'t available yet - try and work it out yourself!';

    case constants.WORD_VALID:
      return 'Yes, you can make that word!';

    case constants.WORD_INVALID:
      return 'That\'s not a real word!';

    default:
      return state;
  }
};

export default combineReducers({
  round,
  hints,
  message,
  difficulty
});
