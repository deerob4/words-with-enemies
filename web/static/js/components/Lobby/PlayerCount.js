import React, { Component } from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';

import styles from 'css/components/player-count.css';

const message = count => (
  count > 1
  ? `${count} players`
  : 'just you'
);

let PlayerCount = props => {
  const count = Object.keys(props.players).length;

  return (
    <h2
      styleName="player-count"
      style={props.style}>
      {message(count)} online
    </h2>
  );
};

const mapStateToProps = state => ({
  players: state.lobby.presences
});

PlayerCount = CSSModules(PlayerCount, styles);

export default connect(mapStateToProps)(PlayerCount);
