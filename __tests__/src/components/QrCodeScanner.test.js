import React from 'react';
import renderer from 'react-test-renderer';
import QrCodeScanner from '../../../src/components/QrCodeScanner';

describe('QrCodeScanner', () => {
  it('renders correctly', () => {
    const onScan = jest.fn();

    const tree = renderer.create(
      <QrCodeScanner opacity={0} onScan={onScan} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
