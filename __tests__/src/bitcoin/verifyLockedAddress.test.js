import bitcore from 'bitcore-lib';
import verifyLockedAddress from '../../../src/bitcoin/verifyLockedAddress';

describe('verifyLockedAddress(address, publicKey)', () => {
  let validAddress;
  let publicKey;

  beforeEach(() => {
    const privateKey = new bitcore.PrivateKey('ea5a41bab42a340ff4d3b1f0e1bb76dfdf06527f79fe99f89fcbd9883c10fd79');

    publicKey = privateKey.toPublicKey();

    validAddress = {
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
  });

  it('accepts two arguments', () => {
    expect(verifyLockedAddress.length).toBe(2);
  });

  it('does not modify the input arguments', () => {
    const expectedAddress = { ...validAddress };
    const expectedPublicKey = publicKey.toString();

    verifyLockedAddress(validAddress, publicKey);

    const actualAddress = validAddress;
    const actualPublicKey = publicKey.toString();

    expect(actualAddress).toMatchObject(expectedAddress);
    expect(actualPublicKey).toBe(expectedPublicKey);
  });

  it('returns true for a valid address', () => {
    const isValid = verifyLockedAddress(validAddress, publicKey);
    expect(isValid).toBe(true);
  });

  it('returns false for an invalid address', () => {
    const invalidAddress = { ...validAddress, hash: '2048961a-c7c0-4b51-be23-c179ddf9222e' };
    const isValid = verifyLockedAddress(invalidAddress, publicKey);

    expect(isValid).toBe(false);
  });
});
