export default function postTransaction(transaction, options) {
  const url = `${options.baseUrl}/transaction`;

  const body = {
    transaction: transaction.toString()
  };

  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  };

  return fetch(url, fetchOptions)
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      if (!response.txid) {
        throw new Error(response.error || 'Unknown error when posting transaction.');
      }

      return response;
    });
}
