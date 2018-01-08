import { AsyncStorage } from 'react-native';

export const READ_ADDRESSES_REQUEST = 'READ_ADDRESSES_REQUEST';
export const READ_ADDRESSES_SUCCESS = 'READ_ADDRESSES_SUCCESS';
export const READ_ADDRESSES_FAILURE = 'READ_ADDRESSES_FAILURE';

const STORAGE_ADDRESSES_KEY = '@Addresses';

const readAddressesRequest = () => {
  return {
    type: READ_ADDRESSES_REQUEST
  };
};

const readAddressesSuccess = (addresses) => {
  return {
    type: READ_ADDRESSES_SUCCESS,
    addresses
  };
};

const readAddressesFailure = (error) => {
  return {
    type: READ_ADDRESSES_FAILURE,
    error
  };
};

export const readAddresses = () => {
  return (dispatch) => {
    dispatch(readAddressesRequest());

    return AsyncStorage.getItem(STORAGE_ADDRESSES_KEY)
      .then((result) => {
        const addresses = JSON.parse(result) || {};
        dispatch(readAddressesSuccess(addresses));
        return addresses;
      })
      .catch((error) => {
        dispatch(readAddressesFailure(error));
        throw error;
      });
  };
};
