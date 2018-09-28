import Immutable from 'seamless-immutable';
import { types } from './actions';
import moment from 'moment';
import _ from 'lodash';

const initialState = Immutable({
  roles: {
  },
});

// Save items to store
function fetchAllRolesDone(state, payload) {
  return state.merge({
    roles: payload.roles
  })
}

export default function reduce(state = initialState, action = {}) {
    switch (action.type) {
      case types.FETCH_ALL_ROLES_DONE:
          return fetchAllRolesDone(state, action.payload);
      default:
          return state;
    }
}