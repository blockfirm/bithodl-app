import React from 'react';
import { Text } from 'react-native';
import renderer from 'react-test-renderer';

import { HANDLE_ERROR } from '../../../src/actions';
import ErrorBoundary from '../../../src/components/ErrorBoundary';

const dispatchMock = jest.fn();

jest.mock('../../../src/containers/ErrorModalContainer', () => 'ErrorModalContainer');

describe('ErrorBoundary', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <ErrorBoundary dispatch={dispatchMock}>
        <Text>83fd03d9-f631-4662-9432-934df7799582</Text>
      </ErrorBoundary>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  describe('#componentDidCatch(error)', () => {
    it('dispatches an action of type HANDLE_ERROR with the error', () => {
      const error = new Error('69f02833-e701-477f-8af5-3cc99ecdd710');

      const errorBoundary = new ErrorBoundary({
        dispatch: dispatchMock
      });

      errorBoundary.componentDidCatch(error);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: HANDLE_ERROR,
        error
      });
    });
  });
});
