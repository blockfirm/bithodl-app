import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StyledText from './StyledText';

const UNIT_BTC = 'BTC';
const UNIT_MBTC = 'mBTC';

export default class BtcLabel extends Component {
  _formatBtc(satoshis) {
    const btc = satoshis / 100000000;
    return `${btc} ₿`;
  }

  _formatMBtc(satoshis) {
    const mbtc = satoshis / 100000;
    return `${mbtc} m₿`;
  }

  render() {
    const { amount, unit } = this.props;
    let label;

    switch (unit) {
      case UNIT_MBTC:
        label = this._formatMBtc(amount);
        break;

      case UNIT_BTC:
      default:
        label = this._formatBtc(amount);
    }

    return (
      <StyledText style={this.props.style}>
        {label}
      </StyledText>
    );
  }
}

BtcLabel.propTypes = {
  style: PropTypes.any,
  amount: PropTypes.number.isRequired,
  unit: PropTypes.string
};
