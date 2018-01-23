import React, { Component } from 'react';
import { StyleSheet, View, DatePickerIOS, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import { createAddress, handleError } from '../../actions';
import getFullHour from '../../utils/getFullHour';
import Title from '../../components/Title';
import Paragraph from '../../components/Paragraph';
import HourPicker from '../../components/HourPicker';
import LargeButton from '../../components/LargeButton';
import Footer from '../../components/Footer';
import BaseView from '../BaseView';

const windowDimensions = Dimensions.get('window');
const MAXIMUM_YEARS = 3;

const styles = StyleSheet.create({
  paragraph: {
    marginBottom: 40
  },
  timePickerView: {
    flexDirection: 'row'
  },
  datePicker: {
    width: windowDimensions.width - 100,
    marginBottom: 80
  },
  warningIcon: {
    color: '#8F8E94',
    marginBottom: 10
  },
  disclaimer: {
    fontSize: 10
  }
});

@connect()
export default class NewAddressView extends Component {
  static navigationOptions = {
    header: null
  }

  constructor() {
    super(...arguments);

    const now = new Date();

    this.state = {
      unlockDate: now,
      unlockHour: now.getHours().toString()
    };
  }

  _showAddressCreatedView(address) {
    const navigation = this.props.navigation;
    navigation.navigate('AddressCreated', { address });
  }

  _addAddress() {
    const dispatch = this.props.dispatch;
    const unlockHour = Number(this.state.unlockHour);
    let unlockDate = this.state.unlockDate;

    unlockDate.setHours(unlockHour);
    unlockDate = getFullHour(unlockDate);

    dispatch(createAddress(unlockDate))
      .then((address) => {
        this._showAddressCreatedView(address);
      })
      .catch((error) => {
        dispatch(handleError(error));
      });
  }

  _onDateChange(date) {
    this.setState({ unlockDate: date });
  }

  _onHourChange(hour) {
    this.setState({ unlockHour: hour });
  }

  _getMinimumDate() {
    return new Date();
  }

  _getMaximumDate() {
    const maximumDate = new Date();
    maximumDate.setFullYear(maximumDate.getFullYear() + MAXIMUM_YEARS);
    return maximumDate;
  }

  render() {
    const maximumDate = this._getMaximumDate();

    return (
      <BaseView>
        <Title>
          Select date and time
        </Title>

        <Paragraph style={styles.paragraph}>
          Select the date and time until which your bitcoins should be locked.
          You will transfer the bitcoins in the next step.
        </Paragraph>

        <View style={styles.timePickerView}>
          <DatePickerIOS
            style={styles.datePicker}
            date={this.state.unlockDate}
            maximumDate={maximumDate}
            mode='date'
            onDateChange={this._onDateChange.bind(this)}
          />

          <HourPicker
            selectedValue={this.state.unlockHour}
            onValueChange={this._onHourChange.bind(this)}
          />
        </View>

        <Footer>
          <Icon name='ios-warning-outline' style={styles.warningIcon} />

          <Paragraph style={styles.disclaimer}>
            Please note that the actual unlock time might differ up to around 1 hour due to
            the time on the network being slightly different than the actual time.
          </Paragraph>

          <LargeButton label='Create' onPress={this._addAddress.bind(this)}></LargeButton>
        </Footer>
      </BaseView>
    );
  }
}

NewAddressView.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any
};
