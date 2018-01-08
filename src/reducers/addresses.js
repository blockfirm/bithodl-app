import * as actions from '../actions';
import addressesError from './addressesError';
import addressesItems from './addressesItems';

export default function addresses(state = {}, action) {
  switch (action.type) {
    case actions.DELETE_ADDRESSES_REQUEST:
    case actions.DELETE_ADDRESSES_SUCCESS:
    case actions.DELETE_ADDRESSES_FAILURE:

    case actions.READ_ADDRESSES_REQUEST:
    case actions.READ_ADDRESSES_SUCCESS:
    case actions.READ_ADDRESSES_FAILURE:

    case actions.WRITE_ADDRESSES_REQUEST:
    case actions.WRITE_ADDRESSES_SUCCESS:
    case actions.WRITE_ADDRESSES_FAILURE:

    case actions.ADD_ADDRESS_SUCCESS:
    case actions.CREATE_ADDRESS_SUCCESS:
    case actions.DELETE_ADDRESS_SUCCESS:
    case actions.UPDATE_ADDRESS_SUCCESS:
      return {
        ...state,
        error: addressesError(state.error, action),
        items: addressesItems(state.items, action)
      };

    default:
      return state;
  }
}
