import React from 'react';
import renderer from 'react-test-renderer';
import Header from '../../../src/components/Header';

jest.mock('../../../src/containers/BtcLabelContainer', () => 'BtcLabelContainer');

describe('Header', () => {
  let fakeAddress;

  beforeEach(() => {
    fakeAddress = {
      id: 'eadc2f85-8fed-4dfc-8934-63e5de6293e2',
      hash: '1JNHNJftiWu57UVpp2cjrNNHCeLwbNy3Zt',
      script: 'OP_RETURN',
      amount: 2000000,
      createdAt: 1471651200,
      unlockAt: 1482192000
    };
  });

  it('renders correctly with showBackButton set to false', () => {
    const tree = renderer.create(
      <Header showBackButton={false} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with showBackButton set to true', () => {
    const tree = renderer.create(
      <Header showBackButton={true} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  describe('when an address is specified', () => {
    it('renders correctly with hideAddress set to false', () => {
      const tree = renderer.create(
        <Header address={fakeAddress} hideAddress={false} />
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });

    it('renders correctly with hideAddress set to true', () => {
      const tree = renderer.create(
        <Header address={fakeAddress} hideAddress={true} />
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });

  describe('when an address is not specified', () => {
    it('renders correctly with hideAddress set to false', () => {
      const tree = renderer.create(
        <Header hideAddress={false} />
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });

    it('renders correctly with hideAddress set to true', () => {
      const tree = renderer.create(
        <Header hideAddress={true} />
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });
});
