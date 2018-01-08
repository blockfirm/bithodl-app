import api from '../api';
import { updateAddress } from './updateAddress';

export const SYNC_ADDRESS_REQUEST = 'SYNC_ADDRESS_REQUEST';
export const SYNC_ADDRESS_SUCCESS = 'SYNC_ADDRESS_SUCCESS';
export const SYNC_ADDRESS_FAILURE = 'SYNC_ADDRESS_FAILURE';

const syncAddressRequest = () => {
  return {
    type: SYNC_ADDRESS_REQUEST
  };
};

const syncAddressSuccess = (address) => {
  return {
    type: SYNC_ADDRESS_SUCCESS,
    address
  };
};

const syncAddressFailure = (error) => {
  return {
    type: SYNC_ADDRESS_FAILURE,
    error
  };
};

export const syncAddress = (address) => {
  return (dispatch, getState) => {
    const settings = getState().settings;
    const options = { baseUrl: settings.api.baseUrl };

    dispatch(syncAddressRequest());

    return api.getUnspentOutputs(address, options)
      .then((utxos) => {
        if (!utxos.length) {
          return address;
        }

        const newUtxo = utxos.find((utxo) => {
          return utxo.blockTimestamp >= address.createdAt;
        });

        if (!newUtxo) {
          return address;
        }

        address.amount = newUtxo.satoshis;

        address.utxo = {
          txid: newUtxo.txid,
          outputIndex: newUtxo.outputIndex
        };

        return dispatch(updateAddress(address));
      })
      .then(() => {
        dispatch(syncAddressSuccess(address));
        return address;
      })
      .catch((error) => {
        dispatch(syncAddressFailure(error));
        throw error;
      });
  };
};
