import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import BtcLabel from '../components/BtcLabel';

const mapStateToProps = (state) => {
  return {
    settings: state.settings
  };
};

class BtcLabelContainer extends Component {
  static propTypes = {
    settings: PropTypes.object
  };

  render() {
    const settings = this.props.settings;
    const unit = settings.bitcoin.unit;

    return (
      <BtcLabel {...this.props} unit={unit} />
    );
  }
}

const BtcLabelConnector = connect(
  mapStateToProps
)(BtcLabelContainer);

export default BtcLabelConnector;
