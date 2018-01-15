import api from '../../../src/api';
import { sendTransaction, SEND_TRANSACTION_REQUEST, SEND_TRANSACTION_SUCCESS, SEND_TRANSACTION_FAILURE } from '../../../src/actions/sendTransaction';

const dispatchMock = jest.fn();

const getStateMock = jest.fn(() => ({
  settings: {
    api: {
      baseUrl: '2029bfb0-313f-4969-95fe-98e3d710b047'
    }
  }
}));

jest.mock('../../../src/api', () => ({
  postTransaction: jest.fn(() => Promise.resolve())
}));

describe('SEND_TRANSACTION_REQUEST', () => {
  it('equals "SEND_TRANSACTION_REQUEST"', () => {
    expect(SEND_TRANSACTION_REQUEST).toBe('SEND_TRANSACTION_REQUEST');
  });
});

describe('SEND_TRANSACTION_SUCCESS', () => {
  it('equals "SEND_TRANSACTION_SUCCESS"', () => {
    expect(SEND_TRANSACTION_SUCCESS).toBe('SEND_TRANSACTION_SUCCESS');
  });
});

describe('SEND_TRANSACTION_FAILURE', () => {
  it('equals "SEND_TRANSACTION_FAILURE"', () => {
    expect(SEND_TRANSACTION_FAILURE).toBe('SEND_TRANSACTION_FAILURE');
  });
});

describe('sendTransaction', () => {
  let fakeTransaction;

  beforeEach(() => {
    fakeTransaction = {
      txid: 'f91c6df1-140e-4efd-8dcd-4edd390dc70f'
    };

    api.postTransaction.mockClear();
  });

  it('is a function', () => {
    expect(typeof sendTransaction).toBe('function');
  });

  it('accepts one argument', () => {
    expect(sendTransaction.length).toBe(1);
  });

  it('returns a function', () => {
    const returnValue = sendTransaction(fakeTransaction);
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = sendTransaction(fakeTransaction);
    });

    it('dispatches an action of type SEND_TRANSACTION_REQUEST', () => {
      returnedFunction(dispatchMock, getStateMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: SEND_TRANSACTION_REQUEST
      });
    });

    it('posts the transaction with api.postTransaction() together with baseUrl from settings', () => {
      expect.hasAssertions();

      return returnedFunction(dispatchMock, getStateMock).then(() => {
        const expectedOptions = {
          baseUrl: '2029bfb0-313f-4969-95fe-98e3d710b047'
        };

        expect(api.postTransaction).toHaveBeenCalledTimes(1);
        expect(api.postTransaction).toHaveBeenCalledWith(fakeTransaction, expectedOptions);
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

      it('dispatches an action of type SEND_TRANSACTION_SUCCESS with the transaction', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: SEND_TRANSACTION_SUCCESS,
            transaction: fakeTransaction
          });
        });
      });
    });

    describe('when the function fails', () => {
      let promise;

      beforeEach(() => {
        // Make the function fail by returning a rejected promise from api.postTransaction().
        api.postTransaction.mockImplementationOnce(() => new Promise.reject(
          new Error('ca35dd1e-d1dd-41c7-88f3-ae4f64fd62a5')
        ));

        promise = sendTransaction()(dispatchMock, getStateMock);
      });

      it('rejects the returned promise', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('ca35dd1e-d1dd-41c7-88f3-ae4f64fd62a5');
        });
      });

      it('dispatches an action of type SEND_TRANSACTION_FAILURE with the error', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();

          expect(dispatchMock).toHaveBeenCalledWith({
            type: SEND_TRANSACTION_FAILURE,
            error
          });
        });
      });
    });
  });
});
