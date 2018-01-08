import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import navigationDebouncer from 'react-navigation-redux-debouncer';
import getRootReducer from './reducers';

const getStore = (navReducer) => {
  const store = createStore(
    getRootReducer(navReducer),
    applyMiddleware(
      thunkMiddleware,

      /* This middleware resolves the common problem with navigation actions being called twice if
       * you click fast enough. It will block all navigation actions during the predefined interval
       * after some navigation action has already been called.
       */
      navigationDebouncer()
    )
  );

  return store;
};

export default getStore;
