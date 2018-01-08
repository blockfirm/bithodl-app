import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import KeepAwake from 'react-native-keep-awake';
import ReactNativeHaptic from 'react-native-haptic';
import bitcore from 'bitcore-lib';

import config from '../../config';
import { sendTransaction, deleteAddress, writeAddresses, handleError, navigateWithReset } from '../../actions';
import BtcLabelContainer from '../../containers/BtcLabelContainer';
import Title from '../../components/Title';
import StyledText from '../../components/StyledText';
import AddressLabel from '../../components/AddressLabel';
import LargeButton from '../../components/LargeButton';
import Footer from '../../components/Footer';
import BaseView from '../BaseView';

const styles = StyleSheet.create({
  table: {
    alignItems: 'flex-start'
  },
  row: {
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomColor: '#F9F8F8',
    borderBottomWidth: 1
  },
  label: {
    fontWeight: '600',
    marginBottom: 5
  },
  feePercentage: {
    color: '#8F8E94'
  }
});

@connect()
export default class ConfirmTransactionView extends Component {
  static navigationOptions = {
    header: null
  }

  componentWillUnmount() {
    KeepAwake.deactivate();
  }

  _showTransactionSentView() {
    const dispatch = this.props.dispatch;
    dispatch(navigateWithReset('TransactionSent'));
  }

  _completeTransfer() {
    const dispatch = this.props.dispatch;
    const { params } = this.props.navigation.state;
    const transaction = params.transaction;
    const fromAddress = params.address;

    KeepAwake.activate();

    return dispatch(sendTransaction(transaction))
      .then(() => {
        return dispatch(deleteAddress(fromAddress));
      })
      .then(() => {
        return dispatch(writeAddresses());
      })
      .then(() => {
        ReactNativeHaptic.generate('impact');
        this._showTransactionSentView();
      })
      .catch((error) => {
        KeepAwake.deactivate();
        dispatch(handleError(error));
      });
  }

  render() {
    const { params } = this.props.navigation.state;
    const transaction = params.transaction;
    const input = transaction.inputs[0];
    const output = transaction.outputs[0];
    const inputAmount = input.output.satoshis;
    const outputAmount = output.satoshis;
    const feeAmount = inputAmount - outputAmount;
    const feePercentage = (feeAmount / outputAmount) * 100;
    const toAddress = bitcore.Address.fromScript(output.script, config.bitcoin.network).toString();

    return (
      <BaseView>
        <Title>
          Review and send
        </Title>

        <View style={styles.table}>
          <View style={styles.row}>
            <StyledText style={styles.label}>Amount</StyledText>
            <BtcLabelContainer amount={inputAmount} />
          </View>

          <View style={styles.row}>
            <StyledText style={styles.label}>Fees</StyledText>
            <BtcLabelContainer amount={feeAmount} />
            <StyledText style={styles.feePercentage}>
              ({feePercentage.toPrecision(2)}% of the total amount)
            </StyledText>
          </View>

          <View style={styles.row}>
            <StyledText style={styles.label}>To</StyledText>
            <AddressLabel address={toAddress}></AddressLabel>
          </View>
        </View>

        <Footer>
          <LargeButton
            label='Send transaction'
            loadingLabel='Sending transaction...'
            onPress={this._completeTransfer.bind(this)}
          />
        </Footer>
      </BaseView>
    );
  }
}

ConfirmTransactionView.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any
};
