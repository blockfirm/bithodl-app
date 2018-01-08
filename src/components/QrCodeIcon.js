import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 35
  }
});

export default class QrCodeIcon extends Component {
  render() {
    const pointerEvents = this.props.visible ? 'auto' : 'none';

    const opacityStyle = {
      opacity: this.props.visible ? 1 : 0
    };

    return (
      <View style={[this.props.style, opacityStyle]} pointerEvents={pointerEvents}>
        <TouchableOpacity onPress={this.props.onPress}>
          <Image source={require('../img/icons/qr-code.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
    );
  }
}

QrCodeIcon.propTypes = {
  style: PropTypes.any,
  visible: PropTypes.bool,
  onPress: PropTypes.func
};
