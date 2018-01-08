import { updateAddress, UPDATE_ADDRESS_REQUEST, UPDATE_ADDRESS_SUCCESS, UPDATE_ADDRESS_FAILURE } from '../../../src/actions/updateAddress';

const dispatchMock = jest.fn();

describe('UPDATE_ADDRESS_REQUEST', () => {
  it('equals "UPDATE_ADDRESS_REQUEST"', () => {
    expect(UPDATE_ADDRESS_REQUEST).toBe('UPDATE_ADDRESS_REQUEST');
  });
});

describe('UPDATE_ADDRESS_SUCCESS', () => {
  it('equals "UPDATE_ADDRESS_SUCCESS"', () => {
    expect(UPDATE_ADDRESS_SUCCESS).toBe('UPDATE_ADDRESS_SUCCESS');
  });
});

describe('UPDATE_ADDRESS_FAILURE', () => {
  it('equals "UPDATE_ADDRESS_FAILURE"', () => {
    expect(UPDATE_ADDRESS_FAILURE).toBe('UPDATE_ADDRESS_FAILURE');
  });
});

describe('updateAddress', () => {
  let fakeAddress;

  beforeEach(() => {
    fakeAddress = {
      id: 'dbd8425b-7f9a-4353-b1d8-62e13fdb3740'
    };
  });

  it('is a function', () => {
    expect(typeof updateAddress).toBe('function');
  });

  it('accepts one argument', () => {
    expect(updateAddress.length).toBe(1);
  });

  it('returns a function', () => {
    const returnValue = updateAddress(fakeAddress);
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = updateAddress(fakeAddress);
    });

    it('dispathes an action of type UPDATE_ADDRESS_REQUEST', () => {
      returnedFunction(dispatchMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: UPDATE_ADDRESS_REQUEST
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

      it('dispathes an action of type UPDATE_ADDRESS_SUCCESS with the address', () => {
        expect.hasAssertions();

        return promise.then((address) => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: UPDATE_ADDRESS_SUCCESS,
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
      promise = updateAddress(fakeAddress)(dispatchMock);
    });

    it('rejects the returned promise', () => {
      expect.hasAssertions();

      return promise.catch((error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe('Unknown address.');
      });
    });

    it('dispathes an action of type UPDATE_ADDRESS_FAILURE with the error', () => {
      expect.hasAssertions();

      return promise.catch((error) => {
        expect(error).toBeTruthy();

        expect(dispatchMock).toHaveBeenCalledWith({
          type: UPDATE_ADDRESS_FAILURE,
          error
        });
      });
    });
  });

  describe('when address is undefined', () => {
    let promise;

    beforeEach(() => {
      fakeAddress = undefined;
      promise = updateAddress(fakeAddress)(dispatchMock);
    });

    it('rejects the returned promise', () => {
      expect.hasAssertions();

      return promise.catch((error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe('Unknown address.');
      });
    });

    it('dispathes an action of type UPDATE_ADDRESS_FAILURE with the error', () => {
      expect.hasAssertions();

      return promise.catch((error) => {
        expect(error).toBeTruthy();

        expect(dispatchMock).toHaveBeenCalledWith({
          type: UPDATE_ADDRESS_FAILURE,
          error
        });
      });
    });
  });
});
