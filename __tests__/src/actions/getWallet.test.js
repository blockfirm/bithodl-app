import { AsyncStorage } from 'react-native';
import { getWallet, GET_WALLET_REQUEST, GET_WALLET_SUCCESS, GET_WALLET_FAILURE } from '../../../src/actions/getWallet';

const STORAGE_WALLET_KEY = '@Wallet';
const dispatchMock = jest.fn();

jest.mock('react-native', () => ({
  AsyncStorage: {
    getItem: jest.fn(() => Promise.resolve(
      '{ "createdAt": 1511989140, "publicKey": "02e992fb85479eb7850324a0fd5421d17191654ca2e0645629dfd229f41cd4b98f" }'
    ))
  }
}));

describe('GET_WALLET_REQUEST', () => {
  it('equals "GET_WALLET_REQUEST"', () => {
    expect(GET_WALLET_REQUEST).toBe('GET_WALLET_REQUEST');
  });
});

describe('GET_WALLET_SUCCESS', () => {
  it('equals "GET_WALLET_SUCCESS"', () => {
    expect(GET_WALLET_SUCCESS).toBe('GET_WALLET_SUCCESS');
  });
});

describe('GET_WALLET_FAILURE', () => {
  it('equals "GET_WALLET_FAILURE"', () => {
    expect(GET_WALLET_FAILURE).toBe('GET_WALLET_FAILURE');
  });
});

describe('getWallet', () => {
  beforeEach(() => {
    AsyncStorage.getItem.mockClear();
  });

  it('is a function', () => {
    expect(typeof getWallet).toBe('function');
  });

  it('accepts no arguments', () => {
    expect(getWallet.length).toBe(0);
  });

  it('returns a function', () => {
    const returnValue = getWallet();
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = getWallet();
    });

    it('dispatches an action of type GET_WALLET_REQUEST', () => {
      returnedFunction(dispatchMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: GET_WALLET_REQUEST
      });
    });

    it('gets the wallet from AsyncStorage', () => {
      expect.hasAssertions();

      return returnedFunction(dispatchMock).then(() => {
        expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
        expect(AsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_WALLET_KEY);
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

      it('dispatches an action of type GET_WALLET_SUCCESS with metadata about the wallet', () => {
        expect.hasAssertions();

        return promise.then((metadata) => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: GET_WALLET_SUCCESS,
            metadata
          });
        });
      });

      describe('the resolved value (wallet)', () => {
        let wallet;

        beforeEach(() => {
          return promise.then((result) => {
            wallet = result;
          });
        });

        it('is an object', () => {
          expect(typeof wallet).toBe('object');
          expect(wallet).toBeTruthy();
        });

        it('has "createdAt" set to a date', () => {
          // The date is returned from the mocked AsyncStorage.getItem() as JSON.
          const expectedDateString = new Date(1511989140).toString();
          const actualDateString = wallet.createdAt.toString();

          expect(actualDateString).toBe(expectedDateString);
        });

        it('has "publicKey" set to a public key', () => {
          const expectedPublicKey = '02e992fb85479eb7850324a0fd5421d17191654ca2e0645629dfd229f41cd4b98f';
          const actualPublicKey = wallet.publicKey.toString();

          // The public key is returned from the mocked AsyncStorage.getItem() as JSON.
          expect(typeof wallet.publicKey).toBe('object');
          expect(actualPublicKey).toBe(expectedPublicKey);
        });
      });
    });

    describe('when the function fails', () => {
      let promise;

      beforeEach(() => {
        // Make the function fail by returning a rejected promise from AsyncStorage.getItem().
        AsyncStorage.getItem.mockImplementationOnce(() => new Promise.reject(
          new Error('1597d8c4-d51b-4bdc-a272-447e651d596a')
        ));

        promise = getWallet()(dispatchMock);
      });

      it('rejects the returned promise', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('1597d8c4-d51b-4bdc-a272-447e651d596a');
        });
      });

      it('dispatches an action of type DELETE_WALLET_FAILURE with the error', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();

          expect(dispatchMock).toHaveBeenCalledWith({
            type: GET_WALLET_FAILURE,
            error
          });
        });
      });
    });
  });
});
