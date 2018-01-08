import React, { Component } from 'react';
import { StyleSheet, View, TouchableHighlight, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import StyledText from './StyledText';

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingRight: 15,
    marginLeft: 15,
    borderBottomColor: '#DDDDDF',
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  label: {
    fontWeight: '500',
    color: '#D49146'
  },
  disabled: {
    color: '#8F8E94'
  },
  loader: {
    position: 'absolute',
    top: 1,
    right: 15,
    height: 42
  }
});

export default class SettingsButton extends Component {
  _onPress() {
    if (!this.props.loading) {
      this.props.onPress();
    }
  }

  render() {
    const { isLastItem, loading } = this.props;
    const title = loading ? this.props.loadingTitle : this.props.title;
    const underlayColor = loading ? 'white' : '#FAFAFA';

    const containerStyles = [
      styles.container,
      isLastItem ? { borderBottomWidth: 0 } : undefined
    ];

    const labelStyles = [
      styles.label,
      loading ? styles.disabled : undefined
    ];

    return (
      <TouchableHighlight onPress={this._onPress.bind(this)} underlayColor={underlayColor}>
        <View style={containerStyles}>
          <StyledText style={labelStyles}>{title}</StyledText>
          { loading ? <ActivityIndicator animating={true} color='#8F8E94' style={styles.loader} size='small' /> : null }
        </View>
      </TouchableHighlight>
    );
  }
}

SettingsButton.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  isLastItem: PropTypes.bool,
  loading: PropTypes.bool,
  loadingTitle: PropTypes.string
};
