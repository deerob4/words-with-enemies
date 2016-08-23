import React, { Component } from 'react';
import { render } from 'react-dom';
import Root from './containers/Root';
import { AppContainer } from 'react-hot-loader';
import configureStore from './store';

import 'css/typography.css';

const store = configureStore();

render(
  <AppContainer>
    <Root store={store} />
  </AppContainer>,
  document.getElementById('app')
);

if (module.hot) {
  module.hot.decline('./routes/index');
  module.hot.accept('./containers/Root', () => {
    const NextApp = require('./containers/Root').default;
    render(
      <AppContainer>
        <NextApp store={store} />
      </AppContainer>,
      document.getElementById('app')
    );
  });
}
