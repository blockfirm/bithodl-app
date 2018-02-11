export default {
  bitcoin: {
    network: 'livenet', // 'livenet' or 'testnet'
    unit: 'BTC', // 'BTC' or 'mBTC'
    fee: {
      level: 'Normal', // One of: 'High', 'Normal', 'Low', 'Very low', 'Custom'
      satoshisPerByte: 100 // Only used when level is set to 'Custom'
    }
  },
  api: {
    baseUrl: 'https://api.bithodl.com/v1'
  }
};
