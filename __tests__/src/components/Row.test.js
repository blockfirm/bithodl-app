import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import Row from '../../../src/components/Row';

const RealDate = Date;

const mockDate = (fakeDate) => {
  global.Date = class extends RealDate {
    constructor(specifiedDate) {
      super(...arguments);
      return new RealDate(specifiedDate || fakeDate);
    }
  };
};

const unmockDate = () => {
  global.Date = RealDate;
};

jest.mock('../../../src/containers/BtcLabelContainer', () => 'BtcLabelContainer');

describe('Row', () => {
  let row;
  let mockItem;

  beforeAll(() => {
    mockDate('29 November, 2017, 21:59 GMT+02:00');
  });

  beforeEach(() => {
    row = new Row();

    mockItem = {
      id: 'cb3cd64d-4663-49a4-81f5-9a9985be58e9',
      hash: '1JNHNJftiWu57UVpp2cjrNNHCeLwbNy3Zt',
      script: 'OP_RETURN',
      amount: 2000000,
      createdAt: 1471651200,
      unlockAt: 1482192000
    };

    row.props = {
      item: mockItem,
      onShowItem: jest.fn()
    };
  });

  afterAll(() => {
    unmockDate();
  });

  it('renders correctly', () => {
    const tree = renderer.create(
      <Row item={mockItem} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  describe('#_onPress()', () => {
    it('invokes props.onShowItem() with props.item as argument', () => {
      row._onPress();
      expect(row.props.onShowItem).toBeCalledWith(row.props.item);
    });
  });
});
