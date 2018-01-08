import React, { Component } from 'react';
import { StyleSheet, Image } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Paragraph from '../components/Paragraph';
import RecoveryPhrase from '../components/RecoveryPhrase';
import LargeButton from '../components/LargeButton';
import Footer from '../components/Footer';
import BaseView from './BaseView';

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 135,
    marginBottom: 40
  },
  phrase: {
    marginTop: 10,
    marginBottom: 40
  }
});

@connect()
export default class RecoveryPhraseView extends Component {
  static navigationOptions = {
    header: null
  }

  _showConfirmRecoveryPhraseView() {
    const navigation = this.props.navigation;
    const { params } = navigation.state;
    const wallet = params.wallet;

    navigation.navigate('ConfirmRecoveryPhrase', { wallet });
  }

  render() {
    const { params } = this.props.navigation.state;
    const phrase = params.wallet.mnemonic.toString();

    return (
      <BaseView>
        <Image source={require('../img/illustrations/key.png')} style={styles.image} />

        <Paragraph style={styles.text}>
          Write down and store this recovery key in a safe place so you can recover
          your wallet if you lose or break your phone.
        </Paragraph>

        <RecoveryPhrase phrase={phrase} style={styles.phrase} />

        <Footer>
          <LargeButton
            label='I have saved these words'
            onPress={this._showConfirmRecoveryPhraseView.bind(this)}
            style={styles.button}
          />
        </Footer>
      </BaseView>
    );
  }
}

RecoveryPhraseView.propTypes = {
  navigation: PropTypes.any
};
