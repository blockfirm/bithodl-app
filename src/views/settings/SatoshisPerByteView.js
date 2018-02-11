import React, { Component } from 'react';
import { Linking } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { saveSettings } from '../../actions';
import headerStyles from '../../styles/headerStyles';
import BackButton from '../../components/BackButton';
import SettingsGroup from '../../components/SettingsGroup';
import SettingsInput from '../../components/SettingsInput';
import SettingsDescription from '../../components/SettingsDescription';
import SettingsButton from '../../components/SettingsButton';
import BaseSettingsView from './BaseSettingsView';
import config from '../../config';

@connect((state) => ({
  settings: state.settings
}))
export default class SatoshisPerByteView extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Satoshis per byte',
    headerStyle: headerStyles.header,
    headerTitleStyle: headerStyles.title,
    headerLeft: (<BackButton onPress={() => { navigation.goBack(); }} />)
  });

  constructor(props) {
    super(...arguments);

    this.state = {
      satoshisPerByte: props.settings.bitcoin.fee.satoshisPerByte
    };
  }

  componentWillUnmount() {
    this._save();
  }

  _goBack() {
    this.props.navigation.goBack();
  }

  _save() {
    const dispatch = this.props.dispatch;
    const satoshisPerByte = this.state.satoshisPerByte || config.bitcoin.fee.satoshisPerByte;

    dispatch(saveSettings({
      bitcoin: {
        fee: { satoshisPerByte }
      }
    }));
  }

  _onChangeText(text) {
    const number = text.replace(/\D/g, ''); // Remove non-digit characters.
    const satoshisPerByte = number ? parseInt(number) : '';

    this.setState({ satoshisPerByte });
  }

  render() {
    const satoshisPerByte = this.state.satoshisPerByte;

    return (
      <BaseSettingsView>
        <SettingsGroup>
          <SettingsInput
            value={satoshisPerByte.toString()}
            placeholder={config.bitcoin.fee.satoshisPerByte.toString()}
            keyboardType='number-pad'
            onChangeText={this._onChangeText.bind(this)}
            onSubmitEditing={this._goBack.bind(this)}
          />
        </SettingsGroup>

        <SettingsDescription>
          Specify how many satoshis (0.00000001 BTC) you want to pay per byte in fees for your
          transaction. A BitHodl transaction is around 220 bytes.
        </SettingsDescription>
      </BaseSettingsView>
    );
  }
}

SatoshisPerByteView.propTypes = {
  settings: PropTypes.object,
  dispatch: PropTypes.func,
  navigation: PropTypes.any
};
