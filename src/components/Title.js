import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import StyledText from './StyledText';

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 10,
    textAlign: 'center'
  }
});

export default class Title extends Component {
  render() {
    return (
      <StyledText style={[styles.title, this.props.style]}>
        {this.props.children}
      </StyledText>
    );
  }
}

Title.propTypes = {
  style: PropTypes.any,
  children: PropTypes.node
};
