import * as actions from '../actions';

export default function addressesItems(state = {}, action) {
  let newState;
  let address;

  switch (action.type) {
    case actions.DELETE_ADDRESSES_SUCCESS:
      return {};

    case actions.READ_ADDRESSES_SUCCESS:
      return action.addresses;

    case actions.ADD_ADDRESS_SUCCESS:
    case actions.UPDATE_ADDRESS_SUCCESS:
      address = { ...action.address };

      return {
        ...state,
        [action.address.id]: address
      };

    case actions.DELETE_ADDRESS_SUCCESS:
      newState = { ...state };
      delete newState[action.address.id];
      return newState;

    default:
      return state;
  }
}
