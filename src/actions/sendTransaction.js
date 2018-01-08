import api from '../api';

export const SEND_TRANSACTION_REQUEST = 'SEND_TRANSACTION_REQUEST';
export const SEND_TRANSACTION_SUCCESS = 'SEND_TRANSACTION_SUCCESS';
export const SEND_TRANSACTION_FAILURE = 'SEND_TRANSACTION_FAILURE';

const sendTransactionRequest = () => {
  return {
    type: SEND_TRANSACTION_REQUEST
  };
};

const sendTransactionSuccess = (transaction) => {
  return {
    type: SEND_TRANSACTION_SUCCESS,
    transaction
  };
};

const sendTransactionFailure = (error) => {
  return {
    type: SEND_TRANSACTION_FAILURE,
    error
  };
};

export const sendTransaction = (transaction) => {
  return (dispatch, getState) => {
    const settings = getState().settings;
    const options = { baseUrl: settings.api.baseUrl };

    dispatch(sendTransactionRequest());

    return api.postTransaction(transaction, options)
      .then(() => {
        dispatch(sendTransactionSuccess(transaction));
      })
      .catch((error) => {
        dispatch(sendTransactionFailure(error));
        throw error;
      });
  };
};
