export default function getAddresses(publicKey, options) {
  const publicKeyString = publicKey.toString();
  const url = `${options.baseUrl}/public-key/${publicKeyString}/addresses`;

  return fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      if (!Array.isArray(response)) {
        throw new Error(response.error || 'Unknown error when getting addresses.');
      }

      return response;
    });
}
