import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import StyledText from './StyledText';

export default class TimeLeftTitle extends Component {
  _processTimeLeftTitle(title) {
    let processedTitle = title;

    processedTitle = processedTitle.replace('a ', '1 ');
    processedTitle = processedTitle.replace('an ', '1 ');

    return processedTitle;
  }

  _getEndedTitle(startDate, endDate) {
    let timeHodled = endDate.from(startDate, true);
    timeHodled = this._processTimeLeftTitle(timeHodled);
    return `Hodled for ${timeHodled}`;
  }

  _getTimeLeftTitle(endDate) {
    let timeLeft = endDate.fromNow(true);
    timeLeft = this._processTimeLeftTitle(timeLeft);
    return `${timeLeft} left`;
  }

  render() {
    const startDate = moment.unix(this.props.start);
    const endDate = moment.unix(this.props.end);
    const now = moment();
    let title;

    if (endDate <= now) {
      title = this._getEndedTitle(startDate, endDate);
    } else {
      title = this._getTimeLeftTitle(endDate);
    }

    return (
      <StyledText style={this.props.style}>
        {title}
      </StyledText>
    );
  }
}

TimeLeftTitle.propTypes = {
  style: PropTypes.any,
  start: PropTypes.number.isRequired,
  end: PropTypes.number.isRequired
};
