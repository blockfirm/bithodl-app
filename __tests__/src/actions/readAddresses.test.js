import { AsyncStorage } from 'react-native';
import { readAddresses, READ_ADDRESSES_REQUEST, READ_ADDRESSES_SUCCESS, READ_ADDRESSES_FAILURE } from '../../../src/actions/readAddresses';

const STORAGE_ADDRESSES_KEY = '@Addresses';
const dispatchMock = jest.fn();

jest.mock('react-native', () => ({
  AsyncStorage: {
    getItem: jest.fn(() => Promise.resolve(
      '{ "id": "204d5efa-8889-4206-aa22-2865d1b94d09" }'
    ))
  }
}));

describe('READ_ADDRESSES_REQUEST', () => {
  it('equals "READ_ADDRESSES_REQUEST"', () => {
    expect(READ_ADDRESSES_REQUEST).toBe('READ_ADDRESSES_REQUEST');
  });
});

describe('READ_ADDRESSES_SUCCESS', () => {
  it('equals "READ_ADDRESSES_SUCCESS"', () => {
    expect(READ_ADDRESSES_SUCCESS).toBe('READ_ADDRESSES_SUCCESS');
  });
});

describe('READ_ADDRESSES_FAILURE', () => {
  it('equals "READ_ADDRESSES_FAILURE"', () => {
    expect(READ_ADDRESSES_FAILURE).toBe('READ_ADDRESSES_FAILURE');
  });
});

describe('readAddresses', () => {
  beforeEach(() => {
    AsyncStorage.getItem.mockClear();
  });

  it('is a function', () => {
    expect(typeof readAddresses).toBe('function');
  });

  it('accepts no arguments', () => {
    expect(readAddresses.length).toBe(0);
  });

  it('returns a function', () => {
    const returnValue = readAddresses();
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = readAddresses();
    });

    it('dispathes an action of type READ_ADDRESSES_REQUEST', () => {
      returnedFunction(dispatchMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: READ_ADDRESSES_REQUEST
      });
    });

    it('gets the addresses from AsyncStorage', () => {
      expect.hasAssertions();

      return returnedFunction(dispatchMock).then(() => {
        expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
        expect(AsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_ADDRESSES_KEY);
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

      it('dispathes an action of type READ_ADDRESSES_SUCCESS with the addresses', () => {
        expect.hasAssertions();

        return promise.then((addresses) => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: READ_ADDRESSES_SUCCESS,
            addresses
          });
        });
      });

      describe('the resolved value', () => {
        let addresses;

        beforeEach(() => {
          return promise.then((result) => {
            addresses = result;
          });
        });

        it('is an object that is deserialized from AsyncStorage', () => {
          expect(typeof addresses).toBe('object');
          expect(addresses).toBeTruthy();

          // This value comes from the mock of AsyncStorage.getItem().
          expect(addresses.id).toBe('204d5efa-8889-4206-aa22-2865d1b94d09');
        });
      });

      describe('when there are no addresses', () => {
        it('resolves to an empty object', () => {
          expect.hasAssertions();

          // Make the AsyncStorage.getItem() mock return a promise that resolves to null.
          AsyncStorage.getItem.mockImplementationOnce(() => new Promise.resolve(null));

          return readAddresses()(dispatchMock).then((addresses) => {
            expect(addresses).toBeTruthy();
            expect(addresses).toMatchObject({});
          });
        });
      });
    });

    describe('when the function fails', () => {
      let promise;

      beforeEach(() => {
        // Make the function fail by returning a rejected promise from AsyncStorage.getItem().
        AsyncStorage.getItem.mockImplementationOnce(() => new Promise.reject(
          new Error('4df3668f-d01d-4cf1-9f2b-73036baa5d88')
        ));

        promise = readAddresses()(dispatchMock);
      });

      it('rejects the returned promise', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('4df3668f-d01d-4cf1-9f2b-73036baa5d88');
        });
      });

      it('dispathes an action of type READ_ADDRESSES_FAILURE with the error', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();

          expect(dispatchMock).toHaveBeenCalledWith({
            type: READ_ADDRESSES_FAILURE,
            error
          });
        });
      });
    });
  });
});
