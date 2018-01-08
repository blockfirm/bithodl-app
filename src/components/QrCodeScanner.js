import React, { Component } from 'react';
import { StyleSheet, View, Image, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import Camera from 'react-native-camera';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    position: 'absolute',
    top: 0,
    left: 0
  },
  camera: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: windowHeight,
    width: windowWidth
  },
  overlay: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: 'rgba(255,255,255,0.5)',
    opacity: 0.7
  },
  viewport: {
    width: 200,
    height: 200,
    position: 'absolute',
    opacity: 0
  }
});

export default class QrCodeScanner extends Component {
  render() {
    const overlayStyles = [
      styles.overlay,
      { opacity: this.props.opacity }
    ];

    const viewportStyles = [
      styles.viewport,
      { opacity: (1 - this.props.opacity) / 4 }
    ];

    return (
      <View style={styles.view}>
        <Camera style={styles.camera} onBarCodeRead={this.props.onScan} keepAwake={true}>
          <View style={overlayStyles} />
          <Image source={require('../img/qr-viewport.png')} style={viewportStyles} />
        </Camera>
      </View>
    );
  }
}

QrCodeScanner.propTypes = {
  opacity: PropTypes.number,
  onScan: PropTypes.func.isRequired
};
