import Immutable from 'seamless-immutable';
import { types } from './actions';
import moment from 'moment';
import _ from 'lodash';

const initialState = Immutable({
	opened: false,
});

// Toggle sidebar
function toggle(state) {
	return state.merge({
		opened: !state.opened,
	})
}

export default function reduce(state = initialState, action = {}) {
  	switch (action.type) {
  		case types.TOGGLE:
  			return toggle(state);

    	default:
      		return state;
  	}
}