import React from 'react';
import { Text } from 'react-native';
import renderer from 'react-test-renderer';
import StyledText from '../../../src/components/StyledText';

describe('StyledText', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <StyledText numberOfLines={1}>
        <Text>56d8ab7b-d089-46e7-aefc-526768cd08a6</Text>
      </StyledText>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
