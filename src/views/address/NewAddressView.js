import React, { Component } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import UncontrolledDatePickerIOS from 'react-native-uncontrolled-date-picker-ios';

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
    marginBottom: 81
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

  _addAddress(unlockDate) {
    const dispatch = this.props.dispatch;
    const unlockHour = Number(this.state.unlockHour);
    let unlockTime = new Date(unlockDate);

    unlockTime.setHours(unlockHour);
    unlockTime = getFullHour(unlockTime);

    return dispatch(createAddress(unlockTime))
      .then((address) => {
        this._showAddressCreatedView(address);
      })
      .catch((error) => {
        dispatch(handleError(error));
      });
  }

  _onCreatePress() {
    const dispatch = this.props.dispatch;
    const pastDateError = new Error('The selected date cannot be in the past. Please select a future date.');
    const tooDistantDateError = new Error(`The selected date cannot be more than ${MAXIMUM_YEARS} years from now. Please select a closer date.`);

    return new Promise((resolve) => {
      // Give the date picker some time to finish spinning.
      setTimeout(() => {
        // Update the state with the selected date.
        this._datePicker.getDate((date) => {
          const unlockDate = new Date(date);

          // Check that the date is not in the past.
          if (unlockDate < this._getMinimumDate()) {
            dispatch(handleError(pastDateError));
            return resolve();
          }

          // Check that the date is not too far in the future.
          if (unlockDate > this._getMaximumDate()) {
            dispatch(handleError(tooDistantDateError));
            return resolve();
          }

          this._addAddress(unlockDate)
            .then(resolve)
            .catch(resolve);
        });
      }, 20);
    });
  }

  _onHourChange(hour) {
    this.setState({ unlockHour: hour });
  }

  _getMinimumDate() {
    const minimumDate = new Date();
    minimumDate.setDate(minimumDate.getDate() - 1);
    return minimumDate;
  }

  _getMaximumDate() {
    const maximumDate = new Date();
    maximumDate.setFullYear(maximumDate.getFullYear() + MAXIMUM_YEARS);
    return maximumDate;
  }

  render() {
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
          <UncontrolledDatePickerIOS
            ref={(ref) => { this._datePicker = ref; }}
            style={styles.datePicker}
            date={this.state.unlockDate}
            mode='date'
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

          <LargeButton
            label='Create'
            loadingLabel='Creating address...'
            onPress={this._onCreatePress.bind(this)}
          />
        </Footer>
      </BaseView>
    );
  }
}

NewAddressView.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any
};
