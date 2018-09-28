/**
 * Created by Admin on 7/25/2017.
 */
import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../../services/strings';
import { Link } from 'react-router';
import '../Page.scss';

import * as blockedUsersActions from '../../store/blockedUsers/actions';
import * as UsersActions from '../../store/users/actions';
import * as blockedUsersSelectors from '../../store/blockedUsers/selectors';

import Topbar from '../../components/Topbar';
import SearchBar from '../../components/SearchBar';
import BlockedUserList from '../../components/blockedUsers/BlockedUserList';
import Pagination from '../../components/Pagination';

class BlockedUsersListPage extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillMount() {
        this.props.fetchBlockedUsers();
    }

    componentWillUnmount() {
        this.props.unsetCurrentUserId();
        this.props.clearExceptions();
    }

    render() {
        return (
            <div className="UserListPage">
                <Topbar currentLanguage={this.props.currentLanguage} handleLangChange={this.props.handleLangChange}>
                    <div className="title">
                        <Link to="/users">{strings.get('App.blockedUsers.listPage.title')}</Link>
                        <span className="hidden-xs">
                            <span className="divider">/</span>
                            <Link to="/users/blockedUsers">{strings.get('App.blockedUsers.listPage.blockedUsers')}</Link>
                        </span>
                    </div>
                    <SearchBar
                        placeholder={ strings.get('App.searchPlaceholders.blockedUser') }
                        searchTerm={ this.props.filters.searchTerm }
                        fetchItems={ this.props.fetchBlockedUsers }
                        setSearchTerm={ this.props.setSearchTerm }
                    />
                </Topbar>

                <div className="content">
                    <BlockedUserList
                        currentItem={ this.props.currentItem }
                        setCurrentItemId={ this.props.setCurrentUserId }
                        unsetCurrentItemId={ this.props.unsetCurrentUserId }
                        deleteItem={ this.props.deleteUser }
                        unBlockItem={ this.props.unBlockUser }
                        items={ this.props.blockedUsers }
                        fetchItems={ this.props.fetchBlockedUsers }
                    />

                    <Pagination
                        pagination={ this.props.pagination }
                        setCurrentPage={ this.props.setCurrentPage }
                        fetchItems={ this.props.fetchBlockedUsers }
                    />
                </div>
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        blockedUsers: blockedUsersSelectors.getItemsByPage(state, (blockedUsersSelectors.getPagination(state)).currentPage),
        sorter: blockedUsersSelectors.getSorter(state),
        filters: blockedUsersSelectors.getFilters(state),
        pagination: blockedUsersSelectors.getPagination(state),
        currentItem: blockedUsersSelectors.getCurrentItem(state),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchBlockedUsers: (deleteCache) => {
            dispatch(blockedUsersActions.fetchItems(deleteCache))
        },
        setSearchTerm: (searchTerm) => {
            dispatch(blockedUsersActions.setSearchTerm(searchTerm))
        },
        setCurrentPage: (page) => {
            dispatch(blockedUsersActions.setCurrentPage(page))
        },
        fetchAllUsers: (deleteCache) => {
            dispatch(blockedUsersActions.fetchAllItems(deleteCache))
        },
        setCurrentUserId: (id) => {
            dispatch(blockedUsersActions.setCurrentItemId(id))
        },
        fetchUser: (id) => {
            dispatch(blockedUsersActions.fetchItem(id))
        },
        unsetCurrentUserId: () => {
            dispatch(blockedUsersActions.unsetCurrentItemId())
        },
        updateUser: (id, data) => {
            dispatch(blockedUsersActions.updateItem(id, data))
        },
        deleteUser: (id) => {
            dispatch(UsersActions.deleteItem(id))
        },
        unBlockUser: (id) => {
            dispatch(blockedUsersActions.unBlockItem(id))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BlockedUsersListPage);