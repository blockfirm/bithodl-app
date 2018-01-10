BitHodl
=======

[![GitHub Release](https://img.shields.io/github/release/blockfirm/bithodl-app.svg?style=flat-square)](https://github.com/blockfirm/bithodl-app/releases)
[![Build Status](https://img.shields.io/travis/blockfirm/bithodl-app.svg?branch=master&style=flat-square)](https://travis-ci.org/blockfirm/bithodl-app)
[![Coverage Status](https://img.shields.io/coveralls/blockfirm/bithodl-app.svg?style=flat-square)](https://coveralls.io/r/blockfirm/bithodl-app)

<https://bithodl.com/>

The Bitcoin wallet for Hodlers. Make sure to hold on to your Bitcoin even
through the most volatile roller coasters. BitHodl locks your BTC using
pay-to-script hashes, making them impossible to spend before a specified date.

## Getting Started

### Install Node.js and npm

Install [Node.js](https://nodejs.org) (`v8`) using [nvm](https://github.com/creationix/nvm):

	$ nvm install v8

### Install dependencies

	$ npm install
	$ npm install -g react-native-cli
	$ react-native link

### Start the iOS application

	$ react-native run-ios

## Hacks

This project is using [Bitcore Library](https://bitcore.io/api/). And to get that to work in React Native, these hacks was necessary:

* Used [rn-nodify](https://github.com/mvayngrib/rn-nodeify) to add support for Node modules
  (Look into [ReactNativify](https://github.com/philikon/ReactNativify) instead?)

* `node_modules/bitcore-lib/lib/script/script.js` needs to be manually modified like this:
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
