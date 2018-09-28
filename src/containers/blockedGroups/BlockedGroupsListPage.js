/**
 * Created by Admin on 7/31/2017.
 */
/**
 * Created by Admin on 7/25/2017.
 */
import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../../services/strings';
import { Link } from 'react-router';
import '../Page.scss';

import * as blockedGroupsActions from '../../store/blockedGroups/actions';
import * as GroupsActions from '../../store/groups/actions';
import * as blockedGroupsSelectors from '../../store/blockedGroups/selectors';

import Topbar from '../../components/Topbar';
import SearchBar from '../../components/SearchBar';
import BlockedGroupsList from '../../components/blockedGroups/BlockedGroupList';
import Pagination from '../../components/Pagination';

class BlockedGroupsListPage extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillMount() {
        this.props.fetchBlockedGroups();
    }

    componentWillUnmount() {
        this.props.unsetCurrentBlockedGroupId();
        this.props.clearExceptions();
    }

    render() {
        return (
            <div className="GroupListPage">
                <Topbar currentLanguage={this.props.currentLanguage} handleLangChange={this.props.handleLangChange}>
                    <div className="title">
                        <Link to="/users/groups">{strings.get('App.blockedGroups.listPage.title')}</Link>
                        <span className="hidden-xs">
                            <span className="divider">/</span>
                            <Link to="/users/groups/blockedGroups">{strings.get('App.blockedGroups.listPage.blockedGroups')}</Link>
                        </span>
                    </div>
                    <SearchBar
                        placeholder={ strings.get('App.searchPlaceholders.blockedGroup') }
                        searchTerm={ this.props.filters.searchTerm }
                        fetchItems={ this.props.fetchBlockedGroups }
                        setSearchTerm={ this.props.setSearchTerm }
                    />
                </Topbar>

                <div className="content">
                    <BlockedGroupsList
                        currentItem={ this.props.currentItem }
                        setCurrentItemId={ this.props.setCurrentBlockedGroupId }
                        unsetCurrentItemId={ this.props.unsetCurrentBlockedGroupId }
                        deleteItem={ this.props.deleteGroup }
                        unBlockItem={ this.props.unBlockGroup }
                        items={ this.props.blockedGroups }
                        fetchItems={ this.props.fetchBlockedGroups }
                    />

                    <Pagination
                        pagination={ this.props.pagination }
                        setCurrentPage={ this.props.setCurrentPage }
                        fetchItems={ this.props.fetchBlockedGroups }
                    />
                </div>
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        blockedGroups: blockedGroupsSelectors.getItemsByPage(state, (blockedGroupsSelectors.getPagination(state)).currentPage),
        sorter: blockedGroupsSelectors.getSorter(state),
        filters: blockedGroupsSelectors.getFilters(state),
        pagination: blockedGroupsSelectors.getPagination(state),
        currentItem: blockedGroupsSelectors.getCurrentItem(state),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchBlockedGroups: (deleteCache) => {
            dispatch(blockedGroupsActions.fetchItems(deleteCache))
        },
        setSearchTerm: (searchTerm) => {
            dispatch(blockedGroupsActions.setSearchTerm(searchTerm))
        },
        setCurrentPage: (page) => {
            dispatch(blockedGroupsActions.setCurrentPage(page))
        },
        setCurrentBlockedGroupId: (id) => {
            dispatch(blockedGroupsActions.setCurrentItemId(id))
        },
        unsetCurrentBlockedGroupId: () => {
            dispatch(blockedGroupsActions.unsetCurrentItemId())
        },
        deleteGroup: (id) => {
            dispatch(GroupsActions.deleteItem(id))
        },
        unBlockGroup: (id, data) => {
            dispatch(blockedGroupsActions.unBlockItem(id, data))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BlockedGroupsListPage);