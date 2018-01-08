import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import BtcLabel from '../../../src/components/BtcLabel';

describe('BtcLabel', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <BtcLabel amount={21123456} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  describe('#_formatBtc(satoshis)', () => {
    let btcLabel;

    beforeEach(() => {
      btcLabel = new BtcLabel();
    });

    it('accepts one argument', () => {
      const length = btcLabel._formatBtc.length;
      expect(length).toBe(1);
    });

    it('returns the amount as BTC followed by "₿"', () => {
      const satoshis = 21123456;
      const returnValue = btcLabel._formatBtc(satoshis);

      expect(typeof returnValue).toBe('string');
      expect(returnValue).toBe('0.21123456 ₿');
    });
  });
});
