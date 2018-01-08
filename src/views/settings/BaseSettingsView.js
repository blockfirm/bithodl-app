import React, { Component } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ErrorBoundary from '../../components/ErrorBoundary';

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#EFEFF4'
  },
  scrollView: {
    paddingTop: 30
  }
});

@connect()
export default class BaseSettingsView extends Component {
  render() {
    return (
      <ErrorBoundary {...this.props} style={styles.view}>
        <ScrollView style={styles.scrollView}>
          {this.props.children}
        </ScrollView>
      </ErrorBoundary>
    );
  }
}

BaseSettingsView.propTypes = {
  children: PropTypes.node
};
