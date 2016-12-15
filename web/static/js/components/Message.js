import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from 'css/components/message.css';

const Message = ({ message, colour }) => (
  <h1 styleName="message" style={{ color: colour }}>
    {message}
  </h1>
);

Message.propTypes = {
  colour: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired
};

export default CSSModules(Message, styles);
