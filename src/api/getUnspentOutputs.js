export default function getUnspentOutputs(address, options) {
  const url = `${options.baseUrl}/address/${address.hash}/utxos`;

  return fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      if (!Array.isArray(response)) {
        throw new Error(response.error || 'Unknown error when getting unspent outputs.');
      }

      return response;
    });
}
