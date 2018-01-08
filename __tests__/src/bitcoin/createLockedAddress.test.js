import bitcore from 'bitcore-lib';
import createLockedAddress from '../../../src/bitcoin/createLockedAddress';

describe('createLockedAddress(publicKey, unlockDate)', () => {
  let privateKey;
  let publicKey;

  beforeEach(() => {
    privateKey = new bitcore.PrivateKey('b221d9dbb083a7f33428d7c2a3c3198ae925614d70210e28716ccaa7cd4ddb79');
    publicKey = privateKey.toPublicKey();
  });

  it('accepts two arguments', () => {
    expect(createLockedAddress.length).toBe(2);
  });

  it('does not modify the input arguments', () => {
    const unlockDate = new Date('25 October, 2017, 00:00 GMT+02:00');
    const expectedPublicKey = publicKey.toString();
    const expectedUnlockDate = unlockDate.toString();

    createLockedAddress(publicKey, unlockDate);

    const actualPublicKey = publicKey.toString();
    const actualUnlockDate = unlockDate.toString();

    expect(actualPublicKey).toBe(expectedPublicKey);
    expect(actualUnlockDate).toBe(expectedUnlockDate);
  });

  it('returns an object', () => {
    const unlockDate = new Date('25 October, 2017, 00:00 GMT+02:00');
    const address = createLockedAddress(publicKey, unlockDate);

    expect(typeof address).toBe('object');
  });

  describe('the return object', () => {
    let unlockDate;
    let returnObject;

    beforeEach(() => {
      unlockDate = new Date('25 October, 2017, 00:00 GMT+02:00');
      returnObject = createLockedAddress(publicKey, unlockDate);
    });

    it('has "script" set to the redeem script', () => {
      expect(returnObject.script).toBe('4 0xe0b7ef59 OP_NOP2 OP_DROP OP_DUP OP_HASH160 20 0xf9c1437adefc936cea1e20109a5c56ad51a13de6 OP_EQUALVERIFY OP_CHECKSIG');
    });

    it('has "hash" set to the address hash', () => {
      expect(returnObject.hash).toBe('2N6oSTcdmjmTPEQ1sLTBye8HCvbM2fyL2HM');
    });

    it('has "unlockTimestamp" set to the unix timestamp of the unlock date', () => {
      const expectedTimestamp = Math.floor(unlockDate.getTime() / 1000);
      expect(returnObject.unlockTimestamp).toBe(expectedTimestamp);
    });
  });

  describe('when unlockDate is not a full hour', () => {
    let unlockDate;
    let returnObject;

    beforeEach(() => {
      unlockDate = new Date('25 October, 2017, 01:20 GMT+02:00');
      returnObject = createLockedAddress(publicKey, unlockDate);
    });

    it('enforces the lock date to full hours', () => {
      const expectedUnlockDate = new Date('25 October, 2017, 01:00 GMT+02:00');
      const expectedTimestamp = Math.floor(expectedUnlockDate.getTime() / 1000);

      expect(returnObject.unlockTimestamp).toBe(expectedTimestamp);
      expect(returnObject.hash).toBe('2N6cvfB4NAPrTMkFrYsezjXfEKZmRVhJi3q');
    });

    it('does not modify the input date', () => {
      const expected = new Date('25 October, 2017, 01:20 GMT+02:00').toString();
      const actual = unlockDate.toString();

      expect(actual).toBe(expected);
    });
  });
});
