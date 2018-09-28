import { browserHistory } from 'react-router';
import api from '../../services/api';
import language from '../../services/language';
import _ from 'lodash';

import * as exceptionsActions from '../exceptions/actions';
import * as documentsSelectors from './selectors';

export const types = {
	FETCH_ALL_ITEMS_DONE: 'documents.FETCH_ALL_ITEMS_DONE',
	FETCH_ITEMS_DONE: 'documents.FETCH_ITEMS_DONE',
	FETCH_ITEM_DONE: 'documents.FETCH_ITEM_DONE',
	VALIDATE_ITEM_DONE: 'documents.VALIDATE_ITEM_DONE',
	SET_SORTER: 'documents.SET_SORTER',
	SET_SEARCH_TERM: 'documents.SET_SEARCH_TERM',
	SET_CATEGORY_ID: 'documents.SET_CATEGORY_ID',
	SET_CURRENT_PAGE: 'documents.SET_CURRENT_PAGE',
	SET_CURRENT_ITEM_ID: 'documents.SET_CURRENT_ITEM_ID',
	TOGGLE_SORTER: 'documents.TOGGLE_SORTER',
	CLEAR_CACHE: 'documents.CLEAR_CACHE',
}

export function setCategoryId(id) {
	return {
		type: types.SET_CATEGORY_ID,
		payload: {
			id
		}
	}
}

export function setCurrentPage(page) {
	return {
		type: types.SET_CURRENT_PAGE,
		payload: {
			page
		}
	}
}

export function setCurrentItemId(id) {
	return {
		type: types.SET_CURRENT_ITEM_ID,
		payload: {
			id
		}
	}
}

export function unsetFieldsOrder() {
	return {
		type: types.VALIDATE_ITEM_DONE,
		payload: {
        	fields: null,
            fieldsOrder: null,
            selectors: null,
            clauses: null,
            steps: null,
    	},
	}
}

export function unsetCurrentItemId() {
	return {
		type: types.SET_CURRENT_ITEM_ID,
		payload: {
			id: null,
		}
	}
}

export function toggleSorter(column) {
	return {
		type: types.TOGGLE_SORTER,
		payload: {
			column
		}
	}
}

export function setSorter(sorter) {
	return {
		type: types.SET_SORTER,
		payload: {
			sorter
		}
	}
}

export function setSearchTerm(searchTerm) {
	return {
		type: types.SET_SEARCH_TERM,
		payload: {
			searchTerm
		}
	}
}

export function clearCache() {
	return {
		type: types.CLEAR_CACHE
	}
}

export function fetchAllItems() {
	return async (dispatch, getState) => {
		try {
			let params = new Map();
			params.set('language_id', language.get());
			params.set('expand', 'downloads');

			let items = await api.get('/documents', params);
			dispatch(clearCache());
			dispatch({
				type: types.FETCH_ALL_ITEMS_DONE,
				payload: {
					items
				}
			});
		} catch (e) {
			dispatch(exceptionsActions.process(e));
		}
	}
}

export function fetchItems(deleteCache = false) {
	return async (dispatch, getState) => {
		let state = getState();
		try {
			// Set additional params
			let params = new Map();
			let filters = documentsSelectors.getFilters(state);
			let sorter = documentsSelectors.getSorter(state);
			let pagination = documentsSelectors.getPagination(state);
			params.set('language_id', language.get());
			params.set('expand', 'downloads');
			params.set('name~', filters.searchTerm);
			params.set('category_id', filters.categoryId ? filters.categoryId : '');
			params.set('page_size', pagination.pageSize);
			params.set('page_number', deleteCache ? 1 : pagination.currentPage);
			params.set('sort_by', sorter.column);
			params.set('sort_desc', sorter.descending);

			// GET request from API
			let [response, items] = await api.get('/documents', params, true);

			// Clear cache if deleteCache is enabled
			if (deleteCache) {
				dispatch(clearCache());
			}

			dispatch({
				type: types.FETCH_ITEMS_DONE,
				payload: {
					totalPages: parseInt(response.headers.get('X-Total-Pages')),
					items
				}
			});
		} catch (e) {
			dispatch(exceptionsActions.process(e));
		}
	}
}

export function fetchItem(id) {
	return async (dispatch) => {
		try {
			let params = new Map();
			params.set('expand', 'downloads');

			// GET request from API
			let item = await api.get(`/documents/${id}`, params);
			dispatch({
				type: types.FETCH_ITEM_DONE,
				payload: {
					item
				}
			})
		} catch (e) {
			dispatch(exceptionsActions.process(e));
		}
	}
}

export function createItem(data) {
	return async (dispatch) => {
		try {
			let params = new Map();
			_.map(data, (value, key) => {
				params.set(key, value);
			})
			// POST request to API
			await api.post('/documents', params);
			browserHistory.push(`/documents`);

			dispatch(exceptionsActions.clear());
		} catch (e) {
			dispatch(exceptionsActions.process(e));
		}
	}
}

export function updateItem(id, data) {
	return async (dispatch) => {
		try {
			let params = new Map();
			_.map(data, (value, key) => {
				params.set(key, value);
			})
			// PUT request to API
			await api.put(`/documents/${id}`, params);
			browserHistory.push(`/documents`);
			
			dispatch(exceptionsActions.clear());
		} catch (e) {
			dispatch(exceptionsActions.process(e));
		}
	}
}

export function updateItemOrder(id, data) {
	return async (dispatch) => {
		try {
			let params = new Map();
			params.set("fields_order",JSON.stringify(data));
			// PUT request to API
			await api.put(`/documents/${id}/order`, params);
			// browserHistory.push(`/documents/${id}`);

			dispatch(exceptionsActions.clear());
		} catch (e) {
			dispatch(exceptionsActions.process(e));
		}
	}
}

export function validateItem(id, data) {
    return async (dispatch) => {
        try {
            let params = new Map();
            _.map(data, (value, key) => {
                params.set(key, value);
            });
            // GET request to API
            let {fields, fieldsOrder, selectors, clauses, steps} = await api.post(`/documents/${id}/validate`, params);

           	dispatch(clearCache());

            dispatch({
				type: types.VALIDATE_ITEM_DONE,
				payload: {
					fields,
					fieldsOrder,
					selectors,
					clauses,
					steps,
				}
			});
            dispatch(exceptionsActions.clear());
        } catch (e) {
            dispatch(exceptionsActions.process(e));
        }
    }
}

export function uploadItemLogo(id, file) {
	return async (dispatch) => {
		try {
			let params = new Map();
			params.set('file', file);
			// POST request to API
			await api.postFiles(`/documents/${id}/image`, params);

			dispatch(fetchItem(id));
		} catch (e) {
			dispatch(exceptionsActions.process(e));
		}
	}
}

export function createItemWithLogo(data, file) {
	return async (dispatch) => {
		try {
			let params = new Map();
			_.map(data, (value, key) => {
				params.set(key, value);
			})
			// POST request to API
			let item = await api.post('/documents', params);
			browserHistory.push(`/documents`);

			params = new Map();
			params.set('file', file);
			// POST request to API for Upload
			await api.postFiles(`/documents/${item.id}/image`, params);

			dispatch(fetchItem(item.id));
			dispatch(exceptionsActions.clear());
		} catch (e) {
			dispatch(exceptionsActions.process(e));
		}
	}
}

export function deleteItem(id) {
	return async (dispatch) => {
		try {
			// DELETE request to API
			await api.delete('/documents/' + id);
			dispatch(fetchItems());
		} catch (e) {
			dispatch(exceptionsActions.process(e));
		}
	}
}