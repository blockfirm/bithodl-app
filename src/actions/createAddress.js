import uuid from 'uuid';
import toUnixTimestamp from '../utils/toUnixTimestamp';
import createLockedAddress from '../bitcoin/createLockedAddress';
import { getWallet } from './getWallet';
import { addAddress } from './addAddress';
import { writeAddresses } from './writeAddresses';

export const CREATE_ADDRESS_REQUEST = 'CREATE_ADDRESS_REQUEST';
export const CREATE_ADDRESS_SUCCESS = 'CREATE_ADDRESS_SUCCESS';
export const CREATE_ADDRESS_FAILURE = 'CREATE_ADDRESS_FAILURE';

export const createAddressRequest = () => {
  return {
    type: CREATE_ADDRESS_REQUEST
  };
};

export const createAddressSuccess = (address) => {
  return {
    type: CREATE_ADDRESS_SUCCESS,
    address
  };
};

export const createAddressFailure = (error) => {
  return {
    type: CREATE_ADDRESS_FAILURE,
    error
  };
};

export const createAddress = (unlockDate) => {
  return (dispatch) => {
    dispatch(createAddressRequest());

    return dispatch(getWallet())
      .then((wallet) => {
        const publicKey = wallet.publicKey;
        const p2shAddress = createLockedAddress(publicKey, unlockDate);

        const address = {
          id: uuid.v1(),
          hash: p2shAddress.hash,
          script: p2shAddress.script,
          amount: 0,
          createdAt: toUnixTimestamp(new Date()),
          unlockAt: toUnixTimestamp(unlockDate)
        };

        return dispatch(addAddress(address));
      })
      .then((address) => {
        return dispatch(writeAddresses()).then(() => {
          dispatch(createAddressSuccess(address));
          return address;
        });
      })
      .catch((error) => {
        dispatch(createAddressFailure(error));
        throw error;
      });
  };
};
