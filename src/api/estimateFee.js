export default function estimateFee(options) {
  const url = `${options.baseUrl}/fee/estimate`;

  return fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      if (typeof response.satoshisPerByte !== 'number') {
        throw new Error(response.error || 'Unknown error when estimating fee.');
      }

      if (response.satoshisPerByte < 0) {
        throw new Error('Unable to estimate the fee. Please try again later.');
      }

      return response.satoshisPerByte;
    });
}
