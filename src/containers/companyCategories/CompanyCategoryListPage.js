import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../../services/strings';
import { Link } from 'react-router';
import '../Page.scss';

import * as companyCategoriesActions from '../../store/companyCategories/actions';
import * as companyCategoriesSelectors from '../../store/companyCategories/selectors';

import Topbar from '../../components/Topbar';
import SubTopbar from '../../components/SubTopbar';
import CompanyCategoryList from '../../components/companyCategory/CompanyCategoryList';
import Pagination from '../../components/Pagination';

class CompanyCategoryListPage extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillMount() {
        this.props.fetchCompanyCategories();
    }

    render() {
        return (
            <div className="CompanyCategoryListPage">
                <Topbar currentLanguage={this.props.currentLanguage} handleLangChange={this.props.handleLangChange}>
                    <div className="title">
                        <Link to="/companies">{strings.get('App.companyCategoryPages.title')}</Link>
                        <span className="hidden-xs">
                            <span className="divider">/</span>
                            <Link to="/companies/categories">{strings.get('App.companyCategoryPages.categories')}</Link>
                        </span>
                    </div>
                    <div className="main-btns">
                        <Link to="/companies/categories/add" className="btn btn-primary">{strings.get('App.companyCategoryPages.addCompanyCategory')}</Link>
                    </div>
                </Topbar>

                <div className="content">
                    <CompanyCategoryList
                        items={ this.props.companyCategories }
                        sorter={ this.props.sorter }
                        currentItem={ this.props.currentCompanyCategory }
                        fetchItems={ this.props.fetchCompanyCategories }
                        setCurrentItemId={ this.props.setCurrentCompanyCategoryId }
                        unsetCurrentItemId={ this.props.unsetCurrentCompanyCategoryId }
                        deleteItem={ this.props.deleteCompanyCategory }
                        toggleSorter={ this.props.toggleSorter }
                    />

                    <Pagination
                        pagination={ this.props.pagination }
                        setCurrentPage={ this.props.setCurrentPage }
                        fetchItems={ this.props.fetchCompanyCategories }
                    />
                </div>
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        companyCategories: companyCategoriesSelectors.getItemsByPage(state, (companyCategoriesSelectors.getPagination(state)).currentPage),
        sorter: companyCategoriesSelectors.getSorter(state),
        filters: companyCategoriesSelectors.getFilters(state),
        pagination: companyCategoriesSelectors.getPagination(state),
        currentCompanyCategory: companyCategoriesSelectors.getCurrentItem(state),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchCompanyCategories: (deleteCache) => {
            dispatch(companyCategoriesActions.fetchItems(deleteCache))
        },
        setSearchTerm: (searchTerm) => {
            dispatch(companyCategoriesActions.setSearchTerm(searchTerm))
        },
        toggleSorter: (searchTerm) => {
            dispatch(companyCategoriesActions.toggleSorter(searchTerm))
        },
        setCurrentPage: (page) => {
            dispatch(companyCategoriesActions.setCurrentPage(page))
        },
        setCurrentCompanyCategoryId: (id) => {
            dispatch(companyCategoriesActions.setCurrentItemId(id))
        },
        unsetCurrentCompanyCategoryId: () => {
            dispatch(companyCategoriesActions.unsetCurrentItemId())
        },
        deleteCompanyCategory: (id) => {
            dispatch(companyCategoriesActions.deleteItem(id))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompanyCategoryListPage);