import { AppRegistry } from 'react-native';
import '../index';
import App from '../src/App';

it('registers the app as "BitHodl"', () => {
  const registeredApps = AppRegistry.getAppKeys();
  expect(registeredApps).toContain('BitHodl');
});

describe('the component provider', () => {
  it('returns the App component', () => {
    const runnable = AppRegistry.getRunnable('BitHodl');
    const componentProvider = runnable.componentProvider();

    expect(componentProvider).toBe(App);
  });
});
