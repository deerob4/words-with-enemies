import React, { Component, PropTypes } from 'react';

const Greeter = props => {
  const style = { color: props.colour };

  return (
    <h1 style={style}>
      Hello, {props.name}!
    </h1>
  );
};

Greeter.propTypes = {
  colour: PropTypes.string,
  name: PropTypes.string.isRequired,
};

Greeter.defaultProps = {
  colour: '#000'
};

export default Greeter;
