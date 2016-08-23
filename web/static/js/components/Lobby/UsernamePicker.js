import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import animationToggle from 'utils/animationToggle';

import Button from 'components/Button';

import styles from 'css/components/username-picker.css';

class UsernamePicker extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);

    this.state = { username: '' };
  }

  onChange(e) {
    this.setState({
      username: e.target.value
    });
  }

  render() {
    const props = this.props;

    const usernameInputStyle = {
      color: props.colours.secondary,
      borderColor: props.colours.primary
    };

    const usernamePickerClass = animationToggle(props.animation, props.display);

    return (
      <div className={usernamePickerClass}>
        <div styleName="username-picker">
          <h2
            styleName="username-message"
            style={props.messageStyle}>
            Enter a username:
          </h2>

          <input
            type="text"
            ref="username"
            onChange={this.onChange}
            value={this.state.username}
            placeholder="dalliard93"
            styleName="username-input"
            style={usernameInputStyle} />
        </div>

        <div styleName="button">
          <Button
            type="begin-hosting"
            style={props.buttonStyle}
            onClick={() => {
              const username = this.state.username;

              if (username) {
                props.onClick(this.state.username);
              } else {
                alert('Enter a username, bud!');
              }
            }}>
            {props.buttonMessage}
          </Button>
        </div>
      </div>
    );
  }
}

UsernamePicker.propTypes = {
  colours: PropTypes.object.isRequired,
  display: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  buttonMessage: PropTypes.string.isRequired
};

export default CSSModules(UsernamePicker, styles);
