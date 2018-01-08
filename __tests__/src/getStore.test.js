import getStore from '../../src/getStore';

describe('getStore()', () => {
  it('is a function', () => {
    expect(typeof getStore).toBe('function');
  });

  it('accepts one argument', () => {
    const length = getStore.length;
    expect(length).toBe(1);
  });
});
