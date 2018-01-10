import React, { Component } from 'react';
import { Text, Alert } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { syncWallet, deleteWallet, resetSettings, navigateWithReset } from '../../actions';
import headerStyles from '../../styles/headerStyles';
import DoneButton from '../../components/DoneButton';
import SettingsGroup from '../../components/SettingsGroup';
import SettingsButton from '../../components/SettingsButton';
import SettingsLink from '../../components/SettingsLink';
import ResyncWalletButtonContainer from '../../containers/ResyncWalletButtonContainer';
import BaseSettingsView from './BaseSettingsView';

@connect((state) => ({
  settings: state.settings
}))
export default class SettingsView extends Component {
  static navigationOptions = ({ screenProps }) => ({
    title: 'Settings',
    headerStyle: headerStyles.header,
    headerTitleStyle: headerStyles.title,
    headerBackTitle: null,
    headerRight: (<DoneButton onPress={screenProps.dismiss} />),

    // HACK: Hack to disable the back navigation on the initial settings screen.
    headerLeft: (<Text />),
    gestureResponseDistance: { horizontal: -1, vertical: 135 }
  });

  _showAbout() {
    const navigation = this.props.navigation;
    navigation.navigate('About');
  }

  _showServiceUrl() {
    const navigation = this.props.navigation;
    navigation.navigate('ServiceUrl');
  }

  _showBitcoinUnit() {
    const navigation = this.props.navigation;
    navigation.navigate('BitcoinUnit');
  }

  _showRecoveryPhrase() {
    const navigation = this.props.navigation;
    navigation.navigate('ShowRecoveryPhrase');
  }

  _resyncWallet() {
    const dispatch = this.props.dispatch;

    Alert.alert(
      'Resync wallet?',
      'This will resync your wallet with the blockchain and might take a minute. Are you sure you want to continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Resync', onPress: () => dispatch(syncWallet()) }
      ],
      { cancelable: false }
    );
  }

  _recoverWallet() {
    const dispatch = this.props.dispatch;

    Alert.alert(
      'Recover another wallet?',
      'This will permanently delete the current wallet. Are you sure you want to continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Recover',
          style: 'destructive',
          onPress: () => {
            this.props.screenProps.dismiss();
            dispatch(navigateWithReset('RecoverWallet'));
          }
        }
      ],
      { cancelable: false }
    );
  }

  _resetWallet() {
    const dispatch = this.props.dispatch;

    Alert.alert(
      'Reset wallet?',
      'This will permanently delete the wallet and reset all settings. You can only recover the wallet if you have your recovery phrase. Are you sure you want to continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            dispatch(deleteWallet()).then(() => {
              dispatch(resetSettings());
              this.props.screenProps.dismiss();
              dispatch(navigateWithReset('Welcome'));
            });
          }
        }
      ],
      { cancelable: false }
    );
  }

  render() {
    const settings = this.props.settings;

    return (
      <BaseSettingsView>
        <SettingsGroup>
          <SettingsLink name='About' onPress={this._showAbout.bind(this)} isLastItem={true} />
        </SettingsGroup>

        <SettingsGroup>
          <SettingsLink name='Service URL' value={settings.api.baseUrl} onPress={this._showServiceUrl.bind(this)} />
          <SettingsLink name='Bitcoin display unit' value={settings.bitcoin.unit} onPress={this._showBitcoinUnit.bind(this)} />
          <SettingsLink name='Show recovery phrase' onPress={this._showRecoveryPhrase.bind(this)} isLastItem={true} />
        </SettingsGroup>

        <SettingsGroup>
          <ResyncWalletButtonContainer title='Resync wallet' loadingTitle='Resyncing wallet...' onPress={this._resyncWallet.bind(this)} />
          <SettingsButton title='Recover another wallet' onPress={this._recoverWallet.bind(this)} />
          <SettingsButton title='Reset' onPress={this._resetWallet.bind(this)} isLastItem={true} />
        </SettingsGroup>
      </BaseSettingsView>
    );
  }
}

SettingsView.propTypes = {
  settings: PropTypes.object,
  screenProps: PropTypes.object,
  dispatch: PropTypes.func,
  navigation: PropTypes.any
};
