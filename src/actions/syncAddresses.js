import { readAddresses } from './readAddresses';
import { writeAddresses } from './writeAddresses';
import { syncAddress } from './syncAddress';

export const SYNC_ADDRESSES_REQUEST = 'SYNC_ADDRESSES_REQUEST';
export const SYNC_ADDRESSES_SUCCESS = 'SYNC_ADDRESSES_SUCCESS';
export const SYNC_ADDRESSES_FAILURE = 'SYNC_ADDRESSES_FAILURE';

const syncAddressesRequest = () => {
  return {
    type: SYNC_ADDRESSES_REQUEST
  };
};

const syncAddressesSuccess = () => {
  return {
    type: SYNC_ADDRESSES_SUCCESS
  };
};

const syncAddressesFailure = (error) => {
  return {
    type: SYNC_ADDRESSES_FAILURE,
    error
  };
};

export const syncAddresses = () => {
  return (dispatch) => {
    dispatch(syncAddressesRequest());

    return dispatch(readAddresses())
      .then((addresses) => {
        const listOfAddresses = Object.values(addresses);
        const addressesWithoutUtxo = listOfAddresses.filter(address => !address.utxo);

        const promises = addressesWithoutUtxo.map((address) => {
          return dispatch(syncAddress(address));
        });

        return Promise.all(promises);
      })
      .then(() => {
        return dispatch(writeAddresses());
      })
      .then(() => {
        dispatch(syncAddressesSuccess());
      })
      .catch((error) => {
        dispatch(syncAddressesFailure(error));
        throw error;
      });
  };
};
