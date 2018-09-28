import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../../services/strings';
import { Link } from 'react-router';
import '../Page.scss';

import * as groupsActions from '../../store/groups/actions';
import * as groupsSelectors from '../../store/groups/selectors';

import Topbar from '../../components/Topbar';
import SearchBar from '../../components/SearchBar';
import GroupList from '../../components/group/GroupList';
import Pagination from '../../components/Pagination';

class GroupListPage extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillMount() {
        this.props.fetchGroups();
    }

    render() {
        return (
            <div className="GroupListPage">
                <Topbar currentLanguage={this.props.currentLanguage} handleLangChange={this.props.handleLangChange}>
                    <div className="title">
                        <Link to="/users">{strings.get('App.groupPages.users')}</Link>
                        <span className="hidden-xs">
                            <span className="divider">/</span>
                            <Link to="/users/groups">{strings.get('App.groupPages.title')}</Link>
                        </span>
                    </div>
                    <SearchBar
                        placeholder={ strings.get('App.searchPlaceholders.group') }
                        searchTerm={ this.props.filters.searchTerm }
                        fetchItems={ this.props.fetchGroups }
                        setSearchTerm={ this.props.setSearchTerm }
                    />
                    <div className="main-btns">
                        <Link to="/users" className="btn btn-default">{strings.get('App.groupPages.manage')}</Link>
                    </div>
                    <div className="main-btns">
                        <Link to="/users/groups/add" className="btn btn-primary">{strings.get('App.groupPages.addGroup')}</Link>
                    </div>
                    <div className="main-btns">
                        <Link to="/users/groups/blockedGroups" className="btn btn-primary">{strings.get('App.groupPages.blockedGroups')}</Link>
                    </div>
                </Topbar>

                <div className="content">
                    <GroupList
                        items={ this.props.groups }
                        sorter={ this.props.sorter }
                        currentItem={ this.props.currentGroup }
                        fetchItems={ this.props.fetchGroups }
                        setCurrentItemId={ this.props.setCurrentGroupId }
                        unsetCurrentItemId={ this.props.unsetCurrentGroupId }
                        deleteItem={ this.props.deleteGroup }
                        blockItem={ this.props.blockGroup }
                        toggleSorter={ this.props.toggleSorter }
                    />

                    <Pagination
                        pagination={ this.props.pagination }
                        setCurrentPage={ this.props.setCurrentPage }
                        fetchItems={ this.props.fetchGroups }
                    />
                </div>
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        groups: groupsSelectors.getItemsByPage(state, (groupsSelectors.getPagination(state)).currentPage),
        sorter: groupsSelectors.getSorter(state),
        filters: groupsSelectors.getFilters(state),
        pagination: groupsSelectors.getPagination(state),
        currentGroup: groupsSelectors.getCurrentItem(state),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchGroups: (deleteCache) => {
            dispatch(groupsActions.fetchItems(deleteCache))
        },
        setSearchTerm: (searchTerm) => {
            dispatch(groupsActions.setSearchTerm(searchTerm))
        },
        toggleSorter: (searchTerm) => {
            dispatch(groupsActions.toggleSorter(searchTerm))
        },
        setCurrentPage: (page) => {
            dispatch(groupsActions.setCurrentPage(page))
        },
        setCurrentGroupId: (id) => {
            dispatch(groupsActions.setCurrentItemId(id))
        },
        unsetCurrentGroupId: () => {
            dispatch(groupsActions.unsetCurrentItemId())
        },
        deleteGroup: (id) => {
            dispatch(groupsActions.deleteItem(id))
        },
        blockGroup: (id,data) => {
            dispatch(groupsActions.blockItem(id,data))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupListPage);