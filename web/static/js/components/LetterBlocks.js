import React, { PropTypes } from 'react';
import Letter from './Letter';

const LetterBlocks = props => {
  return (
    <ul>
      {props.letters.map(letter => (
        <Letter
          key={letter.id}
          value={letter.value}
          onClick={() => props.onClick(letter.id)}
          colours={letter.colours} />
      ))}
    </ul>
  );
};

LetterBlocks.propTypes = {
  letters: PropTypes.array.isRequired
};

export default LetterBlocks;
