import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../../services/strings';
import { Link } from 'react-router';
import '../Page.scss';

import * as documentsActions from '../../store/documents/actions';
import * as documentsSelectors from '../../store/documents/selectors';
import * as categoriesActions from '../../store/categories/actions';
import * as categoriesSelectors from '../../store/categories/selectors';

import Topbar from '../../components/Topbar';
import SubTopbar from '../../components/SubTopbar';
import SearchBar from '../../components/SearchBar';
import DocumentList from '../../components/document/DocumentList';
import DocumentCategoryFilter from '../../components/document/DocumentCategoryFilter';
import DocumentSorter from '../../components/document/DocumentSorter';
import Pagination from '../../components/Pagination';

class DocumentListPage extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillMount() {
        this.props.fetchDocuments();

        this.props.fetchAllCategories();
    }

    render() {
        return (
            <div className="DocumentListPage">
                <Topbar currentLanguage={this.props.currentLanguage} handleLangChange={this.props.handleLangChange}>
                    <div className="title">
                        <Link to="/documents">{strings.get('App.documentPages.title')}</Link>
                    </div>
                    <SearchBar
                        placeholder={ strings.get('App.searchPlaceholders.document') }
                        searchTerm={ this.props.filters.searchTerm }
                        fetchItems={ this.props.fetchDocuments }
                        setSearchTerm={ this.props.setSearchTerm }
                    />
                    <div className="main-btns">
                        <Link to="/documents/add" className="btn btn-primary">{strings.get('App.documentPages.addDocument')}</Link>
                    </div>
                </Topbar>

                <div className="content">
                    <div className="row">
                        <div className="col-xs-6">
                            <DocumentCategoryFilter
                                filters={ this.props.filters }
                                categories={ this.props.categories }
                                fetchItems={ this.props.fetchDocuments }
                                setCategoryId={ this.props.setCategoryId }
                            />
                        </div>
                        <div className="col-xs-6">
                            <DocumentSorter
                                sorter={ this.props.sorter }
                                fetchItems={ this.props.fetchDocuments }
                                setSorter={ this.props.setSorter }
                            />
                        </div>
                    </div>
                    <DocumentList
                        items={ this.props.documents }
                        categories={ this.props.categories }
                        sorter={ this.props.sorter }
                        currentItem={ this.props.currentDocument }
                        fetchItems={ this.props.fetchDocuments }
                        setCurrentItemId={ this.props.setCurrentDocumentId }
                        unsetCurrentItemId={ this.props.unsetCurrentDocumentId }
                        deleteItem={ this.props.deleteDocument }
                        toggleSorter={ this.props.toggleSorter }
                    />

                    <Pagination
                        pagination={ this.props.pagination }
                        setCurrentPage={ this.props.setCurrentPage }
                        fetchItems={ this.props.fetchDocuments }
                    />
                </div>
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        documents: documentsSelectors.getItemsByPage(state, (documentsSelectors.getPagination(state)).currentPage),
        categories: categoriesSelectors.getItems(state),
        sorter: documentsSelectors.getSorter(state),
        filters: documentsSelectors.getFilters(state),
        pagination: documentsSelectors.getPagination(state),
        currentDocument: documentsSelectors.getCurrentItem(state),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchAllCategories: () => {
            dispatch(categoriesActions.fetchAllItems())
        },
        fetchDocuments: (deleteCache) => {
            dispatch(documentsActions.fetchItems(deleteCache))
        },
        setSearchTerm: (searchTerm) => {
            dispatch(documentsActions.setSearchTerm(searchTerm))
        },
        toggleSorter: (searchTerm) => {
            dispatch(documentsActions.toggleSorter(searchTerm))
        },
        setSorter: (sorter) => {
            dispatch(documentsActions.setSorter(sorter))
        },
        setCurrentPage: (page) => {
            dispatch(documentsActions.setCurrentPage(page))
        },
        setCategoryId: (id) => {
            dispatch(documentsActions.setCategoryId(id))
        },
        setCurrentDocumentId: (id) => {
            dispatch(documentsActions.setCurrentItemId(id))
        },
        unsetCurrentDocumentId: () => {
            dispatch(documentsActions.unsetCurrentItemId())
        },
        deleteDocument: (id) => {
            dispatch(documentsActions.deleteItem(id))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentListPage);