import config from '../../src/config';

it('exports an object', () => {
  expect(typeof config).toBe('object');
});

describe('config', () => {
  describe('.bitcoin', () => {
    it('is an object', () => {
      expect(typeof config.bitcoin).toBe('object');
    });

    describe('.network', () => {
      it('equals "testnet"', () => {
        expect(typeof config.bitcoin.network).toBe('string');
        expect(config.bitcoin.network).toBe('testnet');
      });
    });
  });

  describe('.api', () => {
    it('is an object', () => {
      expect(typeof config.api).toBe('object');
    });

    describe('.baseUrl', () => {
      it('equals "http://192.168.1.56:3001/v1"', () => {
        expect(typeof config.api.baseUrl).toBe('string');
        expect(config.api.baseUrl).toBe('http://192.168.1.56:3001/v1');
      });
    });
  });
});
