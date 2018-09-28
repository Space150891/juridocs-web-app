import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../../../services/strings';
import { Link } from 'react-router';
import '../../Page.scss';

import * as genderStringsActions from '../../../store/genderStrings/actions';
import * as genderStringsSelectors from '../../../store/genderStrings/selectors';

import Topbar from '../../../components/Topbar';
import SubTopbar from '../../../components/SubTopbar';
import SearchBar from '../../../components/SearchBar';
import GrammarTabs from '../../../components/grammar/GrammarTabs';
import GenderStringList from '../../../components/grammar/genderString/GenderStringList';
import Pagination from '../../../components/Pagination';

class GenderStringListPage extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillMount() {
        this.props.fetchGenderStrings();
    }

    render() {
        return (
            <div className="GenderStringListPage">
                <Topbar currentLanguage={this.props.currentLanguage} handleLangChange={this.props.handleLangChange}>
                    <div className="title">
                        <Link to="/grammar/gender-strings">{strings.get('App.genderStringPages.title')}</Link>
                    </div>
                    <SearchBar
                        placeholder={ strings.get('App.searchPlaceholders.string') }
                        searchTerm={ this.props.filters.searchTerm }
                        fetchItems={ this.props.fetchGenderStrings }
                        setSearchTerm={ this.props.setSearchTerm }
                    />
                    <div className="main-btns">
                        <Link to="/grammar/gender-strings/add" className="btn btn-primary">{strings.get('App.genderStringPages.addString')}</Link>
                    </div>
                </Topbar>
                <SubTopbar>
                    <GrammarTabs />
                </SubTopbar>

                <div className="content">
                    <GenderStringList
                        items={ this.props.genderStrings }
                        sorter={ this.props.sorter }
                        currentItem={ this.props.currentGenderString }
                        fetchItems={ this.props.fetchGenderStrings }
                        setCurrentItemId={ this.props.setCurrentGenderStringId }
                        unsetCurrentItemId={ this.props.unsetCurrentGenderStringId }
                        deleteItem={ this.props.deleteGenderString }
                        toggleSorter={ this.props.toggleSorter }
                    />

                    <Pagination
                        pagination={ this.props.pagination }
                        setCurrentPage={ this.props.setCurrentPage }
                        fetchItems={ this.props.fetchGenderStrings }
                    />
                </div>
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        genderStrings: genderStringsSelectors.getItemsByPage(state, (genderStringsSelectors.getPagination(state)).currentPage),
        sorter: genderStringsSelectors.getSorter(state),
        filters: genderStringsSelectors.getFilters(state),
        pagination: genderStringsSelectors.getPagination(state),
        currentGenderString: genderStringsSelectors.getCurrentItem(state),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchGenderStrings: (deleteCache) => {
            dispatch(genderStringsActions.fetchItems(deleteCache))
        },
        setSearchTerm: (searchTerm) => {
            dispatch(genderStringsActions.setSearchTerm(searchTerm))
        },
        toggleSorter: (searchTerm) => {
            dispatch(genderStringsActions.toggleSorter(searchTerm))
        },
        setCurrentPage: (page) => {
            dispatch(genderStringsActions.setCurrentPage(page))
        },
        setCurrentGenderStringId: (id) => {
            dispatch(genderStringsActions.setCurrentItemId(id))
        },
        unsetCurrentGenderStringId: () => {
            dispatch(genderStringsActions.unsetCurrentItemId())
        },
        deleteGenderString: (id) => {
            dispatch(genderStringsActions.deleteItem(id))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GenderStringListPage);