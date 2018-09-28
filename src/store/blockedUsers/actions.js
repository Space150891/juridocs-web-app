import { browserHistory } from 'react-router';
import api from '../../services/api';
import language from '../../services/language';
import _ from 'lodash';

import * as exceptionsActions from '../exceptions/actions';
import * as blockedUsersSelectors from './selectors';

export const types = {
    FETCH_ALL_ITEMS_DONE: 'blockedUsers.FETCH_ALL_ITEMS_DONE',
    FETCH_ITEMS_DONE: 'blockedUsers.FETCH_ITEMS_DONE',
    FETCH_ITEM_DONE: 'blockedUsers.FETCH_ITEM_DONE',
    SET_SEARCH_TERM: 'blockedUsers.SET_SEARCH_TERM',
    SET_CURRENT_PAGE: 'blockedUsers.SET_CURRENT_PAGE',
    SET_CURRENT_ITEM_ID: 'blockedUsers.SET_CURRENT_ITEM_ID',
    TOGGLE_SORTER: 'blockedUsers.TOGGLE_SORTER',
    CLEAR_CACHE: 'blockedUsers.CLEAR_CACHE',
};

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

export function setSearchTerm(searchTerm) {
    return {
        type: types.SET_SEARCH_TERM,
        payload: {
            searchTerm
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
            await api.put(`/blockedUsers/${id}`, params);
            browserHistory.push(`/blockedUsers`);

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
            await api.delete('/blockedUsers/' + id);
            dispatch(fetchItems());
        } catch (e) {
            dispatch(exceptionsActions.process(e));
        }
    }
}

export function unBlockItem(id){
    return async (dispatch) => {
        try {
            // DELETE request to API
            await api.delete('/blockedUsers/unblock/' + id);
            dispatch(fetchItems());
        } catch (e) {
            dispatch(exceptionsActions.process(e));
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
            params.set('expand', 'users,users.downloads,users.scopes');

            let items = await api.get('/blockedUsers', params);
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
            let filters = blockedUsersSelectors.getFilters(state);
            let sorter = blockedUsersSelectors.getSorter(state);
            let pagination = blockedUsersSelectors.getPagination(state);
            params.set('expand', 'users,users.downloads,users.scopes');
            params.set('first_name~', filters.searchTerm);
            params.set('page_size', pagination.pageSize);
            params.set('page_number', deleteCache ? 1 : pagination.currentPage);
            params.set('sort_by', sorter.column);
            params.set('sort_desc', sorter.descending);
            // GET request from API
            let [response, items] = await api.get('/blockedUsers', params, true);
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

export function createItem(data) {
    return async (dispatch) => {
        try {
            let params = new Map();
            _.map(data, (value, key) => {
                params.set(key, value);
            })
            // POST request to API
            let item = await api.post('/blockedUsers', params);
            browserHistory.push(`users/blockedUsers`);

            dispatch(exceptionsActions.clear());
        } catch (e) {
            dispatch(exceptionsActions.process(e));
        }
    }
}
export function fetchItem(id) {
    return async (dispatch) => {
        try {
            let params = new Map();
            params.set('expand', 'users,users.downloads,users.scopes');

            // GET request from API
            let item = await api.get(`/blockedUsers/${id}`, params);
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