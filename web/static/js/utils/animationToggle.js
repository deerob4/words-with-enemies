import classnames from 'classnames';

const animationToggle = (animation, display) => (
  classnames({
    [`animated ${animation}`]: animation,
    hidden: !display
  })
);

export default animationToggle;
