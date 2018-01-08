import bitcore from 'bitcore-lib';
import createSpendTransaction from '../../../src/bitcoin/createSpendTransaction';

describe('createSpendTransaction(fromAddress, toAddressHash, privateKey, fee)', () => {
  let fromAddress;
  let toAddressHash;
  let privateKey;
  let fee;

  beforeEach(() => {
    fromAddress = {
      hash: '2N2WpFxLe2zm75uU62W3krSTxx9aWg1hQ1c',
      script: '4 0x80c7d659 OP_NOP2 OP_DROP OP_DUP OP_HASH160 20 0xc96d191664602a533bf465f157a8f6517a3e2f77 OP_EQUALVERIFY OP_CHECKSIG',
      amount: 9000000,
      createdAt: 1507164191,
      unlockAt: 1507248000,
      utxo: {
        outputIndex: 0,
        txid: '5870ebee3685b6338ba8ddbe87a2f59cf57c08fbaa5a77cf13bda1d0c7ef3d16'
      }
    };

    toAddressHash = 'mgPQtU9sBBJDZbv5sFcqDxCQBZsdrEvxSp';
    privateKey = new bitcore.PrivateKey('ea5a41bab42a340ff4d3b1f0e1bb76dfdf06527f79fe99f89fcbd9883c10fd79');
    fee = 20000;
  });

  it('accepts three arguments', () => {
    // The fee (fourth argument) is optional.
    expect(createSpendTransaction.length).toBe(3);
  });

  it('does not modify the input arguments', () => {
    const expectedFromAddress = { ...fromAddress };
    const expectedPrivateKey = privateKey.toString();

    createSpendTransaction(fromAddress, toAddressHash, privateKey, fee);

    const actualFromAddress = fromAddress;
    const actualPrivateKey = privateKey.toString();

    expect(actualFromAddress).toMatchObject(expectedFromAddress);
    expect(actualPrivateKey).toBe(expectedPrivateKey);
  });

  it('returns a bitcore Transaction', () => {
    const transaction = createSpendTransaction(fromAddress, toAddressHash, privateKey, fee);
    expect(transaction instanceof bitcore.Transaction).toBe(true);
  });

  it('returns a valid transaction', () => {
    const expectedRawTransaction = '0100000001163defc7d0a1bd13cf775aaafb087cf59cf5a287bedda88b33b68536eeeb7058000000008c483045022100b3143e79accfec910f03d020686dcbd90b509638961f8f215684595e9c47a06e022016dce3262e2a01fed80288512561ed326ac3edc7c868914a01625218feb780cd01210205268a1a390306395624ea73d0c0c2a9e00b879cf7f733f92333fa3b1a064bfd200480c7d659b17576a914c96d191664602a533bf465f157a8f6517a3e2f7788ac000000000120068900000000001976a914098aff429069373bee2b74821eb9a0c3bbacc38a88ac80c7d659';
    const actualTransaction = createSpendTransaction(fromAddress, toAddressHash, privateKey, fee);
    const actualRawTransaction = actualTransaction.toString();

    expect(actualRawTransaction).toBe(expectedRawTransaction);
  });

  describe('when no fee is specified', () => {
    it('returns a bitcore Transaction with 30,000 satoshis in fees', () => {
      const transaction = createSpendTransaction(fromAddress, toAddressHash, privateKey);

      expect(transaction instanceof bitcore.Transaction).toBe(true);
      expect(transaction.getFee()).toBe(30000);
    });
  });

  describe('when toAddressHash is an invalid address', () => {
    it('throws an error', () => {
      toAddressHash = '514accc8-1fe8-4b10-8ebc-62be609c4945';

      expect(() => {
        createSpendTransaction(fromAddress, toAddressHash, privateKey, fee);
      }).toThrow();
    });
  });
});
