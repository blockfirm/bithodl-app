import { AsyncStorage } from 'react-native';
import bitcore from 'bitcore-lib';

export const GET_WALLET_REQUEST = 'GET_WALLET_REQUEST';
export const GET_WALLET_SUCCESS = 'GET_WALLET_SUCCESS';
export const GET_WALLET_FAILURE = 'GET_WALLET_FAILURE';

const STORAGE_WALLET_KEY = '@Wallet';

const parseMetadata = (json) => {
  const metadata = JSON.parse(json);
  const createdAt = new Date(metadata.createdAt);
  const publicKey = new bitcore.PublicKey(metadata.publicKey);

  return {
    ...metadata,
    createdAt,
    publicKey
  };
};

const getWalletRequest = () => {
  return {
    type: GET_WALLET_REQUEST
  };
};

const getWalletSuccess = (metadata) => {
  return {
    type: GET_WALLET_SUCCESS,
    metadata
  };
};

const getWalletFailure = (error) => {
  return {
    type: GET_WALLET_FAILURE,
    error
  };
};

export const getWallet = () => {
  return (dispatch) => {
    dispatch(getWalletRequest());

    return AsyncStorage.getItem(STORAGE_WALLET_KEY)
      .then((result) => {
        const metadata = parseMetadata(result);
        dispatch(getWalletSuccess(metadata));
        return metadata;
      })
      .catch((error) => {
        dispatch(getWalletFailure(error));
        throw error;
      });
  };
};
