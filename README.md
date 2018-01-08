BitHodl
=======

<https://bithodl.com/>

The Bitcoin wallet for Hodlers. Make sure to hold on to your Bitcoin even
through the most volatile roller coasters. BitHodl locks your BTC using
pay-to-script hashes, making them impossible to spend before a specified date.

## Getting Started

### Start the iOS application

	$ npm install
	$ npm install -g react-native-cli
	$ react-native link
	$ react-native run-ios

## Hacks

This project is using [Bitcore Library](https://bitcore.io/api/). And to get that to work in React Native, these hacks was necessary:

* Used [rn-nodify](https://github.com/mvayngrib/rn-nodeify) to add support for Node modules
  (Look into [ReactNativify](https://github.com/philikon/ReactNativify) instead?)

* `node_modules/bitcore-lib/lib/script/script.js` had to be modified like this:
   ```javascript
   +Address = require('../address');

   if (BufferUtil.isBuffer(from)) {
     return Script.fromBuffer(from);
   } else if (from instanceof Address) {
   ...
   ```

## Contributing

Want to help us making BitHodl better? Great, but first read the
[CONTRIBUTING.md](CONTRIBUTING.md) file for instructions.

## Licensing

BitHodl is licensed under the Apache License, Version 2.0.
See [LICENSE](LICENSE) for full license text.
