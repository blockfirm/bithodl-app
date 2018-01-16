import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import DateString from '../../../src/components/DateString';

describe('DateString', () => {
  it('renders the date correctly', () => {
    const date = new Date('29 November, 2017, 21:59 GMT+02:00');

    const tree = renderer.create(
      <DateString date={date} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
