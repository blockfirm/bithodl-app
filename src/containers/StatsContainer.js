import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { readAddresses } from '../actions';
import Stats from '../components/Stats';

const mapStateToProps = (state) => {
  return {
    items: state.addresses.items
  };
};

class StatsContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func
  };

  componentDidMount() {
    const dispatch = this.props.dispatch;
    dispatch(readAddresses());
  }

  render() {
    return (
      <Stats {...this.props} />
    );
  }
}

const StatsConnector = connect(
  mapStateToProps
)(StatsContainer);

export default StatsConnector;
