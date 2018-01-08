import React from 'react';
import { StatusBar } from 'react-native';
import renderer from 'react-test-renderer';
import App from '../../src/App';

jest.mock('StatusBar', () => {
  return {
    setHidden: jest.fn(),
    setBarStyle: jest.fn()
  };
});

describe('App', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <App />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  describe('contructor', () => {
    beforeEach(() => {
      renderer.create(<App />);
    });

    it('shows the status bar', () => {
      expect(StatusBar.setHidden).toHaveBeenCalledWith(false);
    });

    it('sets the status bar style to "default"', () => {
      expect(StatusBar.setBarStyle).toHaveBeenCalledWith('default');
    });
  });
});
