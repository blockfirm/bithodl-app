import getUnspentOutputs from '../../../src/api/getUnspentOutputs';

global.fetch = jest.fn(() => new Promise.resolve({
  ok: true,
  json: () => ([
    '5624f620-f847-4dd0-b46b-bb8d1f2971d0'
  ])
}));

describe('getUnspentOutputs(address, options)', () => {
  let fakeAddress;
  let fakeOptions;
  let returnValue;

  beforeEach(() => {
    fetch.mockClear();

    fakeAddress = {
      hash: '25a23c24-db24-446f-bb86-d96899146e53'
    };

    fakeOptions = {
      baseUrl: 'd2b0a53a-4b3d-49e4-a6eb-f5ed85d6105d'
    };

    returnValue = getUnspentOutputs(fakeAddress, fakeOptions);
  });

  it('is a function', () => {
    expect(typeof getUnspentOutputs).toBe('function');
  });

  it('accepts two arguments', () => {
    expect(getUnspentOutputs.length).toBe(2);
  });

  it('makes an HTTP request using fetch', () => {
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('returns a Promise', () => {
    expect(returnValue).toBeInstanceOf(Promise);
  });

  describe('the HTTP request', () => {
    it('is made to the url ${options.baseUrl}/address/${address.hash}/utxos', () => {
      const expectedUrl = 'd2b0a53a-4b3d-49e4-a6eb-f5ed85d6105d/address/25a23c24-db24-446f-bb86-d96899146e53/utxos';
      expect(fetch).toHaveBeenCalledWith(expectedUrl);
    });
  });

  describe('the promise', () => {
    it('resolves to the response', () => {
      expect.hasAssertions();

      return returnValue.then((response) => {
        expect(response).toBeTruthy();
        expect(response).toContain('5624f620-f847-4dd0-b46b-bb8d1f2971d0');
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

      return getUnspentOutputs(fakeAddress, fakeOptions).catch((error) => {
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
          error: '51fba612-93b8-4251-96b7-7eb1b5fe8fc7'
        })
      }));
    });

    it('rejects the returned promise with the error message from the response', () => {
      expect.hasAssertions();

      return getUnspentOutputs(fakeAddress, fakeOptions).catch((error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe('51fba612-93b8-4251-96b7-7eb1b5fe8fc7');
      });
    });
  });
});
