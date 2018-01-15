import { AsyncStorage } from 'react-native';
import * as Keychain from 'react-native-keychain';
import { deleteWallet, DELETE_WALLET_REQUEST, DELETE_WALLET_SUCCESS, DELETE_WALLET_FAILURE } from '../../../src/actions/deleteWallet';

const KEYCHAIN_SERVICE_NAME = 'bithodl';
const STORAGE_WALLET_KEY = '@Wallet';
const dispatchMock = jest.fn();

jest.mock('react-native', () => ({
  AsyncStorage: {
    removeItem: jest.fn(() => Promise.resolve())
  }
}));

describe('DELETE_WALLET_REQUEST', () => {
  it('equals "DELETE_WALLET_REQUEST"', () => {
    expect(DELETE_WALLET_REQUEST).toBe('DELETE_WALLET_REQUEST');
  });
});

describe('DELETE_WALLET_SUCCESS', () => {
  it('equals "DELETE_WALLET_SUCCESS"', () => {
    expect(DELETE_WALLET_SUCCESS).toBe('DELETE_WALLET_SUCCESS');
  });
});

describe('DELETE_WALLET_FAILURE', () => {
  it('equals "DELETE_WALLET_FAILURE"', () => {
    expect(DELETE_WALLET_FAILURE).toBe('DELETE_WALLET_FAILURE');
  });
});

describe('deleteWallet', () => {
  beforeEach(() => {
    AsyncStorage.removeItem.mockClear();
    Keychain.resetGenericPassword.mockClear();
  });

  it('is a function', () => {
    expect(typeof deleteWallet).toBe('function');
  });

  it('accepts no arguments', () => {
    expect(deleteWallet.length).toBe(0);
  });

  it('returns a function', () => {
    const returnValue = deleteWallet();
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = deleteWallet();
    });

    it('dispatches an action of type DELETE_WALLET_REQUEST', () => {
      returnedFunction(dispatchMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: DELETE_WALLET_REQUEST
      });
    });

    it('removes the private key from the Keychain', () => {
      expect.hasAssertions();

      return returnedFunction(dispatchMock).then(() => {
        expect(Keychain.resetGenericPassword).toHaveBeenCalledTimes(1);
        expect(Keychain.resetGenericPassword).toHaveBeenCalledWith(KEYCHAIN_SERVICE_NAME);
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

      it('removes the wallet metadata from AsyncStorage', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(AsyncStorage.removeItem).toHaveBeenCalledTimes(1);
          expect(AsyncStorage.removeItem).toHaveBeenCalledWith(STORAGE_WALLET_KEY);
        });
      });

      it('dispatches an action of type DELETE_WALLET_SUCCESS', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: DELETE_WALLET_SUCCESS
          });
        });
      });
    });

    describe('when the function fails', () => {
      let promise;

      beforeEach(() => {
        // Make the function fail by returning a rejected promise from Keychain.resetGenericPassword().
        Keychain.resetGenericPassword.mockImplementationOnce(() => new Promise.reject(
          new Error('660dc3bd-965a-421d-a801-4f62abe8ed76')
        ));

        promise = deleteWallet()(dispatchMock);
      });

      it('rejects the returned promise', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('660dc3bd-965a-421d-a801-4f62abe8ed76');
        });
      });

      it('dispatches an action of type DELETE_WALLET_FAILURE with the error', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();

          expect(dispatchMock).toHaveBeenCalledWith({
            type: DELETE_WALLET_FAILURE,
            error
          });
        });
      });
    });
  });
});
