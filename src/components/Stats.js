import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import BtcLabelContainer from '../containers/BtcLabelContainer';
import StyledText from './StyledText';

const styles = StyleSheet.create({
  title: {
    color: '#D49146',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1
  },
  btcLabel: {
    color: '#504F63',
    fontSize: 34,
    letterSpacing: -0.82
  }
});

export default class Stats extends Component {
  _getTotalAmount(items) {
    const total = Object.keys(items).reduce((sum, key) => {
      const item = items[key];
      return sum + item.amount;
    }, 0);

    return total;
  }

  render() {
    const items = this.props.items || {};
    const totalAmount = this._getTotalAmount(items);

    return (
      <View style={this.props.style}>
        <StyledText style={styles.title}>HODLING</StyledText>
        <BtcLabelContainer style={styles.btcLabel} amount={totalAmount} />
      </View>
    );
  }
}

Stats.propTypes = {
  style: PropTypes.any,
  items: PropTypes.object
};
