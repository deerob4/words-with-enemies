import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import rootReducer from '../reducers';

const logger = createLogger({
  collapsed: true
});

function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    applyMiddleware(thunk, logger)
  );

  if (module.hot) {
    let nextReducer = require('../reducers').default;

    module.hot.accept('../reducers', () => {
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}

export default configureStore;
