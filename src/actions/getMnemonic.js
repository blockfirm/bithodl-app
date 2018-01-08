import * as Keychain from 'react-native-keychain';
import Mnemonic from 'bitcore-mnemonic';

export const GET_MNEMONIC_REQUEST = 'GET_MNEMONIC_REQUEST';
export const GET_MNEMONIC_SUCCESS = 'GET_MNEMONIC_SUCCESS';
export const GET_MNEMONIC_FAILURE = 'GET_MNEMONIC_FAILURE';

const KEYCHAIN_SERVICE_NAME = 'bithodl';

const getMnemonicRequest = () => {
  return {
    type: GET_MNEMONIC_REQUEST
  };
};

const getMnemonicSuccess = () => {
  return {
    type: GET_MNEMONIC_SUCCESS
  };
};

const getMnemonicFailure = (error) => {
  return {
    type: GET_MNEMONIC_FAILURE,
    error
  };
};

export const getMnemonic = () => {
  return (dispatch) => {
    dispatch(getMnemonicRequest());

    return Keychain.getGenericPassword(KEYCHAIN_SERVICE_NAME)
      .then((credentials) => {
        return new Mnemonic(credentials.password);
      })
      .then((mnemonic) => {
        dispatch(getMnemonicSuccess());
        return mnemonic;
      })
      .catch((error) => {
        dispatch(getMnemonicFailure(error));
        throw error;
      });
  };
};
