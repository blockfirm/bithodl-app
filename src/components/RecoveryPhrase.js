import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import RecoveryPhraseWord from './RecoveryPhraseWord';

const styles = StyleSheet.create({
  list: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default class RecoveryPhrase extends Component {
  _renderWords(words) {
    return words.map((word, index) => {
      return (
        <RecoveryPhraseWord key={index} index={index} word={word} />
      );
    });
  }

  render() {
    const phrase = this.props.phrase;
    const words = phrase.split(' ');

    return (
      <View style={[styles.list, this.props.style]}>
        {this._renderWords(words)}
      </View>
    );
  }
}

RecoveryPhrase.propTypes = {
  phrase: PropTypes.string.isRequired,
  style: PropTypes.any
};
