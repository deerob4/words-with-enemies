import values from 'lodash/values';
import * as constants from '../constants';
import nextId from 'utils/nextId';
import { generateColours, letterColours } from 'utils/generateColours';

const GameActions = {
  connectToGame(socket, gameId, params = {}) {
    return dispatch => {
      const channel = socket.channel(`games:${gameId}`, params);

      channel.join().receive('ok', () => {
        dispatch({
          type: constants.CONNECT_TO_GAME,
          payload: channel
        });
      });

      channel.on('receive_hints', (r) => {
        dispatch({
          type: constants.RECEIVE_HINTS,
          payload: r.hints
        });
      });
    };
  },

  leaveGame(channel) {
    channel.leave();

    return {
      type: constants.LEAVE_GAME
    };
  },

  changeColours() {
    return (dispatch, getState) => {
      const { letters, players } = getState();

      dispatch({
        type: constants.CHANGE_COLOURS,
        payload: generateColours(letters, [0, 1])
      });
    };
  },

  addLetter(channel) {
    return (dispatch, getState) => {
      let letters = values(getState().letters);
      channel.push('games:add_letter', { letters })
        .receive('ok', r => {
          dispatch({
            type: constants.ADD_LETTER,
            payload: {
              id: nextId(getState().letters),
              letter: r.letter,
              colours: letterColours()
            }
          });
        });
    };
  },

  getAnswers(channel) {
    return (dispatch, getState) => {
      let letters = values(getState().letters);
      channel.push('games:get_words', { letters })
        .receive('ok', r => {
          console.log(r.words);
        });
    };
  },

  changeLetters(channel) {
    return (dispatch, getState) => {
      let difficulty = getState().game.difficulty;
      channel.push('games:change_letters', { difficulty })
        .receive('ok', r => {
          dispatch({
            type: constants.CHANGE_LETTERS,
            payload: r
          });
        });
    };
  },

  getHint(channel) {
    return (dispatch, getState) => {
      const hints = getState().game.hints;

      if (hints.length) {
        const hint = hints[Math.floor(Math.random()*hints.length)];
        dispatch({
          type: constants.GET_HINT,
          payload: hint
        });

        if (hints.length === 3) {
          let difficulty = getState().game.difficulty;
          let letters = Object.values(getState().letters);
          channel.push('games:new_hints', { difficulty, letters });
        }
      } else {
        dispatch({
          type: constants.HINTS_NOT_AVAILABlE,
        });
      }
    };
  },

  moveToWord(letterId) {
    return {
      type: constants.MOVE_LETTER_TO_WORD,
      payload: letterId
    };
  },

  moveToBank(letterId) {
    return {
      type: constants.MOVE_LETTER_TO_BANK,
      payload: letterId
    };
  },

  checkValidity(channel) {
    return (dispatch, getState) => {
      const state = getState();
      let word = state.player.word.map(l => state.letters[l]).join('');

      channel.push('games:check_validity', { word })
        .receive('ok', ({ valid }) => {
          dispatch({
            type: valid
                  ? constants.WORD_VALID
                  : constants.WORD_INVALID
          });
        });
    };
  }
};

export default GameActions;
