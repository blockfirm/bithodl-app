import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import Header from '../components/Header';

const mapStateToProps = (state) => {
  return {
    nav: state.nav
  };
};

class HeaderContainer extends Component {
  static propTypes = {
    nav: PropTypes.object,
    dispatch: PropTypes.func,
    backButtonIconStyle: PropTypes.any,
    hideAddress: PropTypes.bool
  };

  _onBackPress() {
    const dispatch = this.props.dispatch;
    dispatch(NavigationActions.back());
  }

  render() {
    const nav = this.props.nav.routes[0];
    const params = nav.routes[nav.index].params;
    const address = params && params.address;

    // Show back button if there is navigation history.
    const showBackButton = nav.index > 0;

    return (
      <Header
        address={address}
        showBackButton={showBackButton}
        onBackPress={this._onBackPress.bind(this)}
        backButtonIconStyle={this.props.backButtonIconStyle}
        hideAddress={this.props.hideAddress}
      />
    );
  }
}

const HeaderConnector = connect(
  mapStateToProps
)(HeaderContainer);

export default HeaderConnector;
