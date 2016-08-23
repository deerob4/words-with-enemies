import React from 'react';
import classnames from 'classnames';
import CSSModules from 'react-css-modules';
import styles from 'css/components/flex-container.css';

const FlexContainer = (props) => {
  return (
    <div styleName="flex-container" className={props.className}>
      <div styleName={props.innerClass}>
        {props.children}
      </div>
    </div>
  );
};

export default CSSModules(FlexContainer, styles);
