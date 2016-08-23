import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';

import Score from './Score';
import Round from './Round';

import styles from 'css/components/info-bar.css';

let InfoBar = props => (
  <div styleName="info-bar">
    <Score
      user="player"
      name={props.player.name}
      score={props.player.score}
      colour={props.player.colours.tertiary} />

    <Round
      colour={props.roundColour}
      round={props.round} />

    <Score
      user="opponent"
      name={props.opponent.name}
      score={props.opponent.score}
      colour={props.opponent.colours.tertiary} />
  </div>
);

const mapStateToProps = state => ({
  round: state.game.round,
  roundColour: state.colours.interface.secondary,
  player: {
    ...state.player,
    colours: state.colours.players.player
  },
  opponent: {
    ...state.opponent,
    colours: state.colours.players.opponent
  }
});

InfoBar = CSSModules(InfoBar, styles);

export default connect(mapStateToProps)(InfoBar);
