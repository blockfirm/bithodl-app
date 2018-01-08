import React, { Component } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import { navigateWithReset } from '../actions';
import Title from '../components/Title';
import Paragraph from '../components/Paragraph';
import RecoveryPhraseInput from '../components/RecoveryPhraseInput';
import LargeButton from '../components/LargeButton';
import Footer from '../components/Footer';
import BaseView from './BaseView';

const styles = StyleSheet.create({
  view: {
    flex: 1
  },
  content: {
    alignItems: 'center',
    opacity: 1
  },
  contentHidden: {
    height: 0,
    opacity: 0
  },
  text: {
    marginBottom: 30
  }
});

@connect()
export default class ConfirmRecoveryPhraseView extends Component {
  static navigationOptions = {
    header: null
  }

  state = {
    phrase: '',
    keyboardState: false
  }

  _onKeyboardToggle(keyboardState) {
    this.setState({ keyboardState });
  }

  _showDisclaimerView() {
    const dispatch = this.props.dispatch;
    dispatch(navigateWithReset('Disclaimer', { isNewWallet: true }));
  }

  _onChangePhrase(phrase) {
    this.setState({ phrase });
  }

  _isPhraseCorrect() {
    const { params } = this.props.navigation.state;
    const correctPhrase = params.wallet.mnemonic.toString();
    const phrase = this.state.phrase;
    const isComplete = phrase === correctPhrase;

    return isComplete;
  }

  render() {
    const { params } = this.props.navigation.state;
    const correctPhrase = params.wallet.mnemonic.toString();
    const buttonDisabled = !this._isPhraseCorrect();
    const contentStyles = [styles.content];

    if (this.state.keyboardState) {
      contentStyles.push(styles.contentHidden);
    }

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss.bind(Keyboard)}>
        <View style={styles.view}>
          <BaseView>
            <View style={contentStyles}>
              <Title>
                Confirm recovery key
              </Title>

              <Paragraph style={styles.text}>
                To verify that you saved the words correctly,
                please enter them below.
              </Paragraph>
            </View>

            <View>
              <RecoveryPhraseInput
                correctPhrase={correctPhrase}
                onChange={this._onChangePhrase.bind(this)}
              />
            </View>

            <Footer>
              <LargeButton
                label='Confirm'
                disabled={buttonDisabled}
                fullWidth={this.state.keyboardState}
                onPress={this._showDisclaimerView.bind(this)}
              />
              <KeyboardSpacer topSpacing={-30} onToggle={this._onKeyboardToggle.bind(this)} />
            </Footer>

            <KeyboardSpacer onToggle={this._onKeyboardToggle.bind(this)} />
          </BaseView>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

ConfirmRecoveryPhraseView.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any
};
