import React, { Component } from 'react';
import { StyleSheet, Image, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createWallet, handleError } from '../actions';
import Title from '../components/Title';
import Paragraph from '../components/Paragraph';
import Footer from '../components/Footer';
import LargeButton from '../components/LargeButton';
import Link from '../components/Link';
import BaseView from './BaseView';

const windowDimensions = Dimensions.get('window');

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 146,
    marginBottom: 50
  },
  title: {
    marginBottom: windowDimensions.height < 600 ? 10 : 20
  },
  button: {
    marginBottom: 10
  }
});

@connect()
export default class WelcomeView extends Component {
  static navigationOptions = {
    header: null
  }

  _showRecoveryPhraseView(wallet) {
    const navigation = this.props.navigation;
    navigation.navigate('RecoveryPhrase', { wallet });
  }

  _showRecoverWalletView() {
    const navigation = this.props.navigation;
    navigation.navigate('RecoverWallet');
  }

  _createWallet() {
    const dispatch = this.props.dispatch;

    return dispatch(createWallet())
      .then((wallet) => {
        this._showRecoveryPhraseView(wallet);
      })
      .catch((error) => {
        dispatch(handleError(error));
      });
  }

  _recoverWallet() {
    this._showRecoverWalletView();
  }

  render() {
    return (
      <BaseView>
        <Image source={require('../img/illustrations/safe.png')} style={styles.image} />

        <Title style={styles.title}>
          Welcome to BitHodl
        </Title>

        <Paragraph>
          Time-lock your bitcoins and make sure to hold on to them even through the most volatile roller coasters.
        </Paragraph>

        <Footer>
          <LargeButton
            label='Create a new wallet'
            loadingLabel='Creating wallet...'
            onPress={this._createWallet.bind(this)}
            style={styles.button}
          />

          <Link onPress={this._recoverWallet.bind(this)}>
            Or recover an existing BitHodl wallet
          </Link>
        </Footer>
      </BaseView>
    );
  }
}

WelcomeView.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any
};
