import api from '../../../src/api';
import createSpendTransaction from '../../../src/bitcoin/createSpendTransaction';
import { createTransaction, CREATE_TRANSACTION_REQUEST, CREATE_TRANSACTION_SUCCESS, CREATE_TRANSACTION_FAILURE } from '../../../src/actions/createTransaction';

const dispatchMock = jest.fn((action) => {
  const getStateMock = jest.fn(() => ({
    settings: {
      bitcoin: {
        fee: {
          level: 'Normal',
          satoshisPerByte: 100
        }
      },
      api: {
        baseUrl: '05f0ca9b-e96d-470a-9c46-04b356d56f79'
      }
    }
  }));

  if (typeof action === 'function') {
    return action(jest.fn(), getStateMock);
  }

  return action;
});

jest.mock('../../../src/api', () => ({
  estimateFee: jest.fn(() => Promise.resolve(20))
}));

jest.mock('../../../src/bitcoin/createSpendTransaction', () => {
  return jest.fn(() => ({
    toBuffer: () => Buffer.from('f85687f6-0387-4fb2-8897-84e3e3680103'),
    toString: () => 'f85687f6-0387-4fb2-8897-84e3e3680103'
  }));
});

describe('CREATE_TRANSACTION_REQUEST', () => {
  it('equals "CREATE_TRANSACTION_REQUEST"', () => {
    expect(CREATE_TRANSACTION_REQUEST).toBe('CREATE_TRANSACTION_REQUEST');
  });
});

describe('CREATE_TRANSACTION_SUCCESS', () => {
  it('equals "CREATE_TRANSACTION_SUCCESS"', () => {
    expect(CREATE_TRANSACTION_SUCCESS).toBe('CREATE_TRANSACTION_SUCCESS');
  });
});

describe('CREATE_TRANSACTION_FAILURE', () => {
  it('equals "CREATE_TRANSACTION_FAILURE"', () => {
    expect(CREATE_TRANSACTION_FAILURE).toBe('CREATE_TRANSACTION_FAILURE');
  });
});

describe('createTransaction', () => {
  let fakeFromAddress;
  let fakeToAddressHash;

  beforeEach(() => {
    fakeFromAddress = { id: '722ed074-c7bb-49d8-956c-c4c84d1ea469' };
    fakeToAddressHash = '9842443e-ef3c-477f-a483-09fbed837d97';

    createSpendTransaction.mockClear();
  });

  it('is a function', () => {
    expect(typeof createTransaction).toBe('function');
  });

  it('accepts two argument', () => {
    expect(createTransaction.length).toBe(2);
  });

  it('returns a function', () => {
    const returnValue = createTransaction(fakeFromAddress, fakeToAddressHash);
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = createTransaction(fakeFromAddress, fakeToAddressHash);
    });

    it('dispatches an action of type CREATE_TRANSACTION_REQUEST', () => {
      returnedFunction(dispatchMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: CREATE_TRANSACTION_REQUEST
      });
    });

    it('returns a Promise', () => {
      const returnValue = returnedFunction(dispatchMock);
      expect(returnValue).toBeInstanceOf(Promise);
    });

    describe('the promise', () => {
      let promise;

      beforeEach(() => {
        promise = returnedFunction(dispatchMock);
      });

      it('dispatches an action of type CREATE_TRANSACTION_SUCCESS with the transaction', () => {
        expect.hasAssertions();

        return promise.then((transaction) => {
          expect(transaction).toBeTruthy();

          expect(dispatchMock).toHaveBeenCalledWith({
            type: CREATE_TRANSACTION_SUCCESS,
            transaction
          });
        });
      });

      describe('the resolved value', () => {
        let newTransaction;

        beforeEach(() => {
          return promise.then((transaction) => {
            newTransaction = transaction;
          });
        });

        it('is the repsonse from createSpendTransaction()', () => {
          expect(newTransaction.toString()).toBe('f85687f6-0387-4fb2-8897-84e3e3680103');
        });
      });
    });

    describe('when the fee is larger than the amount', () => {
      let promise;

      beforeEach(() => {
        // Make the fee larger by returning a fee of 3000 satoshis per byte from estimateFee().
        api.estimateFee.mockImplementationOnce(jest.fn(() => Promise.resolve(3000)));

        // Set the amount to 3000 satoshis.
        fakeFromAddress.amount = 3000;

        promise = createTransaction(fakeFromAddress, fakeToAddressHash)(dispatchMock);
      });

      it('rejects the returned promise', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();
        });
      });
    });

    describe('when the function fails', () => {
      let promise;

      beforeEach(() => {
        // Make the function fail by throwing an error in createSpendTransaction().
        createSpendTransaction.mockImplementationOnce(() => {
          throw new Error('56209de0-f899-4949-924d-b95d4cf2d0cc');
        });

        promise = createTransaction(fakeFromAddress, fakeToAddressHash)(dispatchMock);
      });

      it('rejects the returned promise', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('56209de0-f899-4949-924d-b95d4cf2d0cc');
        });
      });

      it('dispatches an action of type CREATE_TRANSACTION_FAILURE with the error', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();

          expect(dispatchMock).toHaveBeenCalledWith({
            type: CREATE_TRANSACTION_FAILURE,
            error
          });
        });
      });
    });
  });
});
