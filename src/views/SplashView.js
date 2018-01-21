import React, { Component } from 'react';
import { StyleSheet, Text, Image, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { loadSettings, getWallet, syncAddresses, navigateWithReset } from '../actions';
import Footer from '../components/Footer';
import BaseView from './BaseView';

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fec98a'
  },
  icon: {
    width: 64,
    height: 95
  },
  footer: {
    backgroundColor: 'transparent'
  },
  loader: {
    height: 42
  }
});

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
    dispatch(navigateWithReset('Home'));
  }

  _showWelcomeView() {
    const dispatch = this.props.dispatch;
    dispatch(navigateWithReset('Welcome'));
  }

  render() {
    return (
      <BaseView style={styles.view}>
        <Image source={require('../img/launch-screen/launch-screen-icon.png')} style={styles.icon} />

        <Footer style={styles.footer}>
          <ActivityIndicator animating={true} color='#D59247' style={styles.loader} size='small' />
        </Footer>
      </BaseView>
    );
  }
}

SplashView.propTypes = {
  dispatch: PropTypes.func
};
