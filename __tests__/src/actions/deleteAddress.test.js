import { deleteAddress, DELETE_ADDRESS_REQUEST, DELETE_ADDRESS_SUCCESS, DELETE_ADDRESS_FAILURE } from '../../../src/actions/deleteAddress';

const dispatchMock = jest.fn();

describe('DELETE_ADDRESS_REQUEST', () => {
  it('equals "DELETE_ADDRESS_REQUEST"', () => {
    expect(DELETE_ADDRESS_REQUEST).toBe('DELETE_ADDRESS_REQUEST');
  });
});

describe('DELETE_ADDRESS_SUCCESS', () => {
  it('equals "DELETE_ADDRESS_SUCCESS"', () => {
    expect(DELETE_ADDRESS_SUCCESS).toBe('DELETE_ADDRESS_SUCCESS');
  });
});

describe('DELETE_ADDRESS_FAILURE', () => {
  it('equals "DELETE_ADDRESS_FAILURE"', () => {
    expect(DELETE_ADDRESS_FAILURE).toBe('DELETE_ADDRESS_FAILURE');
  });
});

describe('deleteAddress', () => {
  let fakeAddress;

  beforeEach(() => {
    fakeAddress = {
      id: 'c8cb001e-269f-42b9-9df2-1ea1e8014768'
    };
  });

  it('is a function', () => {
    expect(typeof deleteAddress).toBe('function');
  });

  it('accepts one argument', () => {
    expect(deleteAddress.length).toBe(1);
  });

  it('returns a function', () => {
    const returnValue = deleteAddress(fakeAddress);
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = deleteAddress(fakeAddress);
    });

    it('dispatches an action of type DELETE_ADDRESS_REQUEST', () => {
      returnedFunction(dispatchMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: DELETE_ADDRESS_REQUEST
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

      it('dispatches an action of type DELETE_ADDRESS_SUCCESS with the address', () => {
        expect.hasAssertions();

        return promise.then((address) => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: DELETE_ADDRESS_SUCCESS,
            address
          });
        });
      });

      it('resolves to the passed address', () => {
        expect.hasAssertions();

        return promise.then((address) => {
          expect(address).toBe(fakeAddress);
        });
      });
    });
  });

  describe('when address.id is undefined', () => {
    let promise;

    beforeEach(() => {
      fakeAddress.id = undefined;
      promise = deleteAddress(fakeAddress)(dispatchMock);
    });

    it('rejects the returned promise', () => {
      expect.hasAssertions();

      return promise.catch((error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe('Unknown address.');
      });
    });

    it('dispatches an action of type DELETE_ADDRESS_FAILURE with the error', () => {
      expect.hasAssertions();

      return promise.catch((error) => {
        expect(error).toBeTruthy();

        expect(dispatchMock).toHaveBeenCalledWith({
          type: DELETE_ADDRESS_FAILURE,
          error
        });
      });
    });
  });

  describe('when address is undefined', () => {
    let promise;

    beforeEach(() => {
      fakeAddress = undefined;
      promise = deleteAddress(fakeAddress)(dispatchMock);
    });

    it('rejects the returned promise', () => {
      expect.hasAssertions();

      return promise.catch((error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe('Unknown address.');
      });
    });

    it('dispatches an action of type DELETE_ADDRESS_FAILURE with the error', () => {
      expect.hasAssertions();

      return promise.catch((error) => {
        expect(error).toBeTruthy();

        expect(dispatchMock).toHaveBeenCalledWith({
          type: DELETE_ADDRESS_FAILURE,
          error
        });
      });
    });
  });
});
