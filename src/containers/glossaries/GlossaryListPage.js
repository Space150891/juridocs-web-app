import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../../services/strings';
import { Link } from 'react-router';
import '../Page.scss';

import * as glossariesActions from '../../store/glossaries/actions';
import * as glossariesSelectors from '../../store/glossaries/selectors';

import Topbar from '../../components/Topbar';
import SubTopbar from '../../components/SubTopbar';
import SearchBar from '../../components/SearchBar';
import GlossaryList from '../../components/glossary/GlossaryList';
import Pagination from '../../components/Pagination';

class GlossaryListPage extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillMount() {
        this.props.fetchGlossaries();
    }

    render() {
        return (
            <div className="GlossaryListPage">
                <Topbar currentLanguage={this.props.currentLanguage} handleLangChange={this.props.handleLangChange}>
                    <div className="title">
                        <Link to="/glossaries">{strings.get('App.glossaryPage.title')}</Link>
                    </div>
                    <SearchBar
                        placeholder={ strings.get('App.searchPlaceholders.glossary') }
                        searchTerm={ this.props.filters.searchTerm }
                        fetchItems={ this.props.fetchGlossaries }
                        setSearchTerm={ this.props.setSearchTerm }
                    />
                    <div className="main-btns">
                        <Link to="/glossaries/steps" className="btn btn-default">{strings.get('App.glossaryPages.manage')}</Link>
                        <Link to="/glossaries/add" className="btn btn-primary">{strings.get('App.glossaryPages.addGlossary')}</Link>
                    </div>
                </Topbar>

                <div className="content">
                    <GlossaryList
                        items={ this.props.glossaries }
                        sorter={ this.props.sorter }
                        currentItem={ this.props.currentGlossary }
                        fetchItems={ this.props.fetchGlossaries }
                        setCurrentItemId={ this.props.setCurrentGlossaryId }
                        unsetCurrentItemId={ this.props.unsetCurrentGlossaryId }
                        deleteItem={ this.props.deleteGlossary }
                        toggleSorter={ this.props.toggleSorter }
                    />

                    <Pagination
                        pagination={ this.props.pagination }
                        setCurrentPage={ this.props.setCurrentPage }
                        fetchItems={ this.props.fetchGlossaries }
                    />
                </div>
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        glossaries: glossariesSelectors.getItemsByPage(state, (glossariesSelectors.getPagination(state)).currentPage),
        sorter: glossariesSelectors.getSorter(state),
        filters: glossariesSelectors.getFilters(state),
        pagination: glossariesSelectors.getPagination(state),
        currentGlossary: glossariesSelectors.getCurrentItem(state),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchGlossaries: (deleteCache) => {
            dispatch(glossariesActions.fetchItems(deleteCache))
        },
        setSearchTerm: (searchTerm) => {
            dispatch(glossariesActions.setSearchTerm(searchTerm))
        },
        toggleSorter: (searchTerm) => {
            dispatch(glossariesActions.toggleSorter(searchTerm))
        },
        setCurrentPage: (page) => {
            dispatch(glossariesActions.setCurrentPage(page))
        },
        setCurrentGlossaryId: (id) => {
            dispatch(glossariesActions.setCurrentItemId(id))
        },
        unsetCurrentGlossaryId: () => {
            dispatch(glossariesActions.unsetCurrentItemId())
        },
        deleteGlossary: (id) => {
            dispatch(glossariesActions.deleteItem(id))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GlossaryListPage);