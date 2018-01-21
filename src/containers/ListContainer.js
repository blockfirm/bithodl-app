import React, { Component } from 'react';
import { ActionSheetIOS } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import moment from 'moment-timezone';

import { readAddresses, writeAddresses, deleteAddress } from '../actions';
import List from '../components/List';

const ACTION_TRANSFER = 0;
const ACTION_DELETE = 1;
const ACTION_CANCEL = 2;

const mapStateToProps = (state) => {
  return {
    items: state.addresses.items,
    navigation: state.navigation
  };
};

class ListContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func
  };

  componentDidMount() {
    const dispatch = this.props.dispatch;
    dispatch(readAddresses());
  }

  _showActionMenu(item) {
    const dispatch = this.props.dispatch;

    const options = {
      title: 'This address is empty',
      options: [
        'Transfer bitcoins to address',
        'Delete from wallet',
        'Cancel'
      ],
      cancelButtonIndex: ACTION_CANCEL,
      destructiveButtonIndex: ACTION_DELETE
    };

    ActionSheetIOS.showActionSheetWithOptions(options, (index) => {
      switch (index) {
        case ACTION_TRANSFER:
          dispatch(NavigationActions.navigate({
            routeName: 'AddressCreated',
            params: { address: item }
          }));
          break;

        case ACTION_DELETE:
          dispatch(deleteAddress(item)).then(() => {
            return dispatch(writeAddresses());
          });
          break;
      }
    });
  }

  _onShowItem(item) {
    const dispatch = this.props.dispatch;
    const unlockDate = moment.unix(item.unlockAt);
    let routeName = 'NewTransaction';

    if (!item.utxo) {
      return this._showActionMenu(item);
    }

    if (unlockDate > new Date()) {
      routeName = 'AddressLocked';
    }

    dispatch(NavigationActions.navigate({
      routeName: routeName,
      params: { address: item }
    }));
  }

  render() {
    return (
      <List
        {...this.props}
        onShowItem={this._onShowItem.bind(this)}
      />
    );
  }
}

const ListConnector = connect(
  mapStateToProps
)(ListContainer);

export default ListConnector;
