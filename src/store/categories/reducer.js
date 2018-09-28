import Immutable from 'seamless-immutable';
import { types } from './actions';
import moment from 'moment';
import _ from 'lodash';

const initialState = Immutable({
	filters: {
		searchTerm: ''
	},
	sort: null,
	pagination: {
		currentPage: 1,
		previousPage: 1,
		pageSize: 10,
		totalPages: 1,
	},
	currentItemId: null,
	subCategories: [],
	itemsById: {
		// _id: {item_details}
	},
	idsByPage: {
		_1: []
	}
});

// Set current page for items list
function setCurrentPage(state, payload) {
	return state.merge({
		pagination: {
			currentPage: payload.page,
			previousPage: state.pagination.currentPage
		}
	}, {deep: true})
}

// Set the id of current item
function setCurrentItemId(state, payload) {
	return state.merge({
		currentItemId: payload.id
	})
}

// Change and toggle sorter
function toggleSorter(state, payload) {
	return state.merge({
		sort: payload.column
	});
}

// Clear cached info
function clearCache(state) {
	return state.merge({
		filters: state.filters,
		sort: state.sort,
		subCategories: [],
		pagination: {
			currentPage: 1,
			previousPage: 1,
			pageSize: 10,
			totalPages: 1,
		},
		itemsById: {},
		idsByPage: {
			_1: []
		}
	})
}

// Set current search term
function setSearchTerm(state, payload) {
	return state.merge({
		filters: {
			searchTerm: payload.searchTerm
		}
	}, {deep: true});
}

// Save item to store
function fetchItemDone(state, payload) {
	let newState = {
		itemsById: {}
	}
	if (payload.item.imageURL) {
		payload.item.imageURL += `?t=${moment().unix()}`;
	}
	newState['itemsById']['_' + payload.item.id] = payload.item;
	return state.merge(newState, {deep: true})
}

// Save items to store
function fetchItemsDone(state, payload) {

	const basicCategories = _.filter(payload.items, item => (item.parent_id == null));
	const subCategories = _.filter(payload.items, item => (item.parent_id != null));

	let newState = {
		pagination: {
			totalPages: Math.ceil(basicCategories.length/state.pagination.pageSize)
		},
		itemsById: {},
		idsByPage: {},
		subCategories,
	}

	_.map(basicCategories, (item, key) => {
		let pages = Math.ceil((key+1)/state.pagination.pageSize);
		if(!_.isArray(newState['idsByPage']['_' + pages])) {
			newState['idsByPage']['_' + pages] = [];
		}
		newState['idsByPage']['_' + pages].push(item.id);
	});

	_.map(payload.items, (item) => {
		if (item.imageURL) {
			item.imageURL += `?t=${moment().unix()}`;
		}

		newState['itemsById']['_' + item.id] = item;
	})

	return state.merge(newState, {deep: true})
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
		itemsById: _.keyBy(payload.items, (item) => '_' + item.id)
	})
}

export default function reduce(state = initialState, action = {}) {
  	switch (action.type) {
  		case types.CLEAR_CACHE:
  			return clearCache(state);

  		case types.SET_CURRENT_PAGE:
  			return setCurrentPage(state, action.payload);
		
		case types.SET_CURRENT_ITEM_ID:
			return setCurrentItemId(state, action.payload);

  		case types.TOGGLE_SORTER:
  			return toggleSorter(state, action.payload);

  		case types.SET_SEARCH_TERM:
  			return setSearchTerm(state, action.payload);

		case types.FETCH_ITEM_DONE:
	        return fetchItemDone(state, action.payload);

    	case types.FETCH_ITEMS_DONE:
            return fetchItemsDone(state, action.payload);

        case types.FETCH_ALL_ITEMS_DONE:
            return fetchAllItemsDone(state, action.payload);

    	default:
      		return state;
  	}
}