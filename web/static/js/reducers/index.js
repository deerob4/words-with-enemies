import { combineReducers } from 'redux';

import game from './game';
import lobby from './lobby';
import player from './player';
import letters from './letters';
import colours from './colours';
import opponent from './opponent';
import sessions from './sessions';

export default combineReducers({
  game,
  lobby,
  player,
  colours,
  letters,
  opponent,
  sessions
});
