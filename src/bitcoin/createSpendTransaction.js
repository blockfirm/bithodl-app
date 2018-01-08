import bitcore from 'bitcore-lib';
import config from '../config';

// Default transaction fee in satoshis.
const DEFAULT_FEE_AMOUNT = 30000;

export default function createSpendTransaction(fromAddress, toAddressHash, privateKey, fee = DEFAULT_FEE_AMOUNT) {
  const redeemScript = new bitcore.Script(fromAddress.script);
  const lockTime = new Date(fromAddress.unlockAt * 1000);
  const validationError = bitcore.Address.getValidationError(toAddressHash, config.bitcoin.network);

  if (validationError) {
    throw new Error(`Invalid address: ${validationError.message}`);
  }

  const transaction = new bitcore.Transaction()
    .from({
      txid: fromAddress.utxo.txid,
      vout: fromAddress.utxo.outputIndex,
      scriptPubKey: redeemScript.toScriptHashOut(),
      satoshis: fromAddress.amount
    })
    .to(toAddressHash, fromAddress.amount - fee)
    .lockUntilDate(lockTime);

  // The CLTV opcode requires that the input's sequence number not be finalized.
  transaction.inputs[0].sequenceNumber = 0;

  const signature = bitcore.Transaction.sighash.sign(
    transaction,
    privateKey,
    bitcore.crypto.Signature.SIGHASH_ALL, // Sign all inputs and outputs.
    0, // Input index.
    redeemScript
  );

  // Setup the scriptSig of the spending transaction to spend the p2sh-cltv-p2pkh redeem script.
  transaction.inputs[0].setScript(
    bitcore.Script
      .empty()
      .add(signature.toTxFormat())
      .add(privateKey.toPublicKey().toBuffer())
      .add(redeemScript.toBuffer())
  );

  return transaction;
}
