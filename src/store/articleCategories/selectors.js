import _ from 'lodash';

export function getItems(state) {
    return state.articleCategories.itemsById;
}

export function getItemById(state, id) {
    return state.articleCategories.itemsById['_' + id];
}

export function getCurrentItem(state) {
    return state.articleCategories.currentItemId ? getItemById(state, state.articleCategories.currentItemId) : null;
}

export function getPagination(state) {
    return state.articleCategories.pagination;
}

export function getItemsByPage(state, page) {
    if (!state.articleCategories.idsByPage['_' + page]) {
        page = (getPagination(state)).previousPage;
    }
    return _.map(state.articleCategories.idsByPage['_' + page], (itemId) => {
        return state.articleCategories.itemsById['_' + itemId]
    })
}
