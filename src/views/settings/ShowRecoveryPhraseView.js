import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getMnemonic } from '../../actions';
import headerStyles from '../../styles/headerStyles';
import BackButton from '../../components/BackButton';
import SettingsGroup from '../../components/SettingsGroup';
import SettingsDescription from '../../components/SettingsDescription';
import RecoveryPhrase from '../../components/RecoveryPhrase';
import BaseSettingsView from './BaseSettingsView';

const styles = StyleSheet.create({
  view: {
    padding: 20
  }
});

@connect()
export default class ShowRecoveryPhraseView extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Recovery Phrase',
    headerStyle: headerStyles.header,
    headerTitleStyle: headerStyles.title,
    headerLeft: (<BackButton onPress={() => { navigation.goBack(); }} />)
  });

  state = {
    phrase: ''
  }

  componentDidMount() {
    const dispatch = this.props.dispatch;

    dispatch(getMnemonic()).then((mnemonic) => {
      this.setState({
        phrase: mnemonic.toString()
      });
    });
  }

  render() {
    return (
      <BaseSettingsView>
        <SettingsGroup style={styles.view}>
          <RecoveryPhrase phrase={this.state.phrase} />
        </SettingsGroup>
        <SettingsDescription>
          Write down and store this recovery key in a safe place so you can recover
          your wallet if you lose or break your phone.
        </SettingsDescription>
      </BaseSettingsView>
    );
  }
}

ShowRecoveryPhraseView.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any
};
