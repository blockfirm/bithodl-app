import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment-timezone';

import { navigateWithReset } from '../../actions';
import BtcLabelContainer from '../../containers/BtcLabelContainer';
import Title from '../../components/Title';
import Paragraph from '../../components/Paragraph';
import LargeButton from '../../components/LargeButton';
import Footer from '../../components/Footer';
import DateString from '../../components/DateString';
import TimeLeftIcon from '../../components/TimeLeftIcon';
import BaseView from '../BaseView';

const styles = StyleSheet.create({
  image: {
    width: 300,
    height: 213,
    marginBottom: 50
  },
  icon: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 50
  },
  iconText: {
    fontSize: 56,
    backgroundColor: 'transparent'
  }
});

@connect()
export default class AddressFundedView extends Component {
  static navigationOptions = {
    header: null
  }

  _showHomeView() {
    const dispatch = this.props.dispatch;
    return dispatch(navigateWithReset('Home'));
  }

  render() {
    const { params } = this.props.navigation.state;
    const address = params.address;
    const unlockDate = moment.unix(address.unlockAt);

    return (
      <BaseView hideHeaderAddress={true}>
        <TimeLeftIcon
          style={styles.icon}
          textStyle={styles.iconText}
          size={200}
          thickness={3}
          start={address.createdAt}
          end={address.unlockAt}
        />

        <Title>
          Congratulations!
        </Title>

        <Paragraph>
          You are now hodling <BtcLabelContainer amount={address.amount} /> until{'\n'}
          <DateString date={unlockDate} />. Enjoy the ride!
        </Paragraph>

        <Footer>
          <LargeButton label='Hodl on' onPress={this._showHomeView.bind(this)} />
        </Footer>
      </BaseView>
    );
  }
}

AddressFundedView.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any
};
