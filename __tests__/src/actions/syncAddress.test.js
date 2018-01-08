import api from '../../../src/api';
import { updateAddress } from '../../../src/actions/updateAddress';
import { syncAddress, SYNC_ADDRESS_REQUEST, SYNC_ADDRESS_SUCCESS, SYNC_ADDRESS_FAILURE } from '../../../src/actions/syncAddress';

const dispatchMock = jest.fn();

const getStateMock = jest.fn(() => ({
  settings: {
    api: {
      baseUrl: '9993df9a-d809-4416-bf64-344b2debb856'
    }
  }
}));

jest.mock('../../../src/api', () => ({
  getUnspentOutputs: jest.fn(() => Promise.resolve([]))
}));

jest.mock('../../../src/actions/updateAddress', () => ({
  updateAddress: jest.fn(() => Promise.resolve())
}));

describe('SYNC_ADDRESS_REQUEST', () => {
  it('equals "SYNC_ADDRESS_REQUEST"', () => {
    expect(SYNC_ADDRESS_REQUEST).toBe('SYNC_ADDRESS_REQUEST');
  });
});

describe('SYNC_ADDRESS_SUCCESS', () => {
  it('equals "SYNC_ADDRESS_SUCCESS"', () => {
    expect(SYNC_ADDRESS_SUCCESS).toBe('SYNC_ADDRESS_SUCCESS');
  });
});

describe('SYNC_ADDRESS_FAILURE', () => {
  it('equals "SYNC_ADDRESS_FAILURE"', () => {
    expect(SYNC_ADDRESS_FAILURE).toBe('SYNC_ADDRESS_FAILURE');
  });
});

describe('syncAddress', () => {
  let fakeAddress;

  beforeEach(() => {
    fakeAddress = {
      id: '0ab222c6-d44a-429d-9c33-ec4f5f42f9e1',
      createdAt: 1512436053
    };

    api.getUnspentOutputs.mockClear();
    updateAddress.mockClear();
  });

  it('is a function', () => {
    expect(typeof syncAddress).toBe('function');
  });

  it('accepts one argument', () => {
    expect(syncAddress.length).toBe(1);
  });

  it('returns a function', () => {
    const returnValue = syncAddress(fakeAddress);
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = syncAddress(fakeAddress);
    });

    it('dispathes an action of type SYNC_ADDRESS_REQUEST', () => {
      returnedFunction(dispatchMock, getStateMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: SYNC_ADDRESS_REQUEST
      });
    });

    it('calls api.getUnspentOutputs() with the address and baseUrl from settings', () => {
      expect.hasAssertions();

      return returnedFunction(dispatchMock, getStateMock).then(() => {
        const expectedOptions = {
          baseUrl: '9993df9a-d809-4416-bf64-344b2debb856'
        };

        expect(api.getUnspentOutputs).toHaveBeenCalledTimes(1);
        expect(api.getUnspentOutputs).toHaveBeenCalledWith(fakeAddress, expectedOptions);
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

      it('dispathes an action of type SYNC_ADDRESS_SUCCESS with the address', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: SYNC_ADDRESS_SUCCESS,
            address: fakeAddress
          });
        });
      });
    });

    describe('when the function fails', () => {
      let promise;

      beforeEach(() => {
        // Make the function fail by returning a rejected promise from api.getUnspentOutputs().
        api.getUnspentOutputs.mockImplementationOnce(() => new Promise.reject(
          new Error('c8b3f390-1991-4402-9a9c-a5680457370a')
        ));

        promise = syncAddress()(dispatchMock, getStateMock);
      });

      it('rejects the returned promise', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('c8b3f390-1991-4402-9a9c-a5680457370a');
        });
      });

      it('dispathes an action of type SYNC_ADDRESS_FAILURE with the error', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();

          expect(dispatchMock).toHaveBeenCalledWith({
            type: SYNC_ADDRESS_FAILURE,
            error
          });
        });
      });
    });
  });

  describe('when the result from api.getUnspentOutputs() is an empty array', () => {
    it('it resolves the promise with the passed address', () => {
      expect.hasAssertions();

      return syncAddress(fakeAddress)(dispatchMock, getStateMock).then((address) => {
        expect(address).toBe(fakeAddress);
      });
    });
  });

  describe('when the result from api.getUnspentOutputs() doesn\'t contain any new utxos', () => {
    beforeEach(() => {
      api.getUnspentOutputs.mockImplementationOnce(() => new Promise.resolve(
        [
          { blockTimestamp: fakeAddress.createdAt - 1 }
        ]
      ));
    });

    it('it resolves the promise with the passed address', () => {
      expect.hasAssertions();

      return syncAddress(fakeAddress)(dispatchMock, getStateMock).then((address) => {
        expect(address).toBe(fakeAddress);
      });
    });
  });

  describe('when the result from api.getUnspentOutputs() contains a new utxo', () => {
    let resolvedAddress;

    beforeEach(() => {
      api.getUnspentOutputs.mockImplementationOnce(() => new Promise.resolve(
        [
          {
            blockTimestamp: fakeAddress.createdAt + 1,
            satoshis: 2638,
            txid: 'c7172ad0-aef3-4c51-ad04-be2ca97d52cc',
            outputIndex: 3
          }
        ]
      ));

      return syncAddress(fakeAddress)(dispatchMock, getStateMock).then((address) => {
        resolvedAddress = address;
      });
    });

    it('updates the address using the updateAddress action', () => {
      expect(updateAddress).toHaveBeenCalledTimes(1);
      expect(updateAddress).toHaveBeenCalledWith(fakeAddress);
    });

    describe('the resolved address', () => {
      it('is the same as the passed address', () => {
        expect(resolvedAddress).toBe(fakeAddress);
      });

      it('has "amount" set to "satoshis" from the utxo', () => {
        expect(resolvedAddress.amount).toBe(2638);
      });

      it('has "utxo" set to an object containing "txid" and "outputIndex" from the utxo', () => {
        const utxo = resolvedAddress.utxo;

        // These values are coming from the mock implementation in the beforeEach().
        expect(utxo).toBeTruthy();
        expect(utxo.txid).toBe('c7172ad0-aef3-4c51-ad04-be2ca97d52cc');
        expect(utxo.outputIndex).toBe(3);
      });
    });
  });
});
