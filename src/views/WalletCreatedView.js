import React, { Component } from 'react';
import { StyleSheet, Image } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { navigateWithReset } from '../actions';
import Title from '../components/Title';
import Paragraph from '../components/Paragraph';
import Footer from '../components/Footer';
import LargeButton from '../components/LargeButton';
import Link from '../components/Link';
import BaseView from './BaseView';

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 142,
    marginBottom: 50
  },
  title: {
    marginBottom: 20
  },
  button: {
    marginBottom: 10
  }
});

@connect()
export default class WalletCreatedView extends Component {
  static navigationOptions = {
    header: null
  }

  _showHomeView() {
    const dispatch = this.props.dispatch;
    dispatch(navigateWithReset('Home'));
  }

  _showNewAddressView() {
    const navigation = this.props.navigation;
    navigation.navigate('NewAddress');
  }

  render() {
    return (
      <BaseView>
        <Image source={require('../img/illustrations/wallet.png')} style={styles.image} />

        <Title style={styles.title}>
          Your wallet is ready to use
        </Title>

        <Paragraph>
          You are now ready to time-lock your first amount of bitcoin with BitHodl!
        </Paragraph>

        <Footer>
          <LargeButton label="Let's get started" onPress={this._showNewAddressView.bind(this)} style={styles.button} />

          <Link onPress={this._showHomeView.bind(this)}>
            {'Not now, I\'m not ready yet'}
          </Link>
        </Footer>
      </BaseView>
    );
  }
}

WalletCreatedView.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any
};
