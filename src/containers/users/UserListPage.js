import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../../services/strings';
import { Link } from 'react-router';
import '../Page.scss';

import * as usersActions from '../../store/users/actions';
import * as usersSelectors from '../../store/users/selectors';

import Topbar from '../../components/Topbar';
import SearchBar from '../../components/SearchBar';
import UserList from '../../components/user/UserList';
import Pagination from '../../components/Pagination';

class UserListPage extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillMount() {
        this.props.fetchUsers();
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
                        <Link to="/users">{strings.get('App.userPages.title')}</Link>
                    </div>
                    <SearchBar
                        placeholder={ strings.get('App.searchPlaceholders.user') }
                        searchTerm={ this.props.filters.searchTerm }
                        fetchItems={ this.props.fetchUsers }
                        setSearchTerm={ this.props.setSearchTerm }
                    />
                    <div className="main-btns">
                        <Link to="/users/groups" className="btn btn-default">{strings.get('App.userPages.manage')}</Link>
                    </div>
                    <div className="main-btns">
                      <Link to="/users/add" className="btn btn-primary">{strings.get('App.userPages.addUser')}</Link>
                    </div>
                    <div className="main-btns">
                      <Link to="users/blockedUsers/" className="btn btn-primary">{strings.get('App.userPages.blockedUsers')}</Link>
                    </div>
                </Topbar>

                <div className="content">
                    <UserList
                        currentItem={ this.props.currentItem }
                        setCurrentItemId={ this.props.setCurrentUserId }
                        unsetCurrentItemId={ this.props.unsetCurrentUserId }
                        deleteItem={ this.props.deleteUser }
                        blockItem={ this.props.blockUser }
                        items={ this.props.users }
                        fetchItems={ this.props.fetchUsers }
                    />

                    <Pagination
                        pagination={ this.props.pagination }
                        setCurrentPage={ this.props.setCurrentPage }
                        fetchItems={ this.props.fetchUsers }
                    />
                </div>
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        users: usersSelectors.getItemsByPage(state, (usersSelectors.getPagination(state)).currentPage),
        sorter: usersSelectors.getSorter(state),
        filters: usersSelectors.getFilters(state),
        pagination: usersSelectors.getPagination(state),
        currentItem: usersSelectors.getCurrentItem(state),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchUsers: (deleteCache) => {
            dispatch(usersActions.fetchItems(deleteCache))
        },
        setSearchTerm: (searchTerm) => {
            dispatch(usersActions.setSearchTerm(searchTerm))
        },
        setCurrentPage: (page) => {
            dispatch(usersActions.setCurrentPage(page))
        },
        fetchAllUsers: (deleteCache) => {
          dispatch(usersActions.fetchAllItems(deleteCache))
        },
        setCurrentUserId: (id) => {
          dispatch(usersActions.setCurrentItemId(id))
        },
        fetchUser: (id) => {
          dispatch(usersActions.fetchItem(id))
        },
        unsetCurrentUserId: () => {
          dispatch(usersActions.unsetCurrentItemId())
        },
        updateUser: (id, data) => {
          dispatch(usersActions.updateItem(id, data))
        },
        deleteUser: (id) => {
          dispatch(usersActions.deleteItem(id))
        },
        blockUser: (id, data) => {
            dispatch(usersActions.blockItem(id, data))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserListPage);