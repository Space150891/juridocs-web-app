/**
 * Created by Admin on 7/31/2017.
 */
import { browserHistory } from 'react-router';
import api from '../../services/api';
import language from '../../services/language';
import _ from 'lodash';

import * as exceptionsActions from '../exceptions/actions';
import * as blockedGroupsSelectors from './selectors';

export const types = {
    FETCH_ALL_ITEMS_DONE: 'blockedGroups.FETCH_ALL_ITEMS_DONE',
    FETCH_ITEMS_DONE: 'blockedGroups.FETCH_ITEMS_DONE',
    FETCH_ITEM_DONE: 'blockedGroups.FETCH_ITEM_DONE',
    SET_SEARCH_TERM: 'blockedGroups.SET_SEARCH_TERM',
    SET_CURRENT_PAGE: 'blockedGroups.SET_CURRENT_PAGE',
    SET_CURRENT_ITEM_ID: 'blockedGroups.SET_CURRENT_ITEM_ID',
    TOGGLE_SORTER: 'blockedGroups.TOGGLE_SORTER',
    CLEAR_CACHE: 'blockedGroups.CLEAR_CACHE',
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
            await api.put(`/groups/${id}`, params);
            browserHistory.push(`/blockedGroups`);

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
            await api.delete('/groups/' + id);
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
            await api.delete('/blockedGroups/unblock/' + id);
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
            params.set('expand', 'groups.users');

            let items = await api.get('/blockedGroups', params);
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
            let filters = blockedGroupsSelectors.getFilters(state);
            let sorter = blockedGroupsSelectors.getSorter(state);
            let pagination = blockedGroupsSelectors.getPagination(state);
            params.set('expand', 'groups.users');
            params.set('name~', filters.searchTerm);
            params.set('page_size', pagination.pageSize);
            params.set('page_number', deleteCache ? 1 : pagination.currentPage);
            params.set('sort_by', sorter.column);
            params.set('sort_desc', sorter.descending);
            // GET request from API
            let [response, items] = await api.get('/blockedGroups', params, true);
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
            let item = await api.post('/blockedGroups', params);
            browserHistory.push(`users/groups/blockedGroups`);

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
            params.set('expand', 'groups');

            // GET request from API
            let item = await api.get(`/blockedGroups/${id}`, params);
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