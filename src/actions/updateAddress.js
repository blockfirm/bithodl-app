export const UPDATE_ADDRESS_REQUEST = 'UPDATE_ADDRESS_REQUEST';
export const UPDATE_ADDRESS_SUCCESS = 'UPDATE_ADDRESS_SUCCESS';
export const UPDATE_ADDRESS_FAILURE = 'UPDATE_ADDRESS_FAILURE';

const updateAddressRequest = () => {
  return {
    type: UPDATE_ADDRESS_REQUEST
  };
};

const updateAddressSuccess = (address) => {
  return {
    type: UPDATE_ADDRESS_SUCCESS,
    address
  };
};

const updateAddressFailure = (error) => {
  return {
    type: UPDATE_ADDRESS_FAILURE,
    error
  };
};

export const updateAddress = (address) => {
  return (dispatch) => {
    dispatch(updateAddressRequest());

    return Promise.resolve()
      .then(() => {
        if (!address || !address.id) {
          throw new Error('Unknown address.');
        }

        dispatch(updateAddressSuccess(address));

        return address;
      })
      .catch((error) => {
        dispatch(updateAddressFailure(error));
        throw error;
      });
  };
};
