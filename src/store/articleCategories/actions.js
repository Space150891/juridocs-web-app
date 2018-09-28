import api from '../../services/api';
import language from '../../services/language';
import _ from 'lodash';
import { browserHistory } from 'react-router';

import * as exceptionsActions from '../exceptions/actions';
import * as articleCategoriesSelectors from './selectors';

export const types = {
    FETCH_ALL_ITEMS_DONE: 'articleCategories.FETCH_ALL_ITEMS_DONE',
    FETCH_ITEMS_DONE: 'articleCategories.FETCH_ITEMS_DONE',
    FETCH_ITEM_DONE: 'articleCategories.FETCH_ITEM_DONE',
    SET_SEARCH_TERM: 'articleCategories.SET_SEARCH_TERM',
    SET_CURRENT_PAGE: 'articleCategories.SET_CURRENT_PAGE',
    SET_CURRENT_ITEM_ID: 'articleCategories.SET_CURRENT_ITEM_ID',
    TOGGLE_SORTER: 'articleCategories.TOGGLE_SORTER',
    CLEAR_CACHE: 'articleCategories.CLEAR_CACHE',
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

export function clearCache() {
    return {
        type: types.CLEAR_CACHE
    }
}

export function fetchAllItems() {
    return async (dispatch) => {
        try {
            let params = new Map();
            params.set('expand', 'article');
            params.set('language_id', language.get());
            let items = await api.get('/articleCategories', params);
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

export function fetchItem(id) {
    return async (dispatch) => {
        try {
            // GET request from API
            let item = await api.get(`/articleCategories/${id}`);
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

export function fetchItems(deleteCache = false) {
    return async (dispatch, getState) => {
        //let state = getState();
        try {
            // Set additional params
            let params = new Map();
            params.set('language_id', language.get());
            // let pagination = articleCategoriesSelectors.getPagination(state);
            // params.set('page_size', pagination.pageSize);
            // params.set('page_number', deleteCache ? 1 : pagination.currentPage);

            // GET request from API
            let [response, items] = await api.get('/articleCategories', params, true);

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
            });
            // POST request to API
            params.set('language_id', language.get());
            await api.post(`/articleCategories`, params);
            browserHistory.push('/articleCategories');

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
            });
            // PUT request to API
            params.set('language_id', language.get());
            await api.put(`/articleCategories/${id}`, params);
            browserHistory.push(`/articleCategories`);

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
            params.set('language_id', language.get());
            await api.postFiles(`/articleCategories/${id}/image`, params);

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
            });
            // POST request to API
            params.set('language_id', language.get());
            let item = await api.post('/articleCategories', params);
            browserHistory.push(`/articleCategories`);

            params = new Map();
            params.set('file', file);
            // POST request to API for Upload
            await api.postFiles(`/articleCategories/${item.id}/image`, params);

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
            await api.delete(`/articleCategories/${id}`);

            dispatch(fetchItems());
            dispatch(exceptionsActions.clear());
        } catch (e) {
            dispatch(exceptionsActions.process(e));
        }
    }
}