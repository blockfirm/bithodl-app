import { readAddresses } from '../../../src/actions/readAddresses';
import { writeAddresses } from '../../../src/actions/writeAddresses';
import { syncAddress } from '../../../src/actions/syncAddress';
import { syncAddresses, SYNC_ADDRESSES_REQUEST, SYNC_ADDRESSES_SUCCESS, SYNC_ADDRESSES_FAILURE } from '../../../src/actions/syncAddresses';

const dispatchMock = jest.fn((action) => {
  if (typeof action === 'function') {
    return action(jest.fn());
  }

  return action;
});

jest.mock('../../../src/actions/readAddresses', () => ({
  readAddresses: jest.fn(() => Promise.resolve({
    '98e5e2c5-b349-477a-8c31-6d67be0e41ef': {
      id: '98e5e2c5-b349-477a-8c31-6d67be0e41ef',
      utxo: {}
    },
    '6df6ab22-72dd-40d6-a168-9d5f0ebf7dec': {
      id: '6df6ab22-72dd-40d6-a168-9d5f0ebf7dec',
      utxo: undefined
    },
    'e15150a9-a232-4c3a-a631-c22332d2b6cc': {
      id: 'e15150a9-a232-4c3a-a631-c22332d2b6cc',
      utxo: {}
    },
    '7c49fdfb-50be-4bb2-9205-e74454a904a8': {
      id: '7c49fdfb-50be-4bb2-9205-e74454a904a8',
      utxo: undefined
    }
  }))
}));

jest.mock('../../../src/actions/writeAddresses', () => ({
  writeAddresses: jest.fn(() => Promise.resolve())
}));

jest.mock('../../../src/actions/syncAddress', () => ({
  syncAddress: jest.fn(() => Promise.resolve())
}));

describe('SYNC_ADDRESSES_REQUEST', () => {
  it('equals "SYNC_ADDRESSES_REQUEST"', () => {
    expect(SYNC_ADDRESSES_REQUEST).toBe('SYNC_ADDRESSES_REQUEST');
  });
});

describe('SYNC_ADDRESSES_SUCCESS', () => {
  it('equals "SYNC_ADDRESSES_SUCCESS"', () => {
    expect(SYNC_ADDRESSES_SUCCESS).toBe('SYNC_ADDRESSES_SUCCESS');
  });
});

describe('SYNC_ADDRESSES_FAILURE', () => {
  it('equals "SYNC_ADDRESSES_FAILURE"', () => {
    expect(SYNC_ADDRESSES_FAILURE).toBe('SYNC_ADDRESSES_FAILURE');
  });
});

describe('syncAddresses', () => {
  beforeEach(() => {
    readAddresses.mockClear();
    writeAddresses.mockClear();
    syncAddress.mockClear();
  });

  it('is a function', () => {
    expect(typeof syncAddresses).toBe('function');
  });

  it('accepts no arguments', () => {
    expect(syncAddresses.length).toBe(0);
  });

  it('returns a function', () => {
    const returnValue = syncAddresses();
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = syncAddresses();
    });

    it('dispatches an action of type SYNC_ADDRESSES_REQUEST', () => {
      returnedFunction(dispatchMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: SYNC_ADDRESSES_REQUEST
      });
    });

    it('gets all addresses using the readAddresses action', () => {
      expect.hasAssertions();

      return returnedFunction(dispatchMock).then(() => {
        expect(readAddresses).toHaveBeenCalledTimes(1);
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

      it('calls the syncAddress action for each address without an utxo', () => {
        // These addresses come from the mock of readAddresses above.
        const addressIdsWithoutUtxo = [
          '6df6ab22-72dd-40d6-a168-9d5f0ebf7dec',
          '7c49fdfb-50be-4bb2-9205-e74454a904a8'
        ];

        expect.hasAssertions();

        return promise.then(() => {
          const call1 = syncAddress.mock.calls[0];
          const call2 = syncAddress.mock.calls[1];

          expect(syncAddress).toHaveBeenCalledTimes(addressIdsWithoutUtxo.length);

          expect(call1[0]).toBeTruthy();
          expect(call1[0].id).toBe(addressIdsWithoutUtxo[0]);

          expect(call2[0]).toBeTruthy();
          expect(call2[0].id).toBe(addressIdsWithoutUtxo[1]);
        });
      });

      it('calls the writeAddresses action', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(writeAddresses).toHaveBeenCalledTimes(1);
        });
      });

      it('dispatches an action of type SYNC_ADDRESSES_SUCCESS', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: SYNC_ADDRESSES_SUCCESS
          });
        });
      });
    });

    describe('when the function fails', () => {
      let promise;

      beforeEach(() => {
        // Make the function fail by returning a rejected promise from readAddresses().
        readAddresses.mockImplementationOnce(() => new Promise.reject(
          new Error('84dcfd31-bc99-470f-8f3f-630b583217e9')
        ));

        promise = syncAddresses()(dispatchMock);
      });

      it('rejects the returned promise', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('84dcfd31-bc99-470f-8f3f-630b583217e9');
        });
      });

      it('dispatches an action of type SYNC_ADDRESSES_FAILURE with the error', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();

          expect(dispatchMock).toHaveBeenCalledWith({
            type: SYNC_ADDRESSES_FAILURE,
            error
          });
        });
      });
    });
  });
});
