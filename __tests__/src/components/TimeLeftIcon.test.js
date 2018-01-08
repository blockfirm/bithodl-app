import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import TimeLeftIcon from '../../../src/components/TimeLeftIcon';

describe('TimeLeftIcon', () => {
  let fakeAddress;

  beforeEach(() => {
    fakeAddress = {
      id: 'cb3cd64d-4663-49a4-81f5-9a9985be58e9',
      hash: '1JNHNJftiWu57UVpp2cjrNNHCeLwbNy3Zt',
      script: 'OP_RETURN',
      amount: 2000000,
      createdAt: 1471651200,
      unlockAt: 1482192000
    };
  });

  it('renders correctly', () => {
    const tree = renderer.create(
      <TimeLeftIcon start={fakeAddress.createdAt} end={fakeAddress.unlockAt} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  describe('#_getPeriod()', () => {

  });
});
