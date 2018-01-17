import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import Stats from '../../../src/components/Stats';

jest.mock('../../../src/containers/BtcLabelContainer', () => 'BtcLabelContainer');

describe('Stats', () => {
  let fakeItems;

  beforeEach(() => {
    fakeItems = {
      '4be67eb7-6715-4d0c-bd8f-a2e85eaa2075': {
        id: '4be67eb7-6715-4d0c-bd8f-a2e85eaa2075',
        hash: '1JNHNJftiWu57UVpp2cjrNNHCeLwbNy3Zt',
        script: 'OP_RETURN',
        amount: 2000000,
        createdAt: 1471651200,
        unlockAt: 1482192000
      },
      'abbefad4-9faf-4f68-9987-9e88caaa866f': {
        id: 'abbefad4-9faf-4f68-9987-9e88caaa866f',
        hash: '1JNHNJftiWu57UVpp2cjrNNHCeLwbNy3Zt',
        script: 'OP_RETURN',
        amount: 1000000,
        createdAt: 1471351200,
        unlockAt: 1482152000
      },
      'e9474dd7-6ad3-4df1-afb2-1de3c477cc55': {
        id: 'e9474dd7-6ad3-4df1-afb2-1de3c477cc55',
        hash: '1JNHNJftiWu57UVpp2cjrNNHCeLwbNy3Zt',
        script: 'OP_RETURN',
        amount: 3000000,
        createdAt: 1471371221,
        unlockAt: 1482352139
      },
      'bf7fb80e-f138-4bba-8d62-fcec289ca2f8': {
        id: 'bf7fb80e-f138-4bba-8d62-fcec289ca2f8',
        hash: '1JNHNJftiWu57UVpp2cjrNNHCeLwbNy3Zt',
        script: 'OP_RETURN',
        amount: 4000000,
        createdAt: 1471371221,
        unlockAt: 1482352139
      }
    };
  });

  it('renders correctly with items', () => {
    const tree = renderer.create(
      <Stats items={fakeItems} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly without items', () => {
    const tree = renderer.create(
      <Stats />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
