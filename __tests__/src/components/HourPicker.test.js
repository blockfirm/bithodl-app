import React from 'react';
import renderer from 'react-test-renderer';
import HourPicker from '../../../src/components/HourPicker';

describe('HourPicker', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <HourPicker />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
