import api from '../../../src/api';
import { estimateFee, ESTIMATE_FEE_REQUEST, ESTIMATE_FEE_SUCCESS, ESTIMATE_FEE_FAILURE } from '../../../src/actions/estimateFee';

const dispatchMock = jest.fn();

const getStateMock = jest.fn(() => ({
  settings: {
    api: {
      baseUrl: 'a5d31859-9daa-47e1-84cb-2f45da488102'
    }
  }
}));

jest.mock('../../../src/api', () => ({
  estimateFee: jest.fn(() => Promise.resolve(123))
}));

describe('ESTIMATE_FEE_REQUEST', () => {
  it('equals "ESTIMATE_FEE_REQUEST"', () => {
    expect(ESTIMATE_FEE_REQUEST).toBe('ESTIMATE_FEE_REQUEST');
  });
});

describe('ESTIMATE_FEE_SUCCESS', () => {
  it('equals "ESTIMATE_FEE_SUCCESS"', () => {
    expect(ESTIMATE_FEE_SUCCESS).toBe('ESTIMATE_FEE_SUCCESS');
  });
});

describe('ESTIMATE_FEE_FAILURE', () => {
  it('equals "ESTIMATE_FEE_FAILURE"', () => {
    expect(ESTIMATE_FEE_FAILURE).toBe('ESTIMATE_FEE_FAILURE');
  });
});

describe('estimateFee', () => {
  beforeEach(() => {
    api.estimateFee.mockClear();
  });

  it('is a function', () => {
    expect(typeof estimateFee).toBe('function');
  });

  it('accepts no arguments', () => {
    expect(estimateFee.length).toBe(0);
  });

  it('returns a function', () => {
    const returnValue = estimateFee();
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = estimateFee();
    });

    it('dispathes an action of type ESTIMATE_FEE_REQUEST', () => {
      returnedFunction(dispatchMock, getStateMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: ESTIMATE_FEE_REQUEST
      });
    });

    it('fetches the estimated fee using api.estimateFee() together with baseUrl from settings', () => {
      expect.hasAssertions();

      return returnedFunction(dispatchMock, getStateMock).then(() => {
        const expectedOptions = {
          baseUrl: 'a5d31859-9daa-47e1-84cb-2f45da488102'
        };

        expect(api.estimateFee).toHaveBeenCalledTimes(1);
        expect(api.estimateFee).toHaveBeenCalledWith(expectedOptions);
      });
    });

    it('returns a Promise', () => {
      const returnValue = returnedFunction(dispatchMock, getStateMock);
      expect(returnValue).toBeInstanceOf(Promise);
    });

    describe('the promise', () => {
      let promise;

      beforeEach(() => {
        promise = returnedFunction(dispatchMock, getStateMock);
      });

      it('dispathes an action of type ESTIMATE_FEE_SUCCESS with the estimated fee', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: ESTIMATE_FEE_SUCCESS,
            satoshisPerByte: 123 // The fee is mocked at the top of this file.
          });
        });
      });
    });

    describe('when the function fails', () => {
      let promise;

      beforeEach(() => {
        // Make the function fail by returning a rejected promise from api.estimateFee().
        api.estimateFee.mockImplementationOnce(() => new Promise.reject(
          new Error('d13970f1-0fa5-4156-8470-643629859248')
        ));

        promise = estimateFee()(dispatchMock, getStateMock);
      });

      it('rejects the returned promise', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('d13970f1-0fa5-4156-8470-643629859248');
        });
      });

      it('dispathes an action of type ESTIMATE_FEE_FAILURE with the error', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();

          expect(dispatchMock).toHaveBeenCalledWith({
            type: ESTIMATE_FEE_FAILURE,
            error
          });
        });
      });
    });
  });
});
