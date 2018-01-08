import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { ifIphoneX } from 'react-native-iphone-x-helper';

import BackButton from './BackButton';
import HeaderAddress from './HeaderAddress';

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 42,
    zIndex: 1000
  },
  backButton: {
    position: 'absolute',
    top: ifIphoneX(54, 30),
    left: 10
  }
});

export default class Header extends Component {
  render() {
    const { address, showBackButton, hideAddress } = this.props;

    return (
      <View style={styles.header}>
        {showBackButton ? <BackButton onPress={this.props.onBackPress} style={styles.backButton} iconStyle={this.props.backButtonIconStyle} /> : null }
        {address && !hideAddress ? (<HeaderAddress address={address} />) : null }
      </View>
    );
  }
}

Header.propTypes = {
  address: PropTypes.object,
  showBackButton: PropTypes.bool,
  onBackPress: PropTypes.func.isRequired,
  backButtonIconStyle: PropTypes.any,
  hideAddress: PropTypes.bool
};
