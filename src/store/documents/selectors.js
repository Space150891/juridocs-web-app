import _ from 'lodash';

export function getItems(state) {
	return state.documents.itemsById;
}

export function getItemsByPage(state, page) {
	if (!state.documents.idsByPage['_' + page]) {
		page = (getPagination(state)).previousPage;
	}
	return _.map(state.documents.idsByPage['_' + page], (itemId) => {
		return state.documents.itemsById['_' + itemId]
	})
}

export function getItemById(state, id) {
	return state.documents.itemsById['_' + id];
}

export function getCurrentItem(state) {
	return state.documents.currentItemId ? getItemById(state, state.documents.currentItemId) : null;
}

export function getFilters(state) {
	return state.documents.filters;
}

export function getPagination(state) {
	return state.documents.pagination;
}

export function getSorter(state) {
	return state.documents.sorter;
}

export function getFields(state){
    return state.documents.fields;
}

export function getFieldsOrder(state){
    return state.documents.fieldsOrder;
}

export function getSelectors(state){
    return state.documents.selectors;
}

export function getClauses(state){
    return state.documents.clauses;
}

export function getSteps(state){
    return state.documents.steps;
}