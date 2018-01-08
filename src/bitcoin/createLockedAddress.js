import bitcore from 'bitcore-lib';
import config from '../config';
import getFullHour from '../utils/getFullHour';
import toUnixTimestamp from '../utils/toUnixTimestamp';

const OP_CHECKLOCKTIMEVERIFY = 'OP_CHECKLOCKTIMEVERIFY';
const OP_DROP = 'OP_DROP';

export default function createLockedAddress(publicKey, unlockDate) {
  const normalizedUnlockDate = getFullHour(unlockDate);
  const unlockTimestamp = toUnixTimestamp(normalizedUnlockDate);

  const script = bitcore.Script.empty()
    .add(bitcore.crypto.BN.fromNumber(unlockTimestamp).toScriptNumBuffer())
    .add(OP_CHECKLOCKTIMEVERIFY)
    .add(OP_DROP)
    .add(bitcore.Script.buildPublicKeyHashOut(publicKey.toAddress(config.bitcoin.network)));

  const address = bitcore.Address.payingTo(script, config.bitcoin.network);

  return {
    hash: address.toString(),
    script: script.toString(),
    unlockTimestamp
  };
}
