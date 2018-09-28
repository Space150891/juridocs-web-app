import { browserHistory } from 'react-router';
import api from '../../services/api';
import auth from '../../services/auth';
import * as exceptionsActions from '../exceptions/actions';

export const types = {
	GET_TOKEN_DONE: 'auth.GET_TOKEN_DONE'
}

export function login(data) {
	return async (dispatch) => {
		try {
			let params = new Map();
			_.map(data, (value, key) => {
				params.set(key, value);
			});
			// POST request to API
			let payload = await api.post('/auth/login', params);

			if (payload.token) {
				auth.setLocalAccessToken(payload.token);
				browserHistory.push('/documents');
			}
		} catch (e) {
			dispatch(exceptionsActions.process(e));
		}
	}
}

export function logout() {
	return async (dispatch) => {
		localStorage.clear();
		browserHistory.push('/login');
	}
}