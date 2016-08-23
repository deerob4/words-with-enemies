import React, { PropTypes } from 'react';
import Letter from './Letter';
import LetterBlocks from './LetterBlocks';
import CSSModules from 'react-css-modules';
import styles from 'css/components/letters.css';

const LetterSet = props => {
  const styleName =
    props.type === 'well' && !props.letters.length
    ? 'empty-well'
    : props.type;

  return (
    <div styleName={styleName} style={props.colours}>
      {props.letters.length
       // Only show the message if there are no letters.
       ? <LetterBlocks
            letters={props.letters}
            onClick={props.onClick} />
       : <span>{props.message}</span>}
    </div>
  );
};

LetterSet.propTypes = {
  colours: PropTypes.object,
  letters: PropTypes.array.isRequired,
  message: PropTypes.string,
  type: PropTypes.oneOf(['bank', 'well']).isRequired,
};

LetterSet.defaultProps = {
  type: 'well'
};

export default CSSModules(LetterSet, styles);
