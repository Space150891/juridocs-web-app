import Immutable from 'seamless-immutable';
import { types } from './actions';
import moment from 'moment';
import _ from 'lodash';

const initialState = Immutable({
	itemsByKey: {
		// key: { item }
	},
});

// Clear cached info
function clearCache(state) {
	return state.merge({
		itemsByKey: {},
	})
}

// Save items to store
function fetchAllItemsDone(state, payload) {
	_.map(payload.items, (item) => {
		if (item.imageURL) {
			item.imageURL += `?t=${moment().unix()}`;
		}
		return item;
	});
	return state.merge({
		itemsByKey: _.keyBy(payload.items, item => item.key)
	})
}

export default function reduce(state = initialState, action = {}) {
  	switch (action.type) {
  		case types.CLEAR_CACHE:
  			return clearCache(state);

        case types.FETCH_ALL_ITEMS_DONE:
            return fetchAllItemsDone(state, action.payload);

    	default:
      		return state;
  	}
}