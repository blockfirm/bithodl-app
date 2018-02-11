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

    describe('.fee', () => {
      it('is an object', () => {
        expect(typeof config.bitcoin.fee).toBe('object');
      });

      describe('.level', () => {
        it('equals "Normal"', () => {
          expect(typeof config.bitcoin.fee.level).toBe('string');
          expect(config.bitcoin.fee.level).toBe('Normal');
        });
      });

      describe('.satoshisPerByte', () => {
        it('equals 100', () => {
          expect(typeof config.bitcoin.fee.satoshisPerByte).toBe('number');
          expect(config.bitcoin.fee.satoshisPerByte).toBe(100);
        });
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
