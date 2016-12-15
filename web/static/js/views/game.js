import React, { Component } from 'react';
import { connect } from 'react-redux';

import InfoBar from 'components/InfoBar';
import LetterSet from 'components/LetterSet';
import FlexContainer from 'components/FlexContainer';
import GameButtons from 'components/GameButtons';
import Divider from 'components/Divider';
import Message from 'components/Message';

import setNounOwnership from 'utils/setNounOwnership';
import GameActions from 'actions/GameActions';

class Game extends Component {
  componentWillUnmount() {
    const { sessions, leaveGame } = this.props;
    leaveGame(sessions.lobbyChannel);
  }

  render() {
    const props = this.props;

    const { moveToWord, moveToBank, changeColours, game, opponent } = props;
    const playerColours = props.colours.players.player;
    const opponentColours = props.colours.players.opponent;
    const gameChannel = props.sessions.gameChannel;
    const opponentName = setNounOwnership(opponent.name);

    return (
      <FlexContainer innerClass="game-container">
        <div className="animated bounceInLeft">
          <InfoBar />

          <Message message={game.message} colour={props.colours.interface.secondary} />

          <LetterSet
            type="well"
            colours={{
              backgroundColor: playerColours.secondary,
              borderColor: playerColours.tertiary,
              color: playerColours.tertiary
            }}
            letters={this.props.player.word}
            onClick={id => moveToBank(id)}
            message="Make a word with your letters!" />

          <LetterSet
            type="well"
            colours={{
              backgroundColor: opponentColours.secondary,
              borderColor: opponentColours.tertiary,
              color: opponentColours.tertiary
            }}
            letters={[]}
            message={`${opponentName} word will go here!`} />

          <GameButtons
            buttonStyle={{
              backgroundColor: props.colours.interface.primary,
              borderColor: props.colours.interface.secondary,
              color: props.colours.interface.button,
            }}
            getHint={() => props.getHint(gameChannel)}
            addLetter={() => props.addLetter(gameChannel)}
            getAnswers={() => props.getAnswers(gameChannel)}
            checkValidity={() => props.checkValidity(gameChannel)}
            changeColours={props.changeColours}
            changeLetters={() => props.changeLetters(gameChannel)} />

          <Divider colour={props.colours.interface.secondary} />

          <LetterSet
            type="bank"
            letters={this.props.player.bank}
            onClick={id => moveToWord(id)} />
        </div>
      </FlexContainer>
    );
  }
}

const mapDispatchToProps = {
  leaveGame: GameActions.leaveGame,
  getHint: GameActions.getHint,
  addLetter: GameActions.addLetter,
  checkValidity: GameActions.checkValidity,
  getAnswers: GameActions.getAnswers,
  moveToWord: GameActions.moveToWord,
  moveToBank: GameActions.moveToBank,
  changeColours: GameActions.changeColours,
  changeLetters: GameActions.changeLetters,
};

const mapStateToProps = state => ({
  player: {
    ...state.player,
    bank: createLetters(state.player.bank, state),
    word: createLetters(state.player.word, state)
  },
  opponent: state.opponent,
  colours: state.colours,
  game: state.game,
  sessions: state.sessions,
});

const createLetters = (letters, state) => {
  return letters.map(id => ({
    id,
    value: state.letters[id],
    colours: state.colours.letters[id]
  }));
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);
