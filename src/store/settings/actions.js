import { browserHistory } from 'react-router';
import api from '../../services/api';
import language from '../../services/language';
import _ from 'lodash';

import * as exceptionsActions from '../exceptions/actions';

export const types = {
	FETCH_ALL_ITEMS_DONE: 'settings.FETCH_ALL_ITEMS_DONE',
	CLEAR_CACHE: 'settings.CLEAR_CACHE',
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

			let items = await api.get('/settings', params);
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

export function updateItem(data) {
	return async (dispatch) => {
		try {
			let params = new Map();
			params.set('value', data.value);
			params.set('language_id', language.get());
			// PUT request to API
			await api.put(`/settings/${data.id}`, params);
			
			fetchAllItems();
			dispatch(exceptionsActions.clear());
		} catch (e) {
			dispatch(exceptionsActions.process(e));
		}
	}
}