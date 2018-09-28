import _ from 'lodash';

export function getItems(state) {
	return state.settings.itemsByKey;
}

export function getItemByKey(state, key) {
	return state.settings.itemsByKey[key];
}