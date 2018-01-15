import estimateFee from '../../../src/api/estimateFee';

global.fetch = jest.fn(() => new Promise.resolve({
  ok: true,
  json: () => ({
    satoshisPerByte: 123
  })
}));

describe('estimateFee(options)', () => {
  let fakeOptions;
  let returnValue;

  beforeEach(() => {
    fetch.mockClear();

    fakeOptions = {
      baseUrl: 'b9e3d25f-aa29-4f43-8bba-14926a81d574'
    };

    returnValue = estimateFee(fakeOptions);
  });

  it('is a function', () => {
    expect(typeof estimateFee).toBe('function');
  });

  it('accepts one argument', () => {
    expect(estimateFee.length).toBe(1);
  });

  it('makes an HTTP request using fetch', () => {
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('returns a Promise', () => {
    expect(returnValue).toBeInstanceOf(Promise);
  });

  describe('the HTTP request', () => {
    it('is made to the url ${options.baseUrl}/fee/estimate', () => {
      const expectedUrl = 'b9e3d25f-aa29-4f43-8bba-14926a81d574/fee/estimate';
      expect(fetch).toHaveBeenCalledWith(expectedUrl);
    });
  });

  describe('the promise', () => {
    it('resolves to satoshisPerByte from the response', () => {
      expect.hasAssertions();

      return returnValue.then((response) => {
        expect(response).toBe(123);
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

      return estimateFee(fakeOptions).catch((error) => {
        expect(error).toBeTruthy();
        expect(error.message).toContain('Unknown error');
      });
    });
  });

  describe('when satoshisPerByte is a negative number', () => {
    beforeEach(() => {
      global.fetch.mockImplementationOnce(() => new Promise.resolve({
        ok: true,
        json: () => ({
          satoshisPerByte: -1
        })
      }));
    });

    it('rejects the returned promise', () => {
      expect.hasAssertions();

      return estimateFee(fakeOptions).catch((error) => {
        expect(error).toBeTruthy();
      });
    });
  });

  describe('when the response is an error', () => {
    beforeEach(() => {
      global.fetch.mockImplementationOnce(() => new Promise.resolve({
        ok: true,
        json: () => ({
          error: '0d5ff0df-bf1d-484f-99b1-9f942dafbd32'
        })
      }));
    });

    it('rejects the returned promise with the error message from the response', () => {
      expect.hasAssertions();

      return estimateFee(fakeOptions).catch((error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe('0d5ff0df-bf1d-484f-99b1-9f942dafbd32');
      });
    });
  });
});
