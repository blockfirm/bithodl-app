import React from 'react';
import renderer from 'react-test-renderer';
import QrCodeIcon from '../../../src/components/QrCodeIcon';

describe('QrCodeIcon', () => {
  it('renders correctly when visible', () => {
    const tree = renderer.create(
      <QrCodeIcon visible={true} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly when not visible', () => {
    const tree = renderer.create(
      <QrCodeIcon visible={false} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
