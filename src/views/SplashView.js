import React, { Component } from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { loadSettings, getWallet, syncAddresses, navigateWithReset } from '../actions';
import BaseView from './BaseView';

@connect()
export default class SplashView extends Component {
  static navigationOptions = {
    header: null
  }

  componentWillMount() {
    const dispatch = this.props.dispatch;

    dispatch(loadSettings());

    dispatch(getWallet())
      .then((wallet) => {
        if (wallet) {
          dispatch(syncAddresses()).catch(() => {
            // Suppress errors (we don't want to show an error if there's no internet connection).
          });

          this._showHomeView();
        } else {
          this._showWelcomeView();
        }
      })
      .catch(() => {
        this._showWelcomeView();
      });
  }

  _showHomeView() {
    const dispatch = this.props.dispatch;
    dispatch(navigateWithReset('Home')); //DEBUG: Home
  }

  _showWelcomeView() {
    const dispatch = this.props.dispatch;
    dispatch(navigateWithReset('Welcome'));
  }

  render() {
    return (
      <BaseView>
        <Text>Loading...</Text>
      </BaseView>
    );
  }
}

SplashView.propTypes = {
  dispatch: PropTypes.func
};
