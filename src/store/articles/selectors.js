import _ from 'lodash';

export function getItems(state) {
    return state.articles.itemsById;
}

export function getItemById(state, id) {
    return state.articles.itemsById['_' + id];
}

export function getCurrentItem(state) {
    return state.articles.currentItemId ? getItemById(state, state.articles.currentItemId) : null;
}

export function getPagination(state) {
    return state.articles.pagination;
}

export function getItemsByPage(state, page) {
    if (!state.articles.idsByPage['_' + page]) {
        page = (getPagination(state)).previousPage;
    }
    return _.map(state.articles.idsByPage['_' + page], (itemId) => {
        return state.articles.itemsById['_' + itemId]
    })
}
