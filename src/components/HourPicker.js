import React, { Component } from 'react';
import { StyleSheet, View, Picker } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  picker: {
    width: 100
  },
  borders: {
    position: 'absolute',
    top: 90.5,
    width: 100,
    height: 35,
    borderColor: '#CDCDCD',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth
  }
});

export default class HourPicker extends Component {
  _renderHourItems() {
    const hourItems = [];

    for (let hour = 0; hour < 24; hour++) {
      const label = hour < 10 ? `0${hour}:00` : `${hour}:00`;
      const value = hour.toString();

      hourItems.push(
        <Picker.Item key={hour} label={label} value={value} />
      );
    }

    return hourItems;
  }

  render() {
    return (
      <View>
        <Picker
          style={styles.picker}
          selectedValue={this.props.selectedValue}
          onValueChange={this.props.onValueChange}
        >
          {this._renderHourItems()}
        </Picker>
        <View style={styles.borders} pointerEvents='none' />
      </View>
    );
  }
}

HourPicker.propTypes = {
  selectedValue: PropTypes.string,
  onValueChange: PropTypes.func
};
