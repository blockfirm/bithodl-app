import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ifIphoneX } from 'react-native-iphone-x-helper';

import { navigateWithReset } from '../actions';
import Title from '../components/Title';
import Paragraph from '../components/Paragraph';
import LargeButton from '../components/LargeButton';
import Footer from '../components/Footer';
import BaseView from './BaseView';

const styles = StyleSheet.create({
  title: {
    marginBottom: ifIphoneX(40, 30)
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'left'
  },
  terms: {
    alignItems: 'flex-start',
    marginBottom: ifIphoneX(40, 50)
  },
  paragraph: {
    fontSize: 14,
    textAlign: 'left'
  },
  link: {
    color: '#FEC98A'
  }
});

@connect()
export default class DisclaimerView extends Component {
  static navigationOptions = {
    header: null
  }

  _showHomeView() {
    const dispatch = this.props.dispatch;
    return dispatch(navigateWithReset('Home'));
  }

  _showWalletCreatedView() {
    const dispatch = this.props.dispatch;
    return dispatch(navigateWithReset('WalletCreated'));
  }

  _showTermsAndConditionsModal() {
    const navigation = this.props.navigation;
    navigation.navigate('TermsAndConditionsModal', { isModal: true });
  }

  _onUnderstand() {
    const params = this.props.navigation.state.params;
    const isNewWallet = params ? params.isNewWallet : false;

    if (isNewWallet) {
      return this._showWalletCreatedView();
    }

    return this._showHomeView();
  }

  render() {
    return (
      <BaseView style={styles.view}>
        <Title style={styles.title}>
          Read before you use BitHodl
        </Title>

        <View style={styles.terms}>
          <Title style={styles.subtitle}>Wallet access</Title>
          <Paragraph style={styles.paragraph}>
            Bitcoins stored with BitHodl are stored on the device and only you can access them. No company or third party can
            access your funds in any way.
          </Paragraph>

          <Title style={styles.subtitle}>Wallet recovery</Title>
          <Paragraph style={styles.paragraph}>
            Make sure to store your recovery key in a safe place. Anyone with access to the recovery key can access your funds.
            It is also the only way to recover your wallet in case you would lose or break your phone.
          </Paragraph>

          <Title style={styles.subtitle}>Unlocking funds</Title>
          <Paragraph style={styles.paragraph}>
            It is impossible to unlock funds before the specified unlock date. Please act responsibly.
          </Paragraph>

          <Title style={styles.subtitle}>Terms and conditions</Title>
          <Paragraph style={styles.paragraph}>
            <Text>By pressing "I understand", you understand and agree to the terms above as well as the </Text>
            <Text style={styles.link} onPress={this._showTermsAndConditionsModal.bind(this)}>Terms and Conditions</Text>
            <Text>.</Text>
          </Paragraph>
        </View>

        <Footer>
          <LargeButton label='I understand' onPress={this._onUnderstand.bind(this)} />
        </Footer>
      </BaseView>
    );
  }
}

DisclaimerView.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any
};
