import React from 'react';
import renderer from 'react-test-renderer';
import RecoveryPhrase from '../../../src/components/RecoveryPhrase';

describe('RecoveryPhrase', () => {
  it('renders correctly', () => {
    const phrase = 'during bulb nominee acquire paddle next course stable govern eagle title wing';

    const tree = renderer.create(
      <RecoveryPhrase phrase={phrase} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
