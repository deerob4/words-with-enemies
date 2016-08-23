import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import CSSModules from 'react-css-modules';
import classnames from 'classnames';

import MenuButtons from 'components/lobby/MenuButtons';
import DifficultyButtons from 'components/lobby/DifficultyButtons';
import FlexContainer from 'components/FlexContainer';

import GameActions from '../actions/GameActions';
import MenuActions from '../actions/MenuActions';
import styles from 'css/components/menu.css';

class Menu extends Component {
  constructor(props) {
    super(props);

    this.showInstructions = this.showInstructions.bind(this);
    this.showDifficultyButtons = this.showDifficultyButtons.bind(this);
    this.transitionToLobby = this.transitionToLobby.bind(this);
    this.startGame = this.startGame.bind(this);

    this.state = {
      menuButtons: {
        display: true,
        animation: 'bounceInUp'
      },
      difficultyButtons: {
        display: false,
        animation: ''
      },
      menuAnimation: '',
    };
  }

  componentDidMount() {
    const { sessions, generateInitialColours } = this.props;

    if (sessions.initialLoad) {
      generateInitialColours();
    }
  }

  showInstructions() {
    this.setState({
      menuAnimation: 'bounceOutRight'
    });
  }

  showDifficultyButtons() {
    const { connectToGame, sessions } = this.props;

    this.setState({
      menuButtons: {
        display: true,
        animation: 'bounceOutRight',
      },
    });

    setTimeout(() => {
      this.setState({
        menuButtons: {
          display: false,
          animation: ''
        },
        difficultyButtons: {
          display: true,
          animation: 'bounceInLeft'
        }
      });
    }, 400);

    connectToGame(sessions.socket, 'ai');
  }

  startGame(difficulty) {
    const { startGame, gameChannel, sessions, connectToGame } = this.props;

    this.setState({
      menuAnimation: 'bounceOutRight'
    });

    setTimeout(() => startGame(gameChannel, difficulty), 600);
  }

  transitionToLobby() {
    this.setState({
      menuAnimation: 'bounceOutDown'
    });

    setTimeout(() => browserHistory.push('/lobby'), 600);
  }

  render() {
    let { startGame, colours, sessions } = this.props;

    let channel = sessions.gameChannel;

    let { primary, secondary, button } = colours.interface;
    let headingColour = { color: primary };
    let subheadingColour = { color: secondary };
    let buttonStyle = { color: button, borderColor: button };

    let menuClass = classnames({
      [`animated ${this.state.menuAnimation}`]: this.state.menuAnimation
    });

    return (
      <FlexContainer>
        <div className={menuClass}>
          <div styleName="lobby">
            <div className="animated bounceInDown">
              <h1
                styleName="heading"
                style={headingColour}>
                Words With Enemies
              </h1>
              <h2
                styleName="subheading"
                style={subheadingColour}>
                Expand your vocabulary whilst boosting your ego!
              </h2>
            </div>

            <MenuButtons
              display={this.state.menuButtons.display}
              animation={this.state.menuButtons.animation}
              buttonStyle={buttonStyle}
              showInstructions={this.showInstructions}
              showDifficultyButtons={this.showDifficultyButtons}
              transitionToLobby={this.transitionToLobby} />

            <DifficultyButtons
              display={this.state.difficultyButtons.display}
              animation={this.state.difficultyButtons.animation}
              buttonStyle={buttonStyle}
              startGame={difficulty => this.startGame(difficulty)} />
          </div>
        </div>
      </FlexContainer>
    );
  }
}

const mapDispatchToProps = {
  connectToGame: GameActions.connectToGame,
  startGame: MenuActions.startGame,
  generateInitialColours: MenuActions.generateInitialColours
};

const mapStateToProps = state => ({
  colours: state.colours,
  gameChannel: state.sessions.gameChannel,
  sessions: state.sessions,
});

Menu = CSSModules(Menu, styles);

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
