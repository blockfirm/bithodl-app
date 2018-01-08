import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import * as Progress from 'react-native-progress';
import moment from 'moment-timezone';

const styles = StyleSheet.create({
  icon: {
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center'
  },
  ring: {
    position: 'absolute',
    top: 0,
    left: 0
  },
  text: {
    fontSize: 11,
    fontWeight: 'bold'
  }
});

const colorSchemes = {
  completed: {
    backgroundColor: '#D9E5C3',
    color: '#7FA835'
  },
  days: {
    backgroundColor: '#F6EEC0',
    color: '#D2B828'
  },
  months: {
    backgroundColor: '#FFCB8B',
    color: '#D59247'
  },
  years: {
    backgroundColor: '#E2D7E6',
    color: '#9D78AB'
  }
};

export default class TimeLeftIcon extends Component {
  _getPeriod(start, end) {
    const startDate = moment.unix(start);
    const endDate = moment.unix(end);
    const daysTotal = Math.abs(startDate.diff(endDate, 'days'));

    if (daysTotal < 28) {
      return {
        amount: daysTotal || 1,
        type: 'days'
      };
    }

    if (daysTotal < 350) {
      return {
        amount: Math.round(daysTotal / 30),
        type: 'months'
      };
    }

    return {
      amount: Math.round(daysTotal / 365),
      type: 'years'
    };
  }

  _getProgress(start, end) {
    if (!start || !end) {
      return 0;
    }

    const today = moment();
    const startDate = moment.unix(start);
    const endDate = moment.unix(end);
    const secondsTotal = Math.abs(startDate.diff(endDate, 'seconds'));
    const secondsPassed = Math.abs(startDate.diff(today, 'seconds'));

    if (endDate <= today) {
      return 1;
    }

    const progress = secondsPassed / secondsTotal;

    if (progress > 1) {
      return 1;
    }

    return progress;
  }

  _getText(period, progress) {
    if (progress === 1) {
      return '✓';
    }

    const letterMap = {
      days: 'D',
      months: 'M',
      years: 'Y'
    };

    const letter = letterMap[period.type] || '';
    const label = period.amount.toString() + letter;

    return label;
  }

  _getStyle(period, progress) {
    if (progress === 1) {
      return colorSchemes.completed;
    }

    return colorSchemes[period.type] || {};
  }

  render() {
    const { start, end } = this.props;
    const size = this.props.size || 32;
    const thickness = this.props.thickness || 1;
    const period = this._getPeriod(start, end);
    const progress = this._getProgress(start, end);
    const text = this._getText(period, progress);
    const style = this._getStyle(period, progress);

    const iconStyles = [styles.icon, { backgroundColor: style.backgroundColor }];
    const textStyles = [styles.text, { color: style.color }];

    let progressCircle = null;

    if (progress > 0.01) {
      progressCircle = (
        <Progress.Circle size={size} thickness={thickness} borderWidth={0} progress={progress} color={style.color} />
      );
    }

    return (
      <View style={[iconStyles, this.props.style]}>
        <View style={styles.ring}>
          {progressCircle}
        </View>
        <Text style={[textStyles, this.props.textStyle]}>{text}</Text>
      </View>
    );
  }
}

TimeLeftIcon.propTypes = {
  style: PropTypes.any,
  textStyle: PropTypes.any,
  size: PropTypes.number,
  thickness: PropTypes.number,
  start: PropTypes.number.isRequired,
  end: PropTypes.number.isRequired
};
