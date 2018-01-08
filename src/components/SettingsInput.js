import React, { Component } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingRight: 15,
    paddingLeft: 15
  },
  input: {
    fontFamily: 'Avenir Next',
    fontWeight: '600',
    fontSize: 13,
    letterSpacing: 1.45,
    color: '#504E64'
  }
});

export default class SettingsInput extends Component {
  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          value={this.props.value}
          placeholder={this.props.placeholder}
          placeholderTextColor='#DDDDDF'
          selectionColor='#FFCA8B'
          clearButtonMode='always'
          autoFocus={true}
          returnKeyType='done'
          onChangeText={this.props.onChangeText}
          onSubmitEditing={this.props.onSubmitEditing}
        />
      </View>
    );
  }
}

SettingsInput.propTypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChangeText: PropTypes.func,
  onSubmitEditing: PropTypes.func
};
