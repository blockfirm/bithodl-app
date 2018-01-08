import React, { Component } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import Row from '../components/Row';

const BORDER_RADIUS = 6;

const styles = StyleSheet.create({
  list: {
    alignSelf: 'stretch',
    backgroundColor: '#FEFCFB',
    minHeight: 426,
    borderRadius: BORDER_RADIUS,
    shadowColor: '#000000',
    shadowRadius: 4,
    shadowOpacity: 0.25,
    shadowOffset: {
      height: 0,
      width: 0
    },
    marginTop: 213,
    marginBottom: 10
  }
});

export default class List extends Component {
  _getItems() {
    const list = Object.values(this.props.items || {});

    list.sort((a, b) => {
      if (a.unlockAt < b.unlockAt) {
        return -1;
      }

      if (a.unlockAt > b.unlockAt) {
        return 1;
      }

      return 0;
    });

    return list;
  }

  _renderRows(items) {
    const firstStyle = {
      borderTopLeftRadius: BORDER_RADIUS,
      borderTopRightRadius: BORDER_RADIUS
    };

    const lastStyle = {
      borderBottomLeftRadius: BORDER_RADIUS,
      borderBottomRightRadius: BORDER_RADIUS
    };

    const rows = items.map((item, index) => {
      let style;

      if (index === 0) {
        style = firstStyle;
      } else if (index === items.length - 1) {
        style = lastStyle;
      }

      return (
        <Row item={item} key={item.id} style={style} onShowItem={this.props.onShowItem} />
      );
    });

    return rows;
  }

  render() {
    const items = this._getItems();

    return (
      <ScrollView showsVerticalScrollIndicator={false} style={this.props.style}>
        <View style={styles.list}>
          {this._renderRows(items)}
        </View>
      </ScrollView>
    );
  }
}

List.propTypes = {
  style: PropTypes.any,
  items: PropTypes.object,
  onShowItem: PropTypes.func
};
