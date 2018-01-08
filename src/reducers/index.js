import { combineReducers } from 'redux';
import wallet from './wallet';
import addresses from './addresses';
import error from './error';
import settings from './settings';

const getRootReducer = (navReducer) => {
  const rootReducer = combineReducers({
    nav: navReducer,
    wallet,
    addresses,
    error,
    settings
  });

  return rootReducer;
};

export default getRootReducer;
