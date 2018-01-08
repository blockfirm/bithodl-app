import createLockedAddress from './createLockedAddress';

export default function verifyLockedAddress(address, publicKey) {
  const unlockDate = new Date(address.unlockAt * 1000);
  const expectedAddress = createLockedAddress(publicKey, unlockDate);
  const hashIsCorrect = address.hash === expectedAddress.hash;
  const scriptIsCorrect = address.script === expectedAddress.script;

  return hashIsCorrect && scriptIsCorrect;
}
