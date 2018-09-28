import _ from 'lodash';

export function getItems(state) {
	return state.users.itemsById;
}

export function getItemsByPage(state, page) {
	if (!state.users.idsByPage['_' + page]) {
		page = (getPagination(state)).previousPage;
	}
	return _.map(state.users.idsByPage['_' + page], (itemId) => {
		return state.users.itemsById['_' + itemId]
	})
}

export function getItemById(state, id) {
	return state.users.itemsById['_' + id];
}

export function getCurrentItem(state) {
	return state.users.currentItemId ? getItemById(state, state.users.currentItemId) : null;
}

export function getFilters(state) {
	return state.users.filters;
}

export function getPagination(state) {
	return state.users.pagination;
}

export function getSorter(state) {
	return state.users.sorter;
}