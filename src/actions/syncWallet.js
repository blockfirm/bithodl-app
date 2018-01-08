import api from '../api';
import verifyLockedAddress from '../bitcoin/verifyLockedAddress';
import { getWallet } from './getWallet';
import { addAddress } from './addAddress';
import { deleteAddresses } from './deleteAddresses';
import { writeAddresses } from './writeAddresses';

export const SYNC_WALLET_REQUEST = 'SYNC_WALLET_REQUEST';
export const SYNC_WALLET_SUCCESS = 'SYNC_WALLET_SUCCESS';
export const SYNC_WALLET_FAILURE = 'SYNC_WALLET_FAILURE';

const normalizeAddress = (address) => {
  return {
    hash: address.hash,
    script: address.script,
    amount: address.utxo.satoshis,
    createdAt: address.utxo.blockTimestamp,
    unlockAt: address.unlockTimestamp,
    utxo: {
      txid: address.utxo.txid,
      outputIndex: address.utxo.outputIndex
    }
  };
};

const syncWalletRequest = () => {
  return {
    type: SYNC_WALLET_REQUEST
  };
};

const syncWalletSuccess = () => {
  return {
    type: SYNC_WALLET_SUCCESS
  };
};

const syncWalletFailure = (error) => {
  return {
    type: SYNC_WALLET_FAILURE,
    error
  };
};

export const syncWallet = () => {
  let publicKey;

  return (dispatch, getState) => {
    const settings = getState().settings;
    const options = { baseUrl: settings.api.baseUrl };

    dispatch(syncWalletRequest());

    return dispatch(getWallet())
      .then((wallet) => {
        publicKey = wallet.publicKey;
        return api.getAddresses(publicKey, options);
      })
      .then((results) => {
        const addresses = results.map(normalizeAddress);

        // Verify all addresses.
        const isValid = addresses.every((address) => {
          return verifyLockedAddress(address, publicKey);
        });

        if (!isValid) {
          throw new Error('The server returned an invalid address.');
        }

        // Delete current addresses.
        return dispatch(deleteAddresses()).then(() => {
          return addresses;
        });
      })
      .then((addresses) => {
        const promises = addresses.map((address) => {
          return dispatch(addAddress(address));
        });

        return Promise.all(promises);
      })
      .then(() => {
        return dispatch(writeAddresses());
      })
      .then(() => {
        dispatch(syncWalletSuccess());
      })
      .catch((error) => {
        dispatch(syncWalletFailure(error));
        throw error;
      });
  };
};
