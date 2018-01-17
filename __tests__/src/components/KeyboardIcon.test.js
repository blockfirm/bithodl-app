import React from 'react';
import renderer from 'react-test-renderer';
import KeyboardIcon from '../../../src/components/KeyboardIcon';

describe('KeyboardIcon', () => {
  it('renders correctly when visible', () => {
    const tree = renderer.create(
      <KeyboardIcon visible={true} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly when not visible', () => {
    const tree = renderer.create(
      <KeyboardIcon visible={false} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
