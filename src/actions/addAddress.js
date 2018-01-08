import uuid from 'uuid';

export const ADD_ADDRESS_REQUEST = 'ADD_ADDRESS_REQUEST';
export const ADD_ADDRESS_SUCCESS = 'ADD_ADDRESS_SUCCESS';

export const addAddressRequest = () => {
  return {
    type: ADD_ADDRESS_REQUEST
  };
};

export const addAddressSuccess = (address) => {
  return {
    type: ADD_ADDRESS_SUCCESS,
    address
  };
};

export const addAddress = (address) => {
  return (dispatch) => {
    dispatch(addAddressRequest());
    address.id = address.id || uuid.v1();
    dispatch(addAddressSuccess(address));

    return Promise.resolve(address);
  };
};
