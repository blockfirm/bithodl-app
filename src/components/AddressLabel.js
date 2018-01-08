import React, { Component } from 'react';
import { Animated, StyleSheet, View, TouchableWithoutFeedback, Clipboard } from 'react-native';
import PropTypes from 'prop-types';
import ReactNativeHaptic from 'react-native-haptic';
import StyledText from './StyledText';

const styles = StyleSheet.create({
  wrapper: {
    padding: 8,
    borderRadius: 3,
    backgroundColor: '#F9F9F9',
    flexDirection: 'row',
    overflow: 'hidden'
  },
  prefix: {
    paddingLeft: 1,
    paddingRight: 7,
    marginRight: 7,
    borderRightWidth: 1,
    borderRightColor: '#E4E4E4'
  },
  prefixText: {
    color: '#7C7C7C'
  },
  address: {
    padding: 2,
    fontFamily: 'Menlo-Regular',
    fontSize: 12,
    lineHeight: 13,
    color: '#7C7C7C'
  },
  copyNotice: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9'
  },
  copyNoticeText: {
    fontSize: 11,
    color: '#7C7C7C',
    fontWeight: '600'
  }
});

export default class AddressLabel extends Component {
  state = {
    copyNoticeOpacity: new Animated.Value(0),
    showingCopyNotice: false
  };

  constructor() {
    super(...arguments);
    this._copyToClipboard = this._copyToClipboard.bind(this);
  }

  componentWillUnmount() {
    clearTimeout(this._timeout);
  }

  _fadeCopyNoticeTo(toValue, config) {
    const animation = Animated.timing(this.state.copyNoticeOpacity, { toValue, ...config });
    animation.start();
  }

  _fadeInCopyNotice() {
    this.setState({ showingCopyNotice: true });
    this.state.copyNoticeOpacity.setValue(0);
    this._fadeCopyNoticeTo(1, { duration: 200 });
  }

  _fadeOutCopyNotice() {
    this.setState({ showingCopyNotice: false });
    this._fadeCopyNoticeTo(0, { duration: 200 });
  }

  _copyToClipboard() {
    const address = this.props.address;

    if (this.state.showingCopyNotice) {
      return;
    }

    Clipboard.setString(address);
    ReactNativeHaptic.generate('selection');

    this._fadeInCopyNotice();
    this._timeout = setTimeout(this._fadeOutCopyNotice.bind(this), 1300);
  }

  render() {
    const copyNoticeStyles = [
      styles.copyNotice,
      { opacity: this.state.copyNoticeOpacity }
    ];

    return (
      <TouchableWithoutFeedback onPress={this._copyToClipboard}>
        <View style={[styles.wrapper, this.props.style]}>
          <View style={styles.prefix}>
            <StyledText style={styles.prefixText}>₿</StyledText>
          </View>

          <StyledText style={styles.address}>
            {this.props.address}
          </StyledText>

          <Animated.View style={copyNoticeStyles}>
            <StyledText style={styles.copyNoticeText}>Copied</StyledText>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

AddressLabel.propTypes = {
  style: PropTypes.any,
  address: PropTypes.string.isRequired
};
