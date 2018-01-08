import { AsyncStorage } from 'react-native';
import * as Keychain from 'react-native-keychain';
import { deleteAddresses } from './deleteAddresses';

export const DELETE_WALLET_REQUEST = 'DELETE_WALLET_REQUEST';
export const DELETE_WALLET_SUCCESS = 'DELETE_WALLET_SUCCESS';
export const DELETE_WALLET_FAILURE = 'DELETE_WALLET_FAILURE';

const KEYCHAIN_SERVICE_NAME = 'bithodl';
const STORAGE_WALLET_KEY = '@Wallet';

const deleteMetadata = () => {
  return AsyncStorage.removeItem(STORAGE_WALLET_KEY);
};

const deleteWalletRequest = () => {
  return {
    type: DELETE_WALLET_REQUEST
  };
};

const deleteWalletSuccess = () => {
  return {
    type: DELETE_WALLET_SUCCESS
  };
};

const deleteWalletFailure = (error) => {
  return {
    type: DELETE_WALLET_FAILURE,
    error
  };
};

export const deleteWallet = () => {
  return (dispatch) => {
    dispatch(deleteWalletRequest());

    // Deletes all generic password keychain entries for `KEYCHAIN_SERVICE_NAME`.
    return Keychain.resetGenericPassword(KEYCHAIN_SERVICE_NAME)
      .then(() => {
        return deleteMetadata();
      })
      .then(() => {
        return dispatch(deleteAddresses());
      })
      .then(() => {
        dispatch(deleteWalletSuccess());
      })
      .catch((error) => {
        dispatch(deleteWalletFailure(error));
        throw error;
      });
  };
};
