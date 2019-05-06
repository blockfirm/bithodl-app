import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ifIphoneX } from 'react-native-iphone-x-helper';

import StatsContainer from '../containers/StatsContainer';
import ListContainer from '../containers/ListContainer';

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fec98a'
  },
  navigationBar: {
    backgroundColor: '#fec98a',
    borderBottomWidth: 0
  },
  navigationIcon: {
    fontSize: 28,
    color: '#D49146',
    padding: 10
  },
  stats: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 73,
    left: 0,
    right: 0
  },
  list: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'visible',
    backfaceVisibility: 'visible',
    padding: 4,
    marginBottom: ifIphoneX(34, 0)
  }
});

export default class HomeView extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerStyle: styles.navigationBar,
    headerRight: (
      <TouchableOpacity onPress={() => { Alert.alert('Discontinued', 'BitHodl has been discontinued and you can no longer lock any more coins.'); }}>
        <Icon name='ios-add-circle-outline' style={styles.navigationIcon} />
      </TouchableOpacity>
    ),
    headerLeft: (
      <TouchableOpacity onPress={() => { navigation.navigate('Settings'); }}>
        <Icon name='ios-settings-outline' style={styles.navigationIcon} />
      </TouchableOpacity>
    )
  });

  componentDidMount() {
    Alert.alert(
      'Discontinued',
      'BitHodl has been discontinued and you can no longer lock any more coins. You are encouraged to withdraw your unlocked funds to another wallet as soon as possible. BitHodl will continue to operate until all users have withdrew their funds or until latest 14th of May 2022.'
    );
  }

  render() {
    return (
      <View style={styles.view}>
        <StatsContainer style={styles.stats} />
        <ListContainer style={styles.list} />
      </View>
    );
  }
}
