import { AsyncStorage } from 'react-native';
import { writeAddresses, WRITE_ADDRESSES_REQUEST, WRITE_ADDRESSES_SUCCESS, WRITE_ADDRESSES_FAILURE } from '../../../src/actions/writeAddresses';

const STORAGE_ADDRESSES_KEY = '@Addresses';

const dispatchMock = jest.fn();

const getStateMock = jest.fn(() => ({
  addresses: {
    items: {
      '1ccf00a9-ba76-4bfc-bc2e-bc05b0517b3b': {
        id: '1ccf00a9-ba76-4bfc-bc2e-bc05b0517b3b'
      },
      '11003f45-ef93-4daa-b159-94315c446397': {
        id: '11003f45-ef93-4daa-b159-94315c446397'
      }
    }
  }
}));

jest.mock('react-native', () => ({
  AsyncStorage: {
    setItem: jest.fn(() => Promise.resolve())
  }
}));

describe('WRITE_ADDRESSES_REQUEST', () => {
  it('equals "WRITE_ADDRESSES_REQUEST"', () => {
    expect(WRITE_ADDRESSES_REQUEST).toBe('WRITE_ADDRESSES_REQUEST');
  });
});

describe('WRITE_ADDRESSES_SUCCESS', () => {
  it('equals "WRITE_ADDRESSES_SUCCESS"', () => {
    expect(WRITE_ADDRESSES_SUCCESS).toBe('WRITE_ADDRESSES_SUCCESS');
  });
});

describe('WRITE_ADDRESSES_FAILURE', () => {
  it('equals "WRITE_ADDRESSES_FAILURE"', () => {
    expect(WRITE_ADDRESSES_FAILURE).toBe('WRITE_ADDRESSES_FAILURE');
  });
});

describe('writeAddresses', () => {
  beforeEach(() => {
    AsyncStorage.setItem.mockClear();
    dispatchMock.mockClear();
    getStateMock.mockClear();
  });

  it('is a function', () => {
    expect(typeof writeAddresses).toBe('function');
  });

  it('accepts no arguments', () => {
    expect(writeAddresses.length).toBe(0);
  });

  it('returns a function', () => {
    const returnValue = writeAddresses();
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = writeAddresses();
    });

    it('dispatches an action of type WRITE_ADDRESSES_REQUEST', () => {
      returnedFunction(dispatchMock, getStateMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: WRITE_ADDRESSES_REQUEST
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

      it('calls getState() to get the addresses from the state', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(getStateMock).toHaveBeenCalledTimes(1);
        });
      });

      it('serializes the addresses and saves it to AsyncStorage', () => {
        expect.hasAssertions();

        return promise.then(() => {
          const argument1 = AsyncStorage.setItem.mock.calls[0][0];
          const argument2 = AsyncStorage.setItem.mock.calls[0][1];
          const deserializedArgument2 = JSON.parse(argument2);

          expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
          expect(argument1).toBe(STORAGE_ADDRESSES_KEY);

          expect(typeof deserializedArgument2).toBe('object');
          expect(deserializedArgument2['1ccf00a9-ba76-4bfc-bc2e-bc05b0517b3b']).toBeTruthy();
          expect(deserializedArgument2['11003f45-ef93-4daa-b159-94315c446397']).toBeTruthy();
        });
      });

      it('dispatches an action of type WRITE_ADDRESSES_SUCCESS', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: WRITE_ADDRESSES_SUCCESS
          });
        });
      });
    });

    describe('when the function fails', () => {
      let promise;

      beforeEach(() => {
        // Make the function fail by returning a rejected promise from AsyncStorage.setItem().
        AsyncStorage.setItem.mockImplementationOnce(() => new Promise.reject(
          new Error('d73daa18-769b-48cc-a893-244a5507e768')
        ));

        promise = writeAddresses()(dispatchMock, getStateMock);
      });

      it('rejects the returned promise', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('d73daa18-769b-48cc-a893-244a5507e768');
        });
      });

      it('dispatches an action of type WRITE_ADDRESSES_FAILURE with the error', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();

          expect(dispatchMock).toHaveBeenCalledWith({
            type: WRITE_ADDRESSES_FAILURE,
            error
          });
        });
      });
    });
  });
});
