import { AsyncStorage } from 'react-native';

export const DELETE_ADDRESSES_REQUEST = 'DELETE_ADDRESSES_REQUEST';
export const DELETE_ADDRESSES_SUCCESS = 'DELETE_ADDRESSES_SUCCESS';
export const DELETE_ADDRESSES_FAILURE = 'DELETE_ADDRESSES_FAILURE';

const STORAGE_ADDRESSES_KEY = '@Addresses';

const deleteAddressesRequest = () => {
  return {
    type: DELETE_ADDRESSES_REQUEST
  };
};

const deleteAddressesSuccess = () => {
  return {
    type: DELETE_ADDRESSES_SUCCESS
  };
};

const deleteAddressesFailure = (error) => {
  return {
    type: DELETE_ADDRESSES_FAILURE,
    error
  };
};

export const deleteAddresses = () => {
  return (dispatch) => {
    dispatch(deleteAddressesRequest());

    return AsyncStorage.removeItem(STORAGE_ADDRESSES_KEY)
      .then(() => {
        dispatch(deleteAddressesSuccess());
      })
      .catch((error) => {
        dispatch(deleteAddressesFailure(error));
        throw error;
      });
  };
};
