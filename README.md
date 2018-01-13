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

## Use with testnet

During development and testing it is recommended to use the testnet network. By doing so you can
use testnet coins and don't risk losing any real money.

1. **Configure and run a Bitcore node with testnet**

 You need to run a Bitcore node and configure it to use the testnet.
 Follow the instructions in the [BitHodl Service repo](https://github.com/blockfirm/bithodl-service).

2. **Configure the BitHodl app to use testnet**

 Open `src/config.js` and set `network` to `testnet` instead of `mainnet`.

3. **Point the app to your testnet service**

 Once you've built and started the app, go to settings and enter the url to your testnet node
 from step 1.

## Contributing

Want to help us making BitHodl better? Great, but first read the
[CONTRIBUTING.md](CONTRIBUTING.md) file for instructions.

## Licensing

BitHodl is licensed under the Apache License, Version 2.0.
See [LICENSE](LICENSE) for full license text.
