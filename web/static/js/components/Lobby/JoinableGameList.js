import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import animationToggle from 'utils/animationToggle';

import Button from 'components/Button';
import JoinableGame from 'components/Lobby/JoinableGame';

import styles from 'css/components/joinable-games.css';

const JoinableGameList = props => {
  const {
    games,
    colours,
    display,
    joinGame,
    transitionToHostGame,
    animation,
    navigateToMenu,
  } = props;

  const messageStyle = {
    color: colours.secondary
  };

  const buttonStyle = {
    color: colours.button,
    borderColor: colours.button
  };

  const joinableGamesClass = animationToggle(animation, display);

  return (
    <div className={joinableGamesClass}>
      {games.length
        ? <ul styleName="game-list">
            {games.map(game => (
              <JoinableGame
                key={game.id}
                game={game}
                joinGame={() => joinGame(game.id)}
                borderColor={colours.secondary}
                messageStyle={messageStyle}
                buttonStyle={buttonStyle} />
            ))}
          </ul>

        : <h2 styleName="no-game-message" style={messageStyle}>
            No games available.
            <br />
            Why not host one yourself?
          </h2>
      }

      <div>
        <Button
          type="joinable-game"
          style={buttonStyle}
          onClick={transitionToHostGame}>
          Host game
        </Button>

        <Button
          type="joinable-game-last"
          style={buttonStyle}
          onClick={navigateToMenu}>
          Go back
        </Button>
      </div>
    </div>
  );
};

JoinableGameList.propTypes = {
  animation: PropTypes.string.isRequired,
  display: PropTypes.bool.isRequired,
  games: PropTypes.array.isRequired,
  colours: PropTypes.object.isRequired,
  transitionToHostGame: PropTypes.func.isRequired,
  joinGame: PropTypes.func.isRequired,
  navigateToMenu: PropTypes.func.isRequired
};

export default CSSModules(JoinableGameList, styles);
