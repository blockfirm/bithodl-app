import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import KeepAwake from 'react-native-keep-awake';
import QRCode from 'react-native-qrcode';
import ReactNativeHaptic from 'react-native-haptic';
import moment from 'moment-timezone';

import { syncAddress, writeAddresses, navigateWithReset } from '../../actions';
import Title from '../../components/Title';
import Paragraph from '../../components/Paragraph';
import AddressLabel from '../../components/AddressLabel';
import LargeButton from '../../components/LargeButton';
import Footer from '../../components/Footer';
import DateString from '../../components/DateString';
import BaseView from '../BaseView';

const POLL_INTERVAL = 1000; // 1 second.
const SHOW_LATER_BUTTON_TIMEOUT = 10 * 1000; // 10 seconds.

const styles = StyleSheet.create({
  content: {
    marginBottom: 20,
    alignItems: 'center'
  },
  date: {
    fontWeight: '600'
  },
  qrCode: {
    padding: 30,
    marginBottom: 20
  },
  loader: {
    height: 42
  }
});

@connect()
export default class AddressCreatedView extends Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(...arguments);

    const { params } = props.navigation.state;

    this.state = {
      address: params.address,
      showLaterButton: false
    };
  }

  componentDidMount() {
    KeepAwake.activate();
    this._deferPoll();

    // Show the Later button after some time.
    this._buttonTimeout = setTimeout(() => {
      this.setState({ showLaterButton: true });
    }, SHOW_LATER_BUTTON_TIMEOUT);
  }

  componentWillUnmount() {
    KeepAwake.deactivate();

    clearTimeout(this._buttonTimeout);
    clearTimeout(this._pollTimeout);
  }

  _poll() {
    const dispatch = this.props.dispatch;

    return dispatch(syncAddress(this.state.address))
      .then((address) => {
        if (!address.utxo) {
          return this._deferPoll();
        }

        return dispatch(writeAddresses()).then(() => {
          ReactNativeHaptic.generate('impact');
          return this._showAddressFundedView();
        });
      })
      .catch(() => {
        this._deferPoll();
      });
  }

  _deferPoll() {
    this._pollTimeout = setTimeout(this._poll.bind(this), POLL_INTERVAL);
  }

  _showHomeView() {
    const dispatch = this.props.dispatch;
    return dispatch(navigateWithReset('Home'));
  }

  _showAddressFundedView() {
    const dispatch = this.props.dispatch;
    const address = this.state.address;

    return dispatch(navigateWithReset('AddressFunded', { address }));
  }

  _renderFooter() {
    if (this.state.showLaterButton) {
      return (
        <Footer>
          <LargeButton label='I will do it later' onPress={this._showHomeView.bind(this)} />
        </Footer>
      );
    }

    return (
      <Footer>
        <ActivityIndicator animating={true} color='#8F8E94' style={styles.loader} size='small' />
      </Footer>
    );
  }

  render() {
    const address = this.state.address;
    const qrData = `bitcoin:${address.hash}`;
    const unlockDate = moment.unix(address.unlockAt);

    return (
      <BaseView>
        <View style={styles.content}>
          <Title>
            Transfer bitcoins
          </Title>

          <Paragraph>
            Transfer your bitcoins to this address to lock them until <DateString date={unlockDate} />.
          </Paragraph>

          <View style={styles.qrCode}>
            <QRCode
              value={qrData}
              size={200}
              bgColor='black'
              fgColor='white'
            />
          </View>

          <AddressLabel address={address.hash} />
        </View>

        {this._renderFooter()}
      </BaseView>
    );
  }
}

AddressCreatedView.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any
};
