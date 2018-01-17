import React from 'react';
import renderer from 'react-test-renderer';
import SettingsInput from '../../../src/components/SettingsInput';

describe('SettingsInput', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <SettingsInput
        value='6da60d0a-a030-4486-8b69-2c14c9acf6e6'
        placeholder='9fdbf6ec-9aaa-4acb-943e-3f1102ca6a09'
      />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
