import React, { Component } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import StyledText from './StyledText';

const windowDimensions = Dimensions.get('window');

const styles = StyleSheet.create({
  paragraph: {
    color: '#8F8E94',
    fontSize: windowDimensions.width < 330 ? 14 : 16,
    marginBottom: windowDimensions.width < 330 ? 15 : 20,
    textAlign: 'center'
  }
});

export default class Paragraph extends Component {
  render() {
    return (
      <StyledText style={[styles.paragraph, this.props.style]}>
        {this.props.children}
      </StyledText>
    );
  }
}

Paragraph.propTypes = {
  style: PropTypes.any,
  children: PropTypes.node
};
