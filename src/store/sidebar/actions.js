import { browserHistory } from 'react-router';
import _ from 'lodash';

export const types = {
	TOGGLE: 'sidebar.TOGGLE',
}

export function toggle(id) {
	return {
		type: types.TOGGLE,
	}
}