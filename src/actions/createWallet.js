import { AsyncStorage } from 'react-native';
import * as Keychain from 'react-native-keychain';
import Mnemonic from 'bitcore-mnemonic';
import toUnixTimestamp from '../utils/toUnixTimestamp';

export const CREATE_WALLET_REQUEST = 'CREATE_WALLET_REQUEST';
export const CREATE_WALLET_SUCCESS = 'CREATE_WALLET_SUCCESS';
export const CREATE_WALLET_FAILURE = 'CREATE_WALLET_FAILURE';

const KEYCHAIN_USERNAME = 'privateKey';
const KEYCHAIN_SERVICE_NAME = 'bithodl';
const STORAGE_WALLET_KEY = '@Wallet';

const savePrivateKey = (mnemonic) => {
  const username = KEYCHAIN_USERNAME;
  const password = mnemonic.toString();

  return Keychain.setGenericPassword(username, password, KEYCHAIN_SERVICE_NAME);
};

const saveMetadata = (mnemonic) => {
  const createdAt = new Date();
  const hdPrivateKey = mnemonic.toHDPrivateKey();
  const hdPublicKey = hdPrivateKey.hdPublicKey;
  const publicKey = hdPublicKey.publicKey;

  const metadata = {
    createdAt: toUnixTimestamp(createdAt),
    publicKey: publicKey.toString() // A DER hex encoded string.
  };

  const serialized = JSON.stringify(metadata);

  return AsyncStorage.setItem(STORAGE_WALLET_KEY, serialized).then(() => {
    return metadata;
  });
};

const createWalletRequest = () => {
  return {
    type: CREATE_WALLET_REQUEST
  };
};

const createWalletSuccess = (metadata) => {
  return {
    type: CREATE_WALLET_SUCCESS,
    metadata
  };
};

const createWalletFailure = (error) => {
  return {
    type: CREATE_WALLET_FAILURE,
    error
  };
};

export const createWallet = (phrase) => {
  return (dispatch) => {
    dispatch(createWalletRequest());

    return Promise.resolve()
      .then(() => {
        const mnemonic = new Mnemonic(phrase);

        return savePrivateKey(mnemonic)
          .then(() => {
            return saveMetadata(mnemonic);
          })
          .then((metadata) => {
            dispatch(createWalletSuccess(metadata));
            return { metadata, mnemonic };
          });
      })
      .catch((error) => {
        dispatch(createWalletFailure(error));
        throw error;
      });
  };
};
