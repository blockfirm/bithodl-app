jest.mock('WebView', () => 'WebView');

jest.mock('Settings', () => ({
  get: () => ({}),
  set: () => {}
}));
