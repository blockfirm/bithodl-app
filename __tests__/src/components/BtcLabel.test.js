import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import BtcLabel from '../../../src/components/BtcLabel';

describe('BtcLabel', () => {
  describe('when unit is not set', () => {
    it('renders amount as BTC', () => {
      const tree = renderer.create(
        <BtcLabel amount={21123456} />
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });

  describe('when unit is set to "BTC"', () => {
    it('renders amount as BTC', () => {
      const tree = renderer.create(
        <BtcLabel amount={21123456} unit='BTC' />
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });

  describe('when unit is set to "mBTC"', () => {
    it('renders amount as mBTC', () => {
      const tree = renderer.create(
        <BtcLabel amount={21123456} unit='mBTC' />
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });
});
