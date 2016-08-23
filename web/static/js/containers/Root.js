import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import routes from '../routes';
import createSocket from 'actions/SocketActions';

class Root extends Component {
  componentWillMount() {
    this.props.store.dispatch(createSocket());
  }

  render() {
    return (
      <Provider store={this.props.store}>
        <Router
          routes={routes}
          history={browserHistory} />
      </Provider>
    );
  }
}

const state = {
  colours: {
    button: {},
    text: {},
    letters: {
      0: {},
      1: {}
    },
    players: {
      0: {},
      1: {}
    }
  },
  game: {
    letters: {
      0: 'a',
      1: 'b',
      2: 'c',
      3: 'd',
    },
    players: {
      0: {
        name: 'Keir',
        score: 0,
        bank: [1, 2, 3],
        word: [2, 0, 8]
      },
      1: {
        name: 'Rose',
        score: 0,
        bank: [1, 2, 3],
        word: [2, 0, 8]
      }
    }
  },
  sessions: {
    socket: null,
    channels: {
      lobby: null,
      game: null
    }
  }
};

export default Root;
