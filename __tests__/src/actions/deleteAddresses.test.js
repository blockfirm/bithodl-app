import { AsyncStorage } from 'react-native';
import { deleteAddresses, DELETE_ADDRESSES_REQUEST, DELETE_ADDRESSES_SUCCESS, DELETE_ADDRESSES_FAILURE } from '../../../src/actions/deleteAddresses';

const STORAGE_ADDRESSES_KEY = '@Addresses';
const dispatchMock = jest.fn();

jest.mock('react-native', () => ({
  AsyncStorage: {
    removeItem: jest.fn(() => Promise.resolve())
  }
}));

describe('DELETE_ADDRESSES_REQUEST', () => {
  it('equals "DELETE_ADDRESSES_REQUEST"', () => {
    expect(DELETE_ADDRESSES_REQUEST).toBe('DELETE_ADDRESSES_REQUEST');
  });
});

describe('DELETE_ADDRESSES_SUCCESS', () => {
  it('equals "DELETE_ADDRESSES_SUCCESS"', () => {
    expect(DELETE_ADDRESSES_SUCCESS).toBe('DELETE_ADDRESSES_SUCCESS');
  });
});

describe('DELETE_ADDRESSES_FAILURE', () => {
  it('equals "DELETE_ADDRESSES_FAILURE"', () => {
    expect(DELETE_ADDRESSES_FAILURE).toBe('DELETE_ADDRESSES_FAILURE');
  });
});

describe('deleteAddresses', () => {
  beforeEach(() => {
    AsyncStorage.removeItem.mockClear();
  });

  it('is a function', () => {
    expect(typeof deleteAddresses).toBe('function');
  });

  it('accepts no arguments', () => {
    expect(deleteAddresses.length).toBe(0);
  });

  it('returns a function', () => {
    const returnValue = deleteAddresses();
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = deleteAddresses();
    });

    it('dispathes an action of type DELETE_ADDRESSES_REQUEST', () => {
      returnedFunction(dispatchMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: DELETE_ADDRESSES_REQUEST
      });
    });

    it('removes the addresses from AsyncStorage"', () => {
      expect.hasAssertions();

      return returnedFunction(dispatchMock).then(() => {
        expect(AsyncStorage.removeItem).toHaveBeenCalledTimes(1);
        expect(AsyncStorage.removeItem).toHaveBeenCalledWith(STORAGE_ADDRESSES_KEY);
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

      it('dispathes an action of type DELETE_ADDRESSES_SUCCESS', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: DELETE_ADDRESSES_SUCCESS
          });
        });
      });
    });

    describe('when the function fails', () => {
      let promise;

      beforeEach(() => {
        // Make the function fail by returning a rejected promise from AsyncStorage.removeItem().
        AsyncStorage.removeItem.mockImplementationOnce(() => new Promise.reject(
          new Error('adce6e18-117e-40e6-9842-ec2840356b0d')
        ));

        promise = deleteAddresses()(dispatchMock);
      });

      it('rejects the returned promise', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('adce6e18-117e-40e6-9842-ec2840356b0d');
        });
      });

      it('dispathes an action of type DELETE_ADDRESSES_FAILURE with the error', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();

          expect(dispatchMock).toHaveBeenCalledWith({
            type: DELETE_ADDRESSES_FAILURE,
            error
          });
        });
      });
    });
  });
});
