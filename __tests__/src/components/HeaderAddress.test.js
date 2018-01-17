import React from 'react';
import renderer from 'react-test-renderer';
import HeaderAddress from '../../../src/components/HeaderAddress';

jest.mock('../../../src/containers/BtcLabelContainer', () => 'BtcLabelContainer');

describe('HeaderAddress', () => {
  it('renders correctly', () => {
    const fakeAddress = {
      id: '5012fed3-5d24-40f8-a99d-42bbfa7e9e56',
      hash: '1JNHNJftiWu57UVpp2cjrNNHCeLwbNy3Zt',
      script: 'OP_RETURN',
      amount: 2000000,
      createdAt: 1471651200,
      unlockAt: 1482192000
    };

    const tree = renderer.create(
      <HeaderAddress address={fakeAddress} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
