import api from '../api';

export const ESTIMATE_FEE_REQUEST = 'ESTIMATE_FEE_REQUEST';
export const ESTIMATE_FEE_SUCCESS = 'ESTIMATE_FEE_SUCCESS';
export const ESTIMATE_FEE_FAILURE = 'ESTIMATE_FEE_FAILURE';

const FEE_LEVEL_HIGH = 'high';
const FEE_LEVEL_NORMAL = 'normal';
const FEE_LEVEL_LOW = 'low';
const FEE_LEVEL_VERY_LOW = 'very low';
const FEE_LEVEL_CUSTOM = 'custom';

const adjustFee = (satoshisPerByte, feeLevel) => {
  switch (feeLevel.toLowerCase()) {
    case FEE_LEVEL_HIGH:
      return Math.round(satoshisPerByte * 1.5); // 150%

    case FEE_LEVEL_LOW:
      return Math.round(satoshisPerByte * 0.5); // 50%

    case FEE_LEVEL_VERY_LOW:
      return Math.round(satoshisPerByte * 0.25); // 25%

    case FEE_LEVEL_NORMAL:
    default:
      return satoshisPerByte; // 100%
  }
};

const estimateFeeRequest = () => {
  return {
    type: ESTIMATE_FEE_REQUEST
  };
};

const estimateFeeSuccess = (satoshisPerByte) => {
  return {
    type: ESTIMATE_FEE_SUCCESS,
    satoshisPerByte
  };
};

const estimateFeeFailure = (error) => {
  return {
    type: ESTIMATE_FEE_FAILURE,
    error
  };
};

export const estimateFee = () => {
  return (dispatch, getState) => {
    const settings = getState().settings;
    const feeSettings = settings.bitcoin.fee;
    const options = { baseUrl: settings.api.baseUrl };

    dispatch(estimateFeeRequest());

    if (feeSettings.level.toLowerCase() === FEE_LEVEL_CUSTOM) {
      const satoshisPerByte = feeSettings.satoshisPerByte;
      dispatch(estimateFeeSuccess(satoshisPerByte));
      return Promise.resolve(satoshisPerByte);
    }

    return api.estimateFee(options)
      .then((satoshisPerByte) => {
        const adjustedFee = adjustFee(satoshisPerByte, feeSettings.level);
        dispatch(estimateFeeSuccess(adjustedFee));
        return adjustedFee;
      })
      .catch((error) => {
        dispatch(estimateFeeFailure(error));
        throw error;
      });
  };
};
