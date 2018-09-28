import api from '../../services/api';
import language from '../../services/language';
import _ from 'lodash';
import { browserHistory } from 'react-router';

import * as exceptionsActions from '../exceptions/actions';
import * as articlesSelectors from './selectors';

export const types = {
    FETCH_ALL_ITEMS_DONE: 'articles.FETCH_ALL_ITEMS_DONE',
    FETCH_ITEMS_DONE: 'articles.FETCH_ITEMS_DONE',
    FETCH_ITEM_DONE: 'articles.FETCH_ITEM_DONE',
    SET_SEARCH_TERM: 'articles.SET_SEARCH_TERM',
    SET_CURRENT_PAGE: 'articles.SET_CURRENT_PAGE',
    SET_CURRENT_ITEM_ID: 'articles.SET_CURRENT_ITEM_ID',
    TOGGLE_SORTER: 'articles.TOGGLE_SORTER',
    CLEAR_CACHE: 'articles.CLEAR_CACHE',
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
            let item = await api.get(`/articles/${id}`);
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
            // let pagination = articlesSelectors.getPagination(state);
            // params.set('page_size', pagination.pageSize);
            // params.set('page_number', deleteCache ? 1 : pagination.currentPage);
            params.set('language_id', language.get());
            // GET request from API
            let [response, items] = await api.get('/articles', params, true);

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
            await api.post(`/articles`, params);
            browserHistory.push('/articles');

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
            await api.put(`/articles/${id}`, params);
            browserHistory.push(`/articles`);

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
            await api.postFiles(`/articles/${id}/image`, params);

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
            let item = await api.post('/articles', params);
            browserHistory.push(`/articles`);

            params = new Map();
            params.set('file', file);
            // POST request to API for Upload
            await api.postFiles(`/articles/${item.id}/image`, params);

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
            await api.delete(`/articles/${id}`);

            dispatch(fetchItems());
            dispatch(exceptionsActions.clear());
        } catch (e) {
            dispatch(exceptionsActions.process(e));
        }
    }
}