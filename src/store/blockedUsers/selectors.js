import _ from 'lodash';

export function getItems(state) {
    return state.blockedUsers.itemsById;
}

export function getItemsByPage(state, page) {
    if (!state.blockedUsers.idsByPage['_' + page]) {
        page = (getPagination(state)).previousPage;
    }
    return _.map(state.blockedUsers.idsByPage['_' + page], (itemId) => {
        return state.blockedUsers.itemsById['_' + itemId]
    })
}

export function getItemById(state, id) {
    return state.blockedUsers.itemsById['_' + id];
}

export function getCurrentItem(state) {
    return state.blockedUsers.currentItemId ? getItemById(state, state.blockedUsers.currentItemId) : null;
}

export function getFilters(state) {
    return state.blockedUsers.filters;
}

export function getPagination(state) {
    return state.blockedUsers.pagination;
}

export function getSorter(state) {
    return state.blockedUsers.sorter;
}/**
 * Created by Admin on 7/25/2017.
 */
