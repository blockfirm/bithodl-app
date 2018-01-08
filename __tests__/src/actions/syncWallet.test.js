import api from '../../../src/api';
import verifyLockedAddress from '../../../src/bitcoin/verifyLockedAddress';
import { getWallet } from '../../../src/actions/getWallet';
import { addAddress } from '../../../src/actions/addAddress';
import { deleteAddresses } from '../../../src/actions/deleteAddresses';
import { writeAddresses } from '../../../src/actions/writeAddresses';
import { syncWallet, SYNC_WALLET_REQUEST, SYNC_WALLET_SUCCESS, SYNC_WALLET_FAILURE } from '../../../src/actions/syncWallet';

const dispatchMock = jest.fn((action) => {
  if (typeof action === 'function') {
    return action(jest.fn());
  }

  return action;
});

const getStateMock = jest.fn(() => ({
  settings: {
    api: {
      baseUrl: '2155d0a7-d2c2-43b2-8e5b-7c2a5479704b'
    }
  }
}));

jest.mock('../../../src/api', () => ({
  getAddresses: jest.fn(() => Promise.resolve([
    { hash: '14841d06-6c65-4d85-81ca-80b95f7fb596', utxo: {} },
    { hash: '1dac4d85-12b5-4f8b-8a92-1456f1b6d1f3', utxo: {} },
    { hash: '5cf87a40-b51a-4bf9-80a6-5d7187447421', utxo: {} }
  ]))
}));

jest.mock('../../../src/bitcoin/verifyLockedAddress', () => jest.fn(() => true));

jest.mock('../../../src/actions/getWallet', () => ({
  getWallet: jest.fn(() => Promise.resolve({
    publicKey: {
      toString: () => '0072d4bd-67b8-4ba6-a749-a3487a2cd4d2'
    }
  }))
}));

jest.mock('../../../src/actions/addAddress', () => ({
  addAddress: jest.fn(() => Promise.resolve())
}));

jest.mock('../../../src/actions/deleteAddresses', () => ({
  deleteAddresses: jest.fn(() => Promise.resolve())
}));

jest.mock('../../../src/actions/writeAddresses', () => ({
  writeAddresses: jest.fn(() => Promise.resolve())
}));

describe('SYNC_WALLET_REQUEST', () => {
  it('equals "SYNC_WALLET_REQUEST"', () => {
    expect(SYNC_WALLET_REQUEST).toBe('SYNC_WALLET_REQUEST');
  });
});

describe('SYNC_WALLET_SUCCESS', () => {
  it('equals "SYNC_WALLET_SUCCESS"', () => {
    expect(SYNC_WALLET_SUCCESS).toBe('SYNC_WALLET_SUCCESS');
  });
});

describe('SYNC_WALLET_FAILURE', () => {
  it('equals "SYNC_WALLET_FAILURE"', () => {
    expect(SYNC_WALLET_FAILURE).toBe('SYNC_WALLET_FAILURE');
  });
});

describe('syncWallet', () => {
  beforeEach(() => {
    api.getAddresses.mockClear();
    verifyLockedAddress.mockClear();
    getWallet.mockClear();
    addAddress.mockClear();
    deleteAddresses.mockClear();
    writeAddresses.mockClear();
  });

  it('is a function', () => {
    expect(typeof syncWallet).toBe('function');
  });

  it('accepts no arguments', () => {
    expect(syncWallet.length).toBe(0);
  });

  it('returns a function', () => {
    const returnValue = syncWallet();
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = syncWallet();
    });

    it('dispathes an action of type SYNC_WALLET_REQUEST', () => {
      returnedFunction(dispatchMock, getStateMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: SYNC_WALLET_REQUEST
      });
    });

    it('gets the wallet using the getWallet action', () => {
      expect.hasAssertions();

      return returnedFunction(dispatchMock, getStateMock).then(() => {
        expect(getWallet).toHaveBeenCalledTimes(1);
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

      it('finds all addresses using api.getAddresses() with the public key from the wallet', () => {
        expect.hasAssertions();

        return promise.then(() => {
          const actualPublicKey = api.getAddresses.mock.calls[0][0].toString();
          const expectedPublicKey = '0072d4bd-67b8-4ba6-a749-a3487a2cd4d2';

          expect(api.getAddresses).toHaveBeenCalledTimes(1);
          expect(actualPublicKey).toBe(expectedPublicKey);
        });
      });

      it('uses the baseUrl from settings', () => {
        expect.hasAssertions();

        return promise.then(() => {
          const actualOptions = api.getAddresses.mock.calls[0][1];

          const expectedOptions = {
            baseUrl: '2155d0a7-d2c2-43b2-8e5b-7c2a5479704b'
          };

          expect(actualOptions).toMatchObject(expectedOptions);
        });
      });

      it('verifies each address using verifyLockedAddress() with the public key', () => {
        expect.hasAssertions();

        return promise.then(() => {
          const address1 = verifyLockedAddress.mock.calls[0][0];
          const address2 = verifyLockedAddress.mock.calls[1][0];
          const address3 = verifyLockedAddress.mock.calls[2][0];

          // These addresses come from the mock of api.getAddresses above.
          expect(verifyLockedAddress).toHaveBeenCalledTimes(3);
          expect(address1.hash).toBe('14841d06-6c65-4d85-81ca-80b95f7fb596');
          expect(address2.hash).toBe('1dac4d85-12b5-4f8b-8a92-1456f1b6d1f3');
          expect(address3.hash).toBe('5cf87a40-b51a-4bf9-80a6-5d7187447421');
        });
      });

      it('calls the deleteAddresses action', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(deleteAddresses).toHaveBeenCalledTimes(1);
        });
      });

      it('calls the addAddress action with each address', () => {
        expect.hasAssertions();

        return promise.then(() => {
          const address1 = addAddress.mock.calls[0][0];
          const address2 = addAddress.mock.calls[1][0];
          const address3 = addAddress.mock.calls[2][0];

          // These addresses come from the mock of api.getAddresses above.
          expect(addAddress).toHaveBeenCalledTimes(3);
          expect(address1.hash).toBe('14841d06-6c65-4d85-81ca-80b95f7fb596');
          expect(address2.hash).toBe('1dac4d85-12b5-4f8b-8a92-1456f1b6d1f3');
          expect(address3.hash).toBe('5cf87a40-b51a-4bf9-80a6-5d7187447421');
        });
      });

      it('dispathes an action of type SYNC_WALLET_SUCCESS', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: SYNC_WALLET_SUCCESS
          });
        });
      });

      describe('when there is an invalid address in the result', () => {
        it('rejects the promise', () => {
          verifyLockedAddress.mockReturnValueOnce(false);
          expect.hasAssertions();

          return syncWallet()(dispatchMock, getStateMock).catch((error) => {
            expect(error).toBeTruthy();
            expect(error.message).toBe('The server returned an invalid address.');
          });
        });
      });
    });

    describe('when the function fails', () => {
      let promise;

      beforeEach(() => {
        // Make the function fail by returning a rejected promise from getWallet().
        getWallet.mockImplementationOnce(() => new Promise.reject(
          new Error('3030b4d7-b350-46db-b36a-727a8602bfa9')
        ));

        promise = syncWallet()(dispatchMock, getStateMock);
      });

      it('rejects the returned promise', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('3030b4d7-b350-46db-b36a-727a8602bfa9');
        });
      });

      it('dispathes an action of type SYNC_WALLET_FAILURE with the error', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();

          expect(dispatchMock).toHaveBeenCalledWith({
            type: SYNC_WALLET_FAILURE,
            error
          });
        });
      });
    });
  });
});
