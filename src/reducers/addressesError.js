import * as actions from '../actions';

export default function addressesError(state = null, action) {
  switch (action.type) {
    case actions.READ_ADDRESSES_REQUEST:
    case actions.WRITE_ADDRESSES_REQUEST:
    case actions.CREATE_ADDRESS_REQUEST:
      return null;

    case actions.READ_ADDRESSES_FAILURE:
    case actions.WRITE_ADDRESSES_FAILURE:
    case actions.CREATE_ADDRESS_FAILURE:
      return action.error;

    default:
      return state;
  }
}
