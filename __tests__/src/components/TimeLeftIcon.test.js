import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import TimeLeftIcon from '../../../src/components/TimeLeftIcon';

const RealDate = Date;

const mockDate = (fakeDate) => {
  global.Date = class extends RealDate {
    constructor(specifiedDate) {
      super(...arguments);
      return new RealDate(specifiedDate || fakeDate);
    }
  };

  global.Date.now = jest.fn(() => new RealDate(fakeDate).getTime());
};

const unmockDate = () => {
  global.Date = RealDate;
};

describe('TimeLeftIcon', () => {
  beforeAll(() => {
    mockDate('29 November, 2017, 21:59 GMT+02:00');
  });

  afterAll(() => {
    unmockDate();
  });

  it('renders correctly when there are years left', () => {
    const fakeAddress = {
      createdAt: 1471651200,
      unlockAt: 1677578920
    };

    const tree = renderer.create(
      <TimeLeftIcon start={fakeAddress.createdAt} end={fakeAddress.unlockAt} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly when there are months left', () => {
    const fakeAddress = {
      createdAt: 1511639940,
      unlockAt: 1519812520
    };

    const tree = renderer.create(
      <TimeLeftIcon start={fakeAddress.createdAt} end={fakeAddress.unlockAt} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly when there are days left', () => {
    const fakeAddress = {
      createdAt: 1511639940,
      unlockAt: 1513108740
    };

    const tree = renderer.create(
      <TimeLeftIcon start={fakeAddress.createdAt} end={fakeAddress.unlockAt} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly when there is no time left', () => {
    const fakeAddress = {
      createdAt: 1471651200,
      unlockAt: 1482192000
    };

    const tree = renderer.create(
      <TimeLeftIcon start={fakeAddress.createdAt} end={fakeAddress.unlockAt} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
