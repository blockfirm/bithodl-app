import React from 'react';
import { Text } from 'react-native';
import renderer from 'react-test-renderer';
import Paragraph from '../../../src/components/Paragraph';

describe('Paragraph', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <Paragraph>
        <Text>42193c11-0e46-44c7-9406-3a74aea01145</Text>
      </Paragraph>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
