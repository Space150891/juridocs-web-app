/**
 * Created by Admin on 7/31/2017.
 */
import _ from 'lodash';

export function getItems(state) {
    return state.blockedGroups.itemsById;
}

export function getItemsByPage(state, page) {
    if (!state.blockedGroups.idsByPage['_' + page]) {
        page = (getPagination(state)).previousPage;
    }
    return _.map(state.blockedGroups.idsByPage['_' + page], (itemId) => {
        return state.blockedGroups.itemsById['_' + itemId]
    })
}

export function getItemById(state, id) {
    return state.blockedGroups.itemsById['_' + id];
}

export function getCurrentItem(state) {
    return state.blockedGroups.currentItemId ? getItemById(state, state.blockedGroups.currentItemId) : null;
}

export function getFilters(state) {
    return state.blockedGroups.filters;
}

export function getPagination(state) {
    return state.blockedGroups.pagination;
}

export function getSorter(state) {
    return state.blockedGroups.sorter;
}