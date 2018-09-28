import { browserHistory } from 'react-router';
import api from '../../services/api';
import language from '../../services/language';
import _ from 'lodash';

import * as exceptionsActions from '../exceptions/actions';

export const types = {
  FETCH_ALL_ROLES_DONE: 'roles.FETCH_ALL_ROLES_DONE',
}

export function fetchAllRoles() {
  return async (dispatch, getState) => {
    try {
      let params = new Map();
      params.set('language_id', language.get());

      let roles = await api.get('/scopes', params);

      dispatch({
        type: types.FETCH_ALL_ROLES_DONE,
        payload: {
          roles
        }
      });
    } catch (e) {
      dispatch(exceptionsActions.process(e));
    }
  }
}