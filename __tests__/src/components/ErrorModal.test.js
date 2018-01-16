import React from 'react';
import renderer from 'react-test-renderer';
import ErrorModal from '../../../src/components/ErrorModal';

describe('ErrorModal', () => {
  it('renders correctly without an error', () => {
    const tree = renderer.create(
      <ErrorModal />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with an error', () => {
    const error = new Error('b4e5375f-a954-47bf-a0b5-6694394a042a');

    const tree = renderer.create(
      <ErrorModal error={error} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
