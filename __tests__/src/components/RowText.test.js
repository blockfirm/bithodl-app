import React from 'react';
import renderer from 'react-test-renderer';
import RowText from '../../../src/components/RowText';

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

describe('RowText', () => {
  beforeAll(() => {
    mockDate('29 November, 2017, 21:59 GMT+02:00');
  });

  afterAll(() => {
    unmockDate();
  });

  it('renders correctly when the item is locked', () => {
    const fakeItem = {
      id: '80049d24-d08e-413f-a35f-d1598ddc8df5',
      hash: '1JNHNJftiWu57UVpp2cjrNNHCeLwbNy3Zt',
      script: 'OP_RETURN',
      amount: 4000000,
      createdAt: 1471651200,
      unlockAt: 1677578920
    };

    const tree = renderer.create(
      <RowText item={fakeItem} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly when the item is unlocked', () => {
    const fakeItem = {
      id: 'f05f0af9-66c5-4d76-9882-3bb2377aa863',
      hash: '1JNHNJftiWu57UVpp2cjrNNHCeLwbNy3Zt',
      script: 'OP_RETURN',
      amount: 2000000,
      createdAt: 1471651200,
      unlockAt: 1482192000
    };

    const tree = renderer.create(
      <RowText item={fakeItem} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
