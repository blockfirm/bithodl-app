import api from '../api';

export const ESTIMATE_FEE_REQUEST = 'ESTIMATE_FEE_REQUEST';
export const ESTIMATE_FEE_SUCCESS = 'ESTIMATE_FEE_SUCCESS';
export const ESTIMATE_FEE_FAILURE = 'ESTIMATE_FEE_FAILURE';

const estimateFeeRequest = () => {
  return {
    type: ESTIMATE_FEE_REQUEST
  };
};

const estimateFeeSuccess = (satoshisPerByte) => {
  return {
    type: ESTIMATE_FEE_SUCCESS,
    satoshisPerByte
  };
};

const estimateFeeFailure = (error) => {
  return {
    type: ESTIMATE_FEE_FAILURE,
    error
  };
};

export const estimateFee = () => {
  return (dispatch, getState) => {
    const settings = getState().settings;
    const options = { baseUrl: settings.api.baseUrl };

    dispatch(estimateFeeRequest());

    return api.estimateFee(options)
      .then((satoshisPerByte) => {
        dispatch(estimateFeeSuccess(satoshisPerByte));
        return satoshisPerByte;
      })
      .catch((error) => {
        dispatch(estimateFeeFailure(error));
        throw error;
      });
  };
};
