export const DELETE_ADDRESS_REQUEST = 'DELETE_ADDRESS_REQUEST';
export const DELETE_ADDRESS_SUCCESS = 'DELETE_ADDRESS_SUCCESS';
export const DELETE_ADDRESS_FAILURE = 'DELETE_ADDRESS_FAILURE';

const deleteAddressRequest = () => {
  return {
    type: DELETE_ADDRESS_REQUEST
  };
};

const deleteAddressSuccess = (address) => {
  return {
    type: DELETE_ADDRESS_SUCCESS,
    address
  };
};

const deleteAddressFailure = (error) => {
  return {
    type: DELETE_ADDRESS_FAILURE,
    error
  };
};

export const deleteAddress = (address) => {
  return (dispatch) => {
    dispatch(deleteAddressRequest());

    return Promise.resolve().then(() => {
      if (!address || !address.id) {
        const error = new Error('Unknown address.');
        dispatch(deleteAddressFailure(error));
        throw error;
      }

      dispatch(deleteAddressSuccess(address));

      return address;
    });
  };
};
