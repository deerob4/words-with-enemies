import * as constants from 'constants';
import { browserHistory } from 'react-router';
import { letterColours, generateColours } from '../utils/generateColours';

const Actions = {
  addPlayer() {
    return {
      type: constants.ADD_PLAYER,
      payload: {
        id: 0,
        initialLetters: [0, 2, 9]
      }
    };
  },

  generateInitialColours() {
    return {
      type: constants.GENERATE_INITIAL_COLOURS,
      payload: generateColours([], [0, 1])
    };
  },

  receiveInitialLetters(letters) {
    return {
      type: constants.RECEIVE_INITIAL_LETTERS,
      payload: {
        letters,
        colours: letters.map(() => letterColours())
      }
    };
  },

  setDifficulty(difficulty) {
    return {
      type: constants.SET_DIFFICULTY,
      payload: difficulty
    };
  },

  startGame(channel, difficulty) {
    return dispatch => {
      channel.push('games:start', { difficulty })
        .receive('ok', r => {
          dispatch(Actions.setDifficulty(difficulty));
          dispatch(Actions.receiveInitialLetters(r.letters));

          browserHistory.push('/game');
        });
    };
  }
};

export default Actions;
