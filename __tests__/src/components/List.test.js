import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import List from '../../../src/components/List';

jest.mock('../../../src/containers/BtcLabelContainer', () => 'BtcLabelContainer');

describe('List', () => {
  let onShowItem;
  let fakeItems;

  beforeEach(() => {
    onShowItem = jest.fn();

    fakeItems = {
      'ee1259fd-934e-484f-a391-ac52978486ec': {
        id: 'ee1259fd-934e-484f-a391-ac52978486ec',
        hash: '1JNHNJftiWu57UVpp2cjrNNHCeLwbNy3Zt',
        script: 'OP_RETURN',
        amount: 2000000,
        createdAt: 1471651200,
        unlockAt: 1482192000
      },
      '83e81610-270e-4c0f-80e3-e12b4093c8be': {
        id: '83e81610-270e-4c0f-80e3-e12b4093c8be',
        hash: '1JNHNJftiWu57UVpp2cjrNNHCeLwbNy3Zt',
        script: 'OP_RETURN',
        amount: 1000000,
        createdAt: 1471351200,
        unlockAt: 1482152000
      },
      'e09a888f-3c21-40d4-aa70-55943dec9457': {
        id: 'e09a888f-3c21-40d4-aa70-55943dec9457',
        hash: '1JNHNJftiWu57UVpp2cjrNNHCeLwbNy3Zt',
        script: 'OP_RETURN',
        amount: 3000000,
        createdAt: 1471371221,
        unlockAt: 1482352139
      },
      '60243061-8a91-44ab-b6e1-683e8ee086dc': {
        id: '60243061-8a91-44ab-b6e1-683e8ee086dc',
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
      <List items={fakeItems} onShowItem={onShowItem} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly without items', () => {
    const tree = renderer.create(
      <List />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
