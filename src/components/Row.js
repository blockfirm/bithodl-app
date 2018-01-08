import React, { Component } from 'react';
import { StyleSheet, View, TouchableHighlight } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';

import BtcLabelContainer from '../containers/BtcLabelContainer';
import TimeLeftTitle from './TimeLeftTitle';
import TimeLeftIcon from './TimeLeftIcon';
import RowText from './RowText';

const UPDATE_INTERVAL = 60 * 1000; // 1 minute.

const styles = StyleSheet.create({
  row: {
    alignSelf: 'stretch',
    backgroundColor: 'white',
    padding: 16,
    paddingLeft: 64,
    borderBottomColor: '#F9F8F8',
    borderBottomWidth: 1
  },
  icon: {
    position: 'absolute',
    left: -48,
    top: 3,
    zIndex: 100
  },
  title: {
    fontWeight: '600',
    fontSize: 15,
    lineHeight: 20,
    color: '#504F63'
  },
  chevron: {
    position: 'absolute',
    right: 0,
    top: 8,
    fontSize: 22,
    color: '#EBEBEB'
  },
  amount: {
    position: 'absolute',
    right: 20,
    top: 11,
    fontSize: 13,
    fontWeight: '600',
    color: '#504F63'
  }
});

export default class Row extends Component {
  componentDidMount() {
    // Update component every minute.
    this._interval = setInterval(this.forceUpdate.bind(this), UPDATE_INTERVAL);
  }

  componentWillUnmount() {
    clearInterval(this._interval);
  }

  _onPress() {
    const onShowItem = this.props.onShowItem;

    if (onShowItem) {
      onShowItem(this.props.item);
    }
  }

  render() {
    const item = this.props.item;

    return (
      <TouchableHighlight style={[styles.row, this.props.style]} underlayColor='#FEFCFB' onPress={this._onPress.bind(this)}>
        <View>
          <TimeLeftIcon style={styles.icon} start={item.createdAt} end={item.unlockAt} />
          <TimeLeftTitle style={styles.title} start={item.createdAt} end={item.unlockAt} />
          <RowText item={item} />

          <BtcLabelContainer style={styles.amount} amount={item.amount} />
          <Icon name='ios-arrow-forward' style={styles.chevron} />
        </View>
      </TouchableHighlight>
    );
  }
}

Row.propTypes = {
  style: PropTypes.any,
  item: PropTypes.object.isRequired,
  onShowItem: PropTypes.func
};
