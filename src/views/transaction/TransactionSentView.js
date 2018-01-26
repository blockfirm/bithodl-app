import React, { Component } from 'react';
import { StyleSheet, Image } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { navigateWithReset } from '../../actions';
import Title from '../../components/Title';
import Paragraph from '../../components/Paragraph';
import LargeButton from '../../components/LargeButton';
import Footer from '../../components/Footer';
import BaseView from '../BaseView';

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 224,
    marginBottom: 50
  }
});

@connect()
export default class TransactionSentView extends Component {
  static navigationOptions = {
    header: null
  }

  _showHomeView() {
    const dispatch = this.props.dispatch;
    return dispatch(navigateWithReset('Home'));
  }

  render() {
    return (
      <BaseView>
        <Image source={require('../../img/illustrations/flying-coin.png')} style={styles.image} />

        <Title>
          Transaction sent
        </Title>

        <Paragraph>
          Your transaction has been sent and should soon arrive at its destination.
        </Paragraph>

        <Footer>
          <LargeButton label='OK' onPress={this._showHomeView.bind(this)} />
        </Footer>
      </BaseView>
    );
  }
}

TransactionSentView.propTypes = {
  dispatch: PropTypes.func
};
