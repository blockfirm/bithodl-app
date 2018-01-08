import getAddresses from '../../../src/api/getAddresses';

global.fetch = jest.fn(() => new Promise.resolve({
  ok: true,
  json: () => ([
    '3f082aa9-db35-4def-a659-4d3d48613ef9'
  ])
}));

describe('getAddresses(publicKey, options)', () => {
  let fakePublicKey;
  let fakeOptions;
  let returnValue;

  beforeEach(() => {
    fetch.mockClear();

    fakePublicKey = {
      toString: () => '9cc94ad7-a6f5-432c-b043-6839ffc4790e'
    };

    fakeOptions = {
      baseUrl: '71c01af0-4bd8-447b-9d7c-e7d934420e03'
    };

    returnValue = getAddresses(fakePublicKey, fakeOptions);
  });

  it('is a function', () => {
    expect(typeof getAddresses).toBe('function');
  });

  it('accepts two arguments', () => {
    expect(getAddresses.length).toBe(2);
  });

  it('makes an HTTP request using fetch', () => {
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('returns a Promise', () => {
    expect(returnValue).toBeInstanceOf(Promise);
  });

  describe('the HTTP request', () => {
    it('is made to the url ${options.baseUrl}/public-key/${publicKeyString}/addresses', () => {
      const expectedUrl = '71c01af0-4bd8-447b-9d7c-e7d934420e03/public-key/9cc94ad7-a6f5-432c-b043-6839ffc4790e/addresses';
      expect(fetch).toHaveBeenCalledWith(expectedUrl);
    });
  });

  describe('the promise', () => {
    it('resolves to the response', () => {
      expect.hasAssertions();

      return returnValue.then((response) => {
        expect(response).toBeTruthy();
        expect(response).toContain('3f082aa9-db35-4def-a659-4d3d48613ef9');
      });
    });
  });

  describe('when the response is an empty object', () => {
    beforeEach(() => {
      global.fetch.mockImplementationOnce(() => new Promise.resolve({
        ok: true,
        json: () => ({})
      }));
    });

    it('rejects the returned promise with an "Unknown error" error', () => {
      expect.hasAssertions();

      return getAddresses(fakePublicKey, fakeOptions).catch((error) => {
        expect(error).toBeTruthy();
        expect(error.message).toContain('Unknown error');
      });
    });
  });

  describe('when the response is an error', () => {
    beforeEach(() => {
      global.fetch.mockImplementationOnce(() => new Promise.resolve({
        ok: true,
        json: () => ({
          error: '79dc3fcb-f467-4741-a658-001a2fddff3f'
        })
      }));
    });

    it('rejects the returned promise with the error message from the response', () => {
      expect.hasAssertions();

      return getAddresses(fakePublicKey, fakeOptions).catch((error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe('79dc3fcb-f467-4741-a658-001a2fddff3f');
      });
    });
  });
});
