import React, { Component } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ErrorBoundary from '../../components/ErrorBoundary';

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#EFEFF4'
  },
  childrenWrapper: {
    paddingTop: 30
  }
});

@connect()
export default class BaseSettingsView extends Component {
  render() {
    return (
      <ErrorBoundary {...this.props} style={styles.view}>
        <ScrollView>
          <View style={styles.childrenWrapper}>
            {this.props.children}
          </View>
        </ScrollView>
      </ErrorBoundary>
    );
  }
}

BaseSettingsView.propTypes = {
  children: PropTypes.node
};
