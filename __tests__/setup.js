jest.mock('WebView', () => 'WebView');

jest.mock('Settings', () => ({
  get: jest.fn(() => ({})),
  set: jest.fn(() => {})
}));

jest.mock('Clipboard', () => ({
  setString: jest.fn()
}));

jest.mock('Picker', () => {
  const React = require('React');

  return class MockPicker extends React.Component {
    static Item = (props) => React.createElement('Item', props, props.children);

    render() {
      return React.createElement('Picker', this.props, this.props.children);
    }
  };
});

jest.mock('../src/config');
