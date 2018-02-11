import React, { Component } from 'react';
import { StyleSheet, View, Keyboard, PanResponder, LayoutAnimation, Dimensions, StatusBar, Clipboard } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import ReactNativeHaptic from 'react-native-haptic';
import bitcore from 'bitcore-lib';

import config from '../../config';
import { createTransaction, handleError } from '../../actions';
import BtcLabelContainer from '../../containers/BtcLabelContainer';
import QrCodeScanner from '../../components/QrCodeScanner';
import Title from '../../components/Title';
import Paragraph from '../../components/Paragraph';
import StyledInput from '../../components/StyledInput';
import LargeButton from '../../components/LargeButton';
import Footer from '../../components/Footer';
import QrCodeIcon from '../../components/QrCodeIcon';
import KeyboardIcon from '../../components/KeyboardIcon';
import BaseView from '../BaseView';

const windowDimensions = Dimensions.get('window');
const windowHeight = windowDimensions.height;
const CAMERA_MODE_OFFSET = windowHeight - 130;
const SLIDE_THRESHOLD = 140;

const animationConfig = {
  duration: 500,
  create: {
    type: LayoutAnimation.Types.spring,
    property: LayoutAnimation.Properties.opacity,
    springDamping: 0.6
  },
  update: {
    type: LayoutAnimation.Types.spring,
    springDamping: 0.6
  }
};

const styles = StyleSheet.create({
  view: {
    flex: 1
  },
  mainView: {
    padding: 0
  },
  gradientView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: 'transparent'
  },
  content: {
    alignItems: 'center'
  },
  inputContainer: {
    marginBottom: 50
  },
  qrCodeIcon: {
    position: 'absolute',
    top: windowDimensions.height < 600 ? 130 : 150
  },
  keyboardIcon: {
    position: 'absolute',
    top: 0
  },
  backButtonIcon: {
    color: 'black'
  }
});

@connect()
export default class NewTransactionView extends Component {
  static navigationOptions = {
    header: null
  }

  state = {
    toAddress: '',
    keyboardState: false,
    contentOffset: 0,
    slideOffset: 0,
    slideY: 0,
    inCameraMode: false
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: (event, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onMoveShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponderCapture: (event, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderTerminationRequest: () => true,
      onPanResponderGrant: () => {
        Keyboard.dismiss();
      },
      onPanResponderMove: this._onPanResponderMove.bind(this),
      onPanResponderRelease: this._onPanResponderRelease.bind(this),
      onPanResponderTerminate: this._onPanResponderRelease.bind(this)
    });
  }

  componentDidMount() {
    this._useAddressFromClipboard();
  }

  componentWillUnmount() {
    StatusBar.setHidden(false);
  }

  _useAddressFromClipboard() {
    Clipboard.getString().then((content) => {
      const isValidAddress = bitcore.Address.isValid(content, config.bitcoin.network);

      if (isValidAddress) {
        this.setState({ toAddress: content });
      }
    });
  }

  _enterCameraMode(noSlide) {
    LayoutAnimation.configureNext(animationConfig);

    this.setState({
      inCameraMode: true,
      slideOffset: noSlide ? 0 : SLIDE_THRESHOLD,
      contentOffset: CAMERA_MODE_OFFSET
    });

    Keyboard.dismiss();
    StatusBar.setHidden(true);
    ReactNativeHaptic.generate('impact');
  }

  _exitCameraMode(noSlide, withKeyboard) {
    if (withKeyboard) {
      LayoutAnimation.configureNext(
        LayoutAnimation.create(100, LayoutAnimation.Types.easeInEaseOut, LayoutAnimation.Properties.opacity)
      );
    } else {
      LayoutAnimation.configureNext(animationConfig);
      ReactNativeHaptic.generate('impact');
    }

    this.setState({
      inCameraMode: false,
      slideOffset: noSlide ? 0 : SLIDE_THRESHOLD,
      contentOffset: 0
    });

    StatusBar.setHidden(false);
  }

  _onPanResponderMoveTextMode(gestureState) {
    const contentOffset = gestureState.dy ? gestureState.dy + this.state.slideOffset : 0;

    if (gestureState.dy > SLIDE_THRESHOLD) {
      return this._enterCameraMode();
    }

    return this.setState({
      contentOffset,
      slideY: gestureState.dy
    });
  }

  _onPanResponderMoveCameraMode(gestureState) {
    const contentOffset = gestureState.dy + CAMERA_MODE_OFFSET - this.state.slideOffset;

    if (gestureState.dy < -SLIDE_THRESHOLD) {
      return this._exitCameraMode();
    }

    return this.setState({
      contentOffset,
      slideY: gestureState.dy
    });
  }

  _onPanResponderMove(event, gestureState) {
    if (this.state.inCameraMode) {
      return this._onPanResponderMoveCameraMode(gestureState);
    }

    return this._onPanResponderMoveTextMode(gestureState);
  }

  _onPanResponderRelease() {
    const inCameraMode = this.state.inCameraMode;
    const contentOffset = inCameraMode ? CAMERA_MODE_OFFSET : 0;

    LayoutAnimation.configureNext(animationConfig);

    this.setState({
      slideOffset: 0,
      slideY: 0,
      contentOffset: contentOffset
    });
  }

  _onKeyboardToggle(keyboardState) {
    this.setState({ keyboardState });
  }

  _showConfirmTransactionView(transaction, fromAddress) {
    const navigation = this.props.navigation;

    navigation.navigate('ConfirmTransaction', {
      address: fromAddress,
      transaction
    });
  }

  _createTransaction() {
    const dispatch = this.props.dispatch;
    const { params } = this.props.navigation.state;
    const fromAddress = params.address;
    const toAddressHash = this.state.toAddress;

    return dispatch(createTransaction(fromAddress, toAddressHash))
      .then((transaction) => {
        this._showConfirmTransactionView(transaction, fromAddress);
      })
      .catch((error) => {
        dispatch(handleError(error));
      });
  }

  _isValidAddress() {
    const toAddress = this.state.toAddress;
    const isValidAddress = bitcore.Address.isValid(toAddress, config.bitcoin.network);

    return isValidAddress;
  }

  _onScan(data) {
    if (!this.state.inCameraMode) {
      return;
    }

    if (!bitcore.URI.isValid(data.data)) {
      return;
    }

    const uri = new bitcore.URI(data.data);

    this.setState({ toAddress: uri.address.toString() });
    this._exitCameraMode(true);
  }

  _getGradientLocations() {
    if (this.state.inCameraMode) {
      // Place gradient at the end (120px).
      const slideOffset = this.state.slideY - this.state.slideOffset;
      const gradientOffset = slideOffset / (windowHeight / 2);

      return [
        1 - (120 / windowHeight) + gradientOffset,
        1
      ];
    }

    // Start the gradient from the middle to the top.
    const contentOffset = this.state.contentOffset;
    const gradientOffset = contentOffset / (windowHeight / 2);

    return [
      0,
      0.5 + gradientOffset
    ];
  }

  _renderQrIcon() {
    const qrIconOffsetStyle = {
      marginTop: this.state.slideY * 0.5
    };

    if (qrIconOffsetStyle.marginTop < 0) {
      qrIconOffsetStyle.marginTop = 0;
    }

    return (
      <QrCodeIcon
        style={[styles.qrCodeIcon, qrIconOffsetStyle]}
        visible={!this.state.inCameraMode}
        onPress={this._enterCameraMode.bind(this, true)}
      />
    );
  }

  _renderKeyboardIcon() {
    const keyboardIconOffsetStyle = {
      top: this.state.slideY * 0.5
    };

    if (keyboardIconOffsetStyle.top > 0) {
      keyboardIconOffsetStyle.top = 0;
    }

    return (
      <KeyboardIcon
        style={[styles.keyboardIcon, keyboardIconOffsetStyle]}
        visible={this.state.inCameraMode}
        onPress={this._exitCameraMode.bind(this, true, false)}
      />
    );
  }

  render() {
    const { params } = this.props.navigation.state;
    const fromAddress = params.address;
    const addressIsValid = this._isValidAddress();
    const placeholder = this.state.inCameraMode ? 'Scanning for QR code...' : 'Enter bitcoin address';
    const contentOffset = this.state.contentOffset;
    const gradientLocations = this._getGradientLocations();

    const contentStyles = [
      styles.content,
      { marginTop: contentOffset }
    ];

    const opacityStyle = {
      opacity: 1 - contentOffset / 100
    };

    return (
      <View style={styles.view}>
        <BaseView style={styles.mainView} backButtonIconStyle={[styles.backButtonIcon, opacityStyle]} {...this._panResponder.panHandlers}>
          <QrCodeScanner opacity={opacityStyle.opacity} onScan={this._onScan.bind(this)} />

          <LinearGradient colors={['rgba(255,255,255,0.0)', 'rgba(255,255,255,1.0)']} locations={gradientLocations} style={styles.gradientView}>
            <View style={contentStyles}>
              <Title style={opacityStyle}>
                Transfer unlocked bitcoins
              </Title>

              <Paragraph style={opacityStyle}>
                Enter address to send your <BtcLabelContainer amount={fromAddress.amount} /> to.
              </Paragraph>

              <View style={styles.inputContainer}>
                <StyledInput
                  ref={(ref) => { this._input = ref; }}
                  placeholder={placeholder}
                  onChangeText={(toAddress) => this.setState({ toAddress })}
                  onFocus={this._exitCameraMode.bind(this, true, true)}
                  value={this.state.toAddress}
                />
              </View>

              {this._renderKeyboardIcon()}
              {this._renderQrIcon()}
            </View>

            <Footer style={opacityStyle} pointerEvents={this.state.inCameraMode ? 'none' : 'auto'}>
              <LargeButton
                label='To confirm →'
                loadingLabel='Calculating fee...'
                disabled={!addressIsValid}
                fullWidth={this.state.keyboardState}
                onPress={this._createTransaction.bind(this)}
              />
              <KeyboardSpacer topSpacing={-30} onToggle={this._onKeyboardToggle.bind(this)} />
            </Footer>

            <KeyboardSpacer topSpacing={-30} onToggle={this._onKeyboardToggle.bind(this)} />
          </LinearGradient>
        </BaseView>
      </View>
    );
  }
}

NewTransactionView.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any
};
