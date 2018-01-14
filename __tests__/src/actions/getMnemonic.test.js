import * as Keychain from 'react-native-keychain';
import Mnemonic from 'bitcore-mnemonic';
import { getMnemonic, GET_MNEMONIC_REQUEST, GET_MNEMONIC_SUCCESS, GET_MNEMONIC_FAILURE } from '../../../src/actions/getMnemonic';

const KEYCHAIN_SERVICE_NAME = 'bithodl';
const dispatchMock = jest.fn();

describe('GET_MNEMONIC_REQUEST', () => {
  it('equals "GET_MNEMONIC_REQUEST"', () => {
    expect(GET_MNEMONIC_REQUEST).toBe('GET_MNEMONIC_REQUEST');
  });
});

describe('GET_MNEMONIC_SUCCESS', () => {
  it('equals "GET_MNEMONIC_SUCCESS"', () => {
    expect(GET_MNEMONIC_SUCCESS).toBe('GET_MNEMONIC_SUCCESS');
  });
});

describe('GET_MNEMONIC_FAILURE', () => {
  it('equals "GET_MNEMONIC_FAILURE"', () => {
    expect(GET_MNEMONIC_FAILURE).toBe('GET_MNEMONIC_FAILURE');
  });
});

describe('getMnemonic', () => {
  beforeEach(() => {
    Keychain.getGenericPassword.mockClear();
  });

  it('is a function', () => {
    expect(typeof getMnemonic).toBe('function');
  });

  it('accepts no arguments', () => {
    expect(getMnemonic.length).toBe(0);
  });

  it('returns a function', () => {
    const returnValue = getMnemonic();
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = getMnemonic();
    });

    it('dispathes an action of type GET_MNEMONIC_REQUEST', () => {
      returnedFunction(dispatchMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: GET_MNEMONIC_REQUEST
      });
    });

    it('gets the mnemonic from the Keychain', () => {
      expect.hasAssertions();

      return returnedFunction(dispatchMock).then(() => {
        expect(Keychain.getGenericPassword).toHaveBeenCalledTimes(1);
        expect(Keychain.getGenericPassword).toHaveBeenCalledWith(KEYCHAIN_SERVICE_NAME);
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

      it('dispathes an action of type GET_MNEMONIC_SUCCESS', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: GET_MNEMONIC_SUCCESS
          });
        });
      });

      it('resolves to a Mnemonic containing the password from the Keychain', () => {
        expect.hasAssertions();

        return promise.then((mnemonic) => {
          expect(mnemonic).toBeTruthy();
          expect(mnemonic).toBeInstanceOf(Mnemonic);
          expect(mnemonic.toString()).toBe(Keychain.FAKE_PASSWORD);
        });
      });
    });

    describe('when the function fails', () => {
      let promise;

      beforeEach(() => {
        // Make the function fail by returning a rejected promise from Keychain.getGenericPassword().
        Keychain.getGenericPassword.mockImplementationOnce(() => new Promise.reject(
          new Error('c9b2b465-8697-43c3-9b70-a93bed92994d')
        ));

        promise = getMnemonic()(dispatchMock);
      });

      it('rejects the returned promise', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('c9b2b465-8697-43c3-9b70-a93bed92994d');
        });
      });

      it('dispathes an action of type GET_MNEMONIC_FAILURE with the error', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();

          expect(dispatchMock).toHaveBeenCalledWith({
            type: GET_MNEMONIC_FAILURE,
            error
          });
        });
      });
    });
  });
});
