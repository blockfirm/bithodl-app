import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import PropTypes from 'prop-types';
import { Provider, connect } from 'react-redux';
import { addNavigationHelpers } from 'react-navigation';

import AppNavigator from './AppNavigator';
import getStore from './getStore';

const navReducer = (state, action) => {
  const newState = AppNavigator.router.getStateForAction(action, state);
  return newState || state;
};

const store = getStore(navReducer);

@connect((state) => ({
  nav: state.nav
}))
class AppWithNavigationState extends Component {
  render() {
    return (
      <AppNavigator
        navigation={addNavigationHelpers({
          dispatch: this.props.dispatch,
          state: this.props.nav
        })}
      />
    );
  }
}

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func,
  nav: PropTypes.object
};

export default class App extends Component {
  constructor() {
    super(...arguments);

    StatusBar.setHidden(false);
    StatusBar.setBarStyle('default');
  }

  render() {
    return (
      <Provider store={store}>
        <AppWithNavigationState />
      </Provider>
    );
  }
}
