jest.mock('WebView', () => 'WebView');

jest.mock('Settings', () => ({
  get: jest.fn(() => ({})),
  set: jest.fn(() => {})
}));
