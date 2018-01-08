import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SettingsButton from '../components/SettingsButton';

const mapStateToProps = (state) => {
  return {
    loading: state.wallet.syncing
  };
};

class ResyncWalletButtonContainer extends Component {
  static propTypes = {
    loading: PropTypes.bool
  };

  render() {
    return (
      <SettingsButton {...this.props} loading={this.props.loading} />
    );
  }
}

const ResyncWalletButtonConnector = connect(
  mapStateToProps
)(ResyncWalletButtonContainer);

export default ResyncWalletButtonConnector;
