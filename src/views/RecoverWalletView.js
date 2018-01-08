import React, { Component } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import KeepAwake from 'react-native-keep-awake';
import Mnemonic from 'bitcore-mnemonic';

import { createWallet, syncWallet, handleError, navigateWithReset } from '../actions';
import Title from '../components/Title';
import Paragraph from '../components/Paragraph';
import RecoveryPhraseInput from '../components/RecoveryPhraseInput';
import LargeButton from '../components/LargeButton';
import Footer from '../components/Footer';
import BaseView from './BaseView';

const WORD_LIST = Mnemonic.Words.ENGLISH;

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
  }
});

@connect()
export default class RecoverWalletView extends Component {
  static navigationOptions = {
    header: null
  }

  state = {
    phrase: '',
    keyboardState: false
  }

  componentWillUnmount() {
    KeepAwake.deactivate();
  }

  _onKeyboardToggle(keyboardState) {
    this.setState({ keyboardState });
  }

  _showDisclaimerView() {
    const dispatch = this.props.dispatch;
    dispatch(navigateWithReset('Disclaimer'));
  }

  _recoverWallet() {
    const dispatch = this.props.dispatch;
    const phrase = this.state.phrase;

    KeepAwake.activate();
    Keyboard.dismiss();

    return dispatch(createWallet(phrase))
      .then(() => {
        return dispatch(syncWallet());
      })
      .then(() => {
        this._showDisclaimerView();
      })
      .catch((error) => {
        KeepAwake.deactivate();
        dispatch(handleError(error));
      });
  }

  _isPhraseComplete() {
    const phrase = this.state.phrase.trim();
    const words = phrase.split(' ');
    const isComplete = words.every((word) => WORD_LIST.includes(word));

    return words.length === 12 && isComplete;
  }

  render() {
    const buttonDisabled = !this._isPhraseComplete();
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
                Recover wallet
              </Title>

              <Paragraph>
                Enter your recovery key to recover an existing BitHodl wallet.
              </Paragraph>
            </View>

            <View>
              <RecoveryPhraseInput
                onChange={(phrase) => this.setState({ phrase })}
                wordList={WORD_LIST}
              />
            </View>

            <Footer>
              <LargeButton
                label='Recover'
                loadingLabel='Recovering...'
                disabled={buttonDisabled}
                fullWidth={this.state.keyboardState}
                onPress={this._recoverWallet.bind(this)}
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

RecoverWalletView.propTypes = {
  dispatch: PropTypes.func
};
