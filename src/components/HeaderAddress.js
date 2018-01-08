import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { ifIphoneX } from 'react-native-iphone-x-helper';

import BtcLabelContainer from '../containers/BtcLabelContainer';
import TimeLeftIcon from './TimeLeftIcon';

const UPDATE_INTERVAL = 60 * 1000; // 1 minute.

const styles = StyleSheet.create({
  view: {
    position: 'absolute',
    top: ifIphoneX(57, 33),
    right: 20,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 5,
    paddingTop: 4,
    paddingBottom: 4,
    borderRadius: 40
  },
  icon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8
  },
  iconText: {
    fontSize: 7,
    backgroundColor: 'transparent'
  },
  amount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#504F63',
    marginRight: 3
  }
});

export default class HeaderAddress extends Component {
  componentDidMount() {
    // Update component every minute.
    this._interval = setInterval(this.forceUpdate.bind(this), UPDATE_INTERVAL);
  }

  componentWillUnmount() {
    clearInterval(this._interval);
  }

  render() {
    const address = this.props.address;

    return (
      <View style={[styles.view, this.props.style]}>
        <TimeLeftIcon
          style={styles.icon}
          textStyle={styles.iconText}
          size={16}
          thickness={0.5}
          start={address.createdAt}
          end={address.unlockAt}
        />
        <BtcLabelContainer style={styles.amount} amount={address.amount} />
      </View>
    );
  }
}

HeaderAddress.propTypes = {
  style: PropTypes.any,
  address: PropTypes.object.isRequired
};
