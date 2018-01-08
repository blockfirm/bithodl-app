import * as actions from '../actions';

export default function wallet(state = {}, action) {
  switch (action.type) {
    case actions.CREATE_WALLET_SUCCESS:
    case actions.GET_WALLET_SUCCESS:
      return {
        ...state,
        ...action.metadata
      };

    case actions.CREATE_WALLET_FAILURE:
    case actions.GET_WALLET_FAILURE:
      return {
        error: action.error
      };

    case actions.DELETE_WALLET_SUCCESS:
      return {};

    case actions.DELETE_WALLET_FAILURE:
      return {
        ...state,
        error: action.error
      };

    case actions.SYNC_WALLET_REQUEST:
      return {
        ...state,
        syncing: true
      };

    case actions.SYNC_WALLET_SUCCESS:
    case actions.SYNC_WALLET_FAILURE:
      return {
        ...state,
        syncing: false
      };

    default:
      return state;
  }
}
