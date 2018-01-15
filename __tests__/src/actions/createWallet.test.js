import { AsyncStorage } from 'react-native';
import * as Keychain from 'react-native-keychain';
import Mnemonic from 'bitcore-mnemonic';
import { createWallet, CREATE_WALLET_REQUEST, CREATE_WALLET_SUCCESS, CREATE_WALLET_FAILURE } from '../../../src/actions/createWallet';

const KEYCHAIN_USERNAME = 'privateKey';
const KEYCHAIN_SERVICE_NAME = 'bithodl';
const STORAGE_WALLET_KEY = '@Wallet';

const dispatchMock = jest.fn((action) => {
  if (typeof action === 'function') {
    return action(jest.fn());
  }

  return action;
});

const RealDate = Date;

const mockDate = (fakeDate) => {
  global.Date = class extends RealDate {
    constructor(specifiedDate) {
      super(...arguments);
      return new RealDate(specifiedDate || fakeDate);
    }
  };
};

const unmockDate = () => {
  global.Date = RealDate;
};

jest.mock('react-native', () => ({
  AsyncStorage: {
    setItem: jest.fn(() => Promise.resolve())
  }
}));

describe('CREATE_WALLET_REQUEST', () => {
  it('equals "CREATE_WALLET_REQUEST"', () => {
    expect(CREATE_WALLET_REQUEST).toBe('CREATE_WALLET_REQUEST');
  });
});

describe('CREATE_WALLET_SUCCESS', () => {
  it('equals "CREATE_WALLET_SUCCESS"', () => {
    expect(CREATE_WALLET_SUCCESS).toBe('CREATE_WALLET_SUCCESS');
  });
});

describe('CREATE_WALLET_FAILURE', () => {
  it('equals "CREATE_WALLET_FAILURE"', () => {
    expect(CREATE_WALLET_FAILURE).toBe('CREATE_WALLET_FAILURE');
  });
});

describe('createWallet', () => {
  let fakePhrase;

  beforeAll(() => {
    mockDate('29 November, 2017, 21:59 GMT+02:00');
  });

  beforeEach(() => {
    Keychain.setGenericPassword.mockClear();
    AsyncStorage.setItem.mockClear();
  });

  afterAll(() => {
    unmockDate();
  });

  it('is a function', () => {
    expect(typeof createWallet).toBe('function');
  });

  it('accepts one argument', () => {
    expect(createWallet.length).toBe(1);
  });

  describe('createWallet(undefined)', () => {
    beforeEach(() => {
      fakePhrase = undefined;
    });

    it('returns a function', () => {
      const returnValue = createWallet(fakePhrase);
      expect(typeof returnValue).toBe('function');
    });

    describe('the returned function', () => {
      let returnedFunction;

      beforeEach(() => {
        returnedFunction = createWallet(fakePhrase);
      });

      it('dispatches an action of type CREATE_WALLET_REQUEST', () => {
        returnedFunction(dispatchMock);

        expect(dispatchMock).toHaveBeenCalledWith({
          type: CREATE_WALLET_REQUEST
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

        it('dispatches an action of type CREATE_WALLET_SUCCESS with metadata about the wallet', () => {
          expect.hasAssertions();

          return promise.then((wallet) => {
            expect(wallet).toBeTruthy();
            expect(wallet.metadata).toBeTruthy();

            expect(dispatchMock).toHaveBeenCalledWith({
              type: CREATE_WALLET_SUCCESS,
              metadata: wallet.metadata
            });
          });
        });

        it('saves the private key in the Keychain', () => {
          expect.hasAssertions();

          return promise.then((wallet) => {
            const expectedUsername = KEYCHAIN_USERNAME;
            const expectedMnemonicPhrase = wallet.mnemonic.toString();
            const expectedServiceName = KEYCHAIN_SERVICE_NAME;

            expect(Keychain.setGenericPassword).toHaveBeenCalledTimes(1);
            expect(Keychain.setGenericPassword).toHaveBeenCalledWith(
              expectedUsername,
              expectedMnemonicPhrase,
              expectedServiceName
            );
          });
        });

        it('saves the metadata as JSON in AsyncStorage', () => {
          expect.hasAssertions();

          return promise.then((wallet) => {
            const serializedMetadata = JSON.stringify(wallet.metadata);

            expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
            expect(AsyncStorage.setItem).toHaveBeenCalledWith(STORAGE_WALLET_KEY, serializedMetadata);
          });
        });

        describe('the resolved value', () => {
          let newWallet;

          beforeEach(() => {
            return promise.then((wallet) => {
              newWallet = wallet;
            });
          });

          it('is an object', () => {
            expect(newWallet).toBeTruthy();
            expect(typeof newWallet).toBe('object');
          });

          describe('.metadata', () => {
            let metadata;

            beforeEach(() => {
              metadata = newWallet.metadata;
            });

            it('is an object', () => {
              expect(metadata).toBeTruthy();
              expect(typeof metadata).toBe('object');
            });

            it('has "publicKey" set to the public key of the generated private key', () => {
              const hdPrivateKey = newWallet.mnemonic.toHDPrivateKey();
              const hdPublicKey = hdPrivateKey.hdPublicKey;
              const expectedPublicKey = hdPublicKey.publicKey.toString();

              expect(metadata.publicKey).toBeTruthy();
              expect(metadata.publicKey).toBe(expectedPublicKey);
            });

            it('has "createdAt" set to the unix timestamp of now', () => {
              const expectedTimestamp = Math.floor(new Date().getTime() / 1000);

              expect(metadata.createdAt).toBeTruthy();
              expect(metadata.createdAt).toBe(expectedTimestamp);
            });
          });

          describe('.mnemonic', () => {
            let mnemonic;

            beforeEach(() => {
              mnemonic = newWallet.mnemonic;
            });

            it('is an instance of Mnemonic', () => {
              expect(mnemonic).toBeTruthy();
              expect(mnemonic instanceof Mnemonic).toBe(true);
            });

            it('.toString() returns a string of 12 words', () => {
              const phrase = mnemonic.toString();

              expect(typeof phrase).toBe('string');
              expect(phrase.split(' ').length).toBe(12);
            });

            it('is different each time', () => {
              const promise1 = createWallet()(dispatchMock);
              const promise2 = createWallet()(dispatchMock);

              expect.hasAssertions();

              return Promise.all([promise1, promise2]).then((result) => {
                const mnemonic1 = result[0].mnemonic.toString();
                const mnemonic2 = result[1].mnemonic.toString();

                expect(mnemonic1).not.toBe(mnemonic2);
              });
            });
          });
        });
      });

      describe('when the function fails', () => {
        let promise;

        beforeEach(() => {
          // Make the function fail by providing an invalid mnemonic phrase.
          promise = createWallet('invalid mnemonic phrase')(dispatchMock);
        });

        it('rejects the returned promise', () => {
          expect.hasAssertions();

          return promise.catch((error) => {
            expect(error).toBeTruthy();
            expect(error.message).toBe('Could not detect the used word list: invalid mnemonic phrase');
          });
        });

        it('dispatches an action of type CREATE_WALLET_FAILURE with the error', () => {
          expect.hasAssertions();

          return promise.catch((error) => {
            expect(error).toBeTruthy();

            expect(dispatchMock).toHaveBeenCalledWith({
              type: CREATE_WALLET_FAILURE,
              error
            });
          });
        });
      });
    });
  });

  describe('createWallet(phrase)', () => {
    let promise;

    beforeEach(() => {
      fakePhrase = 'during bulb nominee acquire paddle next course stable govern eagle title wing';
      promise = createWallet(fakePhrase)(dispatchMock);
    });

    it('saves the phrase in the Keychain', () => {
      expect.hasAssertions();

      return promise.then((wallet) => {
        const expectedUsername = KEYCHAIN_USERNAME;
        const expectedMnemonicPhrase = fakePhrase;
        const expectedServiceName = KEYCHAIN_SERVICE_NAME;
        const actualMnemonicPhrase = wallet.mnemonic.toString();

        expect(expectedMnemonicPhrase).toBeTruthy();
        expect(actualMnemonicPhrase).toBe(expectedMnemonicPhrase);

        expect(Keychain.setGenericPassword).toHaveBeenCalledTimes(1);
        expect(Keychain.setGenericPassword).toHaveBeenCalledWith(
          expectedUsername,
          expectedMnemonicPhrase,
          expectedServiceName
        );
      });
    });

    it('saves the public key of the provided private key in the AsyncStorage', () => {
      expect.hasAssertions();

      return promise.then((wallet) => {
        const expectedPublicKey = '0205268a1a390306395624ea73d0c0c2a9e00b879cf7f733f92333fa3b1a064bfd';
        const actualMetadataJson = AsyncStorage.setItem.mock.calls[0][1];
        const actualMetadata = JSON.parse(actualMetadataJson);

        expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
        expect(actualMetadata.publicKey).toBe(expectedPublicKey);
        expect(wallet.metadata.publicKey).toBe(expectedPublicKey);
      });
    });
  });
});
