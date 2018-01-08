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

const BITHODL_SERVICE_REPO_URL = 'https://github.com/blockfirm/bithodl-service';

@connect((state) => ({
  settings: state.settings
}))
export default class ServiceUrlView extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Service URL',
    headerStyle: headerStyles.header,
    headerTitleStyle: headerStyles.title,
    headerLeft: (<BackButton onPress={() => { navigation.goBack(); }} />)
  });

  constructor(props) {
    super(...arguments);

    this.state = {
      serviceUrl: props.settings.api.baseUrl
    };
  }

  componentWillUnmount() {
    this._save();
  }

  _goBack() {
    this.props.navigation.goBack();
  }

  _visitBitHodlServiceRepo() {
    Linking.openURL(BITHODL_SERVICE_REPO_URL);
  }

  _save() {
    const dispatch = this.props.dispatch;
    const serviceUrl = this.state.serviceUrl || config.api.baseUrl;

    dispatch(saveSettings({
      api: {
        baseUrl: serviceUrl
      }
    }));
  }

  _onChangeText(text) {
    this.setState({ serviceUrl: text });
  }

  render() {
    return (
      <BaseSettingsView>
        <SettingsGroup>
          <SettingsInput
            value={this.state.serviceUrl}
            placeholder={config.api.baseUrl}
            onChangeText={this._onChangeText.bind(this)}
            onSubmitEditing={this._goBack.bind(this)}
          />
        </SettingsGroup>

        <SettingsDescription>
          The Service URL is used to communicate with an API to retrieve and submit information
          to the blockchain. By default this service is provided by BitHodl, but you can host your
          own service and enter its URL here.
        </SettingsDescription>

        <SettingsGroup>
          <SettingsButton title='Host your own service' onPress={this._visitBitHodlServiceRepo.bind(this)} isLastItem={true} />
        </SettingsGroup>
      </BaseSettingsView>
    );
  }
}

ServiceUrlView.propTypes = {
  settings: PropTypes.object,
  dispatch: PropTypes.func,
  navigation: PropTypes.any
};
