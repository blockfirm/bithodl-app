import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { saveSettings } from '../../actions';
import headerStyles from '../../styles/headerStyles';
import BackButton from '../../components/BackButton';
import SettingsGroup from '../../components/SettingsGroup';
import SettingsOption from '../../components/SettingsOption';
import SettingsLink from '../../components/SettingsLink';
import SettingsDescription from '../../components/SettingsDescription';
import StrongText from '../../components/StrongText';
import BaseSettingsView from './BaseSettingsView';
import config from '../../config';

@connect((state) => ({
  settings: state.settings
}))
export default class FeeSettingsView extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Transaction fees',
    headerStyle: headerStyles.header,
    headerTitleStyle: headerStyles.title,
    headerLeft: (<BackButton onPress={() => { navigation.goBack(); }} />)
  });

  constructor(props) {
    super(...arguments);

    this.state = {
      level: props.settings.bitcoin.fee.level
    };
  }

  componentWillUnmount() {
    this._save();
  }

  _save() {
    const dispatch = this.props.dispatch;
    const level = this.state.level || config.bitcoin.fee.level;

    dispatch(saveSettings({
      bitcoin: {
        fee: { level }
      }
    }));
  }

  _showSatoshisPerByteView() {
    const navigation = this.props.navigation;
    navigation.navigate('SatoshisPerByte');
  }

  _onSelect(level) {
    this.setState({ level });
  }

  render() {
    const feeSettings = this.props.settings.bitcoin.fee;
    const satoshisPerByte = feeSettings.satoshisPerByte;

    return (
      <BaseSettingsView>
        <SettingsGroup>
          <SettingsOption name='High' value={this.state.level} onSelect={this._onSelect.bind(this)} />
          <SettingsOption name='Normal' value={this.state.level} onSelect={this._onSelect.bind(this)} />
          <SettingsOption name='Low' value={this.state.level} onSelect={this._onSelect.bind(this)} />
          <SettingsOption name='Very low' value={this.state.level} onSelect={this._onSelect.bind(this)} />
          <SettingsOption name='Custom' value={this.state.level} onSelect={this._onSelect.bind(this)} isLastItem={true} />
        </SettingsGroup>

        {
          this.state.level === 'Custom' ?
            (
              <SettingsGroup>
                <SettingsLink
                  name='Satoshis per byte'
                  value={satoshisPerByte.toString()}
                  onPress={this._showSatoshisPerByteView.bind(this)}
                  isLastItem={true}
                />
              </SettingsGroup>
            )
            : null
        }

        <SettingsDescription>
          Choose the preferred transaction fee level. Higher level means higher probability to get
          confirmed in the next block. Choosing a low or custom level might leave your transaction
          in an unconfirmed state for a long time.
        </SettingsDescription>
        <SettingsDescription>
          <StrongText>High</StrongText> is 150% of the estimated fee.
        </SettingsDescription>
        <SettingsDescription>
          <StrongText>Normal</StrongText> is 100% of the estimated fee.
        </SettingsDescription>
        <SettingsDescription>
          <StrongText>Low</StrongText> is 50% of the estimated fee.
        </SettingsDescription>
        <SettingsDescription>
          <StrongText>Very low</StrongText> is 25% of the estimated fee.
        </SettingsDescription>

        <SettingsDescription>
          All fees goes to the miner who mines the block containing your transaction. BitHodl or its
          developers does not charge any fees.
        </SettingsDescription>
      </BaseSettingsView>
    );
  }
}

FeeSettingsView.propTypes = {
  settings: PropTypes.object,
  dispatch: PropTypes.func,
  navigation: PropTypes.any
};
