import createSpendTransaction from '../bitcoin/createSpendTransaction';
import { getMnemonic } from './getMnemonic';
import { estimateFee } from './estimateFee';

export const CREATE_TRANSACTION_REQUEST = 'CREATE_TRANSACTION_REQUEST';
export const CREATE_TRANSACTION_SUCCESS = 'CREATE_TRANSACTION_SUCCESS';
export const CREATE_TRANSACTION_FAILURE = 'CREATE_TRANSACTION_FAILURE';

const createTransactionRequest = () => {
  return {
    type: CREATE_TRANSACTION_REQUEST
  };
};

const createTransactionSuccess = (transaction) => {
  return {
    type: CREATE_TRANSACTION_SUCCESS,
    transaction
  };
};

const createTransactionFailure = (error) => {
  return {
    type: CREATE_TRANSACTION_FAILURE,
    error
  };
};

export const createTransaction = (fromAddress, toAddressHash) => {
  return (dispatch) => {
    let privateKey;

    dispatch(createTransactionRequest());

    return dispatch(getMnemonic())
      .then((mnemonic) => {
        // Get the private key.
        const hdPrivateKey = mnemonic.toHDPrivateKey();
        privateKey = hdPrivateKey.privateKey;
      })
      .then(() => {
        // Get estimated fee.
        return dispatch(estimateFee());
      })
      .then((satoshisPerByte) => {
        // Create a transaction to get its size.
        let transaction = createSpendTransaction(fromAddress, toAddressHash, privateKey);

        // Calculate the fee.
        const bytes = transaction.toBuffer().length;
        const fee = satoshisPerByte * bytes;

        if (fromAddress.amount <= fee) {
          throw new Error('The transaction fee is larger than the amount to transfer. Go to Settings and try a lower transaction fee level or try again later.');
        }

        // Create a new transaction with the calculated fee.
        transaction = createSpendTransaction(fromAddress, toAddressHash, privateKey, fee);

        dispatch(createTransactionSuccess(transaction));

        return transaction;
      })
      .catch((error) => {
        dispatch(createTransactionFailure(error));
        throw error;
      });
  };
};
