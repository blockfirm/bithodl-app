import { AsyncStorage } from 'react-native';

export const WRITE_ADDRESSES_REQUEST = 'WRITE_ADDRESSES_REQUEST';
export const WRITE_ADDRESSES_SUCCESS = 'WRITE_ADDRESSES_SUCCESS';
export const WRITE_ADDRESSES_FAILURE = 'WRITE_ADDRESSES_FAILURE';

const STORAGE_ADDRESSES_KEY = '@Addresses';

const writeAddressesRequest = () => {
  return {
    type: WRITE_ADDRESSES_REQUEST
  };
};

const writeAddressesSuccess = () => {
  return {
    type: WRITE_ADDRESSES_SUCCESS
  };
};

const writeAddressesFailure = (error) => {
  return {
    type: WRITE_ADDRESSES_FAILURE,
    error
  };
};

export const writeAddresses = () => {
  return (dispatch, getState) => {
    dispatch(writeAddressesRequest());

    const items = getState().addresses.items;
    const serialized = JSON.stringify(items);

    return AsyncStorage.setItem(STORAGE_ADDRESSES_KEY, serialized)
      .then(() => {
        dispatch(writeAddressesSuccess());
      })
      .catch((error) => {
        dispatch(writeAddressesFailure(error));
        throw error;
      });
  };
};
