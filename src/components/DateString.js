import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import StyledText from './StyledText';

const styles = StyleSheet.create({
  date: {
    fontWeight: '600'
  }
});

export default class DateString extends Component {
  _getDateString(date) {
    return moment(date).format('DD MMM, YYYY HH:mm');
  }

  render() {
    const dateString = this._getDateString(this.props.date);

    return (
      <StyledText style={[styles.date, this.props.style]}>
        {dateString}
      </StyledText>
    );
  }
}

DateString.propTypes = {
  style: PropTypes.any,
  date: PropTypes.object
};
