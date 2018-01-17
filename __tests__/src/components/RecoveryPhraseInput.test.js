import React from 'react';
import renderer from 'react-test-renderer';
import RecoveryPhraseInput from '../../../src/components/RecoveryPhraseInput';

describe('RecoveryPhraseInput', () => {
  it('renders correctly', () => {
    const correctPhrase = 'during bulb nominee acquire paddle next course stable govern eagle title wing';

    const tree = renderer.create(
      <RecoveryPhraseInput correctPhrase={correctPhrase} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
