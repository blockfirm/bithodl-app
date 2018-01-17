import React from 'react';
import renderer from 'react-test-renderer';
import RecoveryPhraseWord from '../../../src/components/RecoveryPhraseWord';

describe('RecoveryPhraseWord', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <RecoveryPhraseWord index={10} word='bulb' />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
