import config from '../../src/config';

jest.unmock('../../src/config');

it('exports an object', () => {
  expect(typeof config).toBe('object');
});

describe('config', () => {
  describe('.bitcoin', () => {
    it('is an object', () => {
      expect(typeof config.bitcoin).toBe('object');
    });

    describe('.network', () => {
      it('equals "livenet"', () => {
        expect(typeof config.bitcoin.network).toBe('string');
        expect(config.bitcoin.network).toBe('livenet');
      });
    });
  });

  describe('.api', () => {
    it('is an object', () => {
      expect(typeof config.api).toBe('object');
    });

    describe('.baseUrl', () => {
      it('equals "https://api.bithodl.com/v1"', () => {
        expect(typeof config.api.baseUrl).toBe('string');
        expect(config.api.baseUrl).toBe('https://api.bithodl.com/v1');
      });
    });
  });
});
