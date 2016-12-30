import values from 'lodash/values';
import { findKey } from 'lodash';
import * as constants from '../constants';
import nextId from 'utils/nextId';
import { generateColours, letterColours } from 'utils/generateColours';

const GameActions = {
  connectToGame(socket, gameId) {
    return (dispatch, getState) => {
      const channel = socket.channel(`games:${gameId}`);
      const userId = getState().sessions.userId;

      channel.join()
        .receive('ok', () => {
          dispatch({
            type: constants.CONNECT_TO_GAME,
            payload: channel
          });
        })
        .receive('error', r => {
          dispatch({
            type: constants.CONNECT_TO_GAME_FAILURE,
            payload: r.reason
          });
        });

      channel.on('begin_game', (r) => {
        dispatch({
          type: constants.BEGIN_MULTIPLAYER_GAME,
          payload: {
            colours: Object.keys(r.indexedLetters).map(x => letterColours()),
            letters: r.indexedLetters,
            playerLetters: r.playerLetters[userId]
          }
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
      const letters = state.player.word;

      if (!letters.length) {
        dispatch(GameActions.wordInvalid());
      } else {
        let word = letters.map(l => state.letters[l]).join('');

        channel.push('games:check_validity', { word })
          .receive('ok', ({ valid }) => {
            if (valid) {
              dispatch({ type: constants.WORD_VALID });
              dispatch(GameActions.computerTurn(channel, word));
            } else {
              dispatch(GameActions.wordInvalid());
            }
          });
      }

    };
  },

  wordInvalid() {
    return dispatch => {
      dispatch({
        type: constants.WORD_INVALID
      });

      setTimeout(() => {
        dispatch({
          type: constants.END_CHECKING
        });
      }, 900);
    };
  },

  computerTurn(channel, userWord) {
    return (dispatch, getState) => {
      dispatch({ type: constants.COMPUTER_THINKING });

      const params = {
        difficulty: getState().game.difficulty,
        user_word: userWord
      };

      channel.push('games:generate_word', params)
        .receive('ok', r => {
          dispatch(GameActions.setOpponentWord(r.word));
        });
    };
  },

  setOpponentWord(word) {
    return (dispatch, getState) => {
      const letters = word.split('');
      // Letters are stored in an object, keyed by an incrementing
      // integer. Here we get the highest key, so all the new letter IDs
      // can start at the correct place.
      const idBase = Object.keys(getState().letters).length;

      dispatch({
        type: constants.SET_OPPONENT_WORD,
        payload: letters.map((value, i) => ({
          id: i+idBase,
          value,
          colours: letterColours()
        }))
      });
    };
  }
};

export default GameActions;
