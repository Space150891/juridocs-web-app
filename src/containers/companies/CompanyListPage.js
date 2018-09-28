import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../../services/strings';
import { Link } from 'react-router';
import '../Page.scss';

import * as companiesActions from '../../store/companies/actions';
import * as companiesSelectors from '../../store/companies/selectors';

import Topbar from '../../components/Topbar';
import SubTopbar from '../../components/SubTopbar';
import SearchBar from '../../components/SearchBar';
import CompanyList from '../../components/company/CompanyList';
import Pagination from '../../components/Pagination';

class CompanyListPage extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillMount() {
        this.props.fetchCompanies();
    }

    render() {
        return (
            <div className="CompanyListPage">
                <Topbar currentLanguage={this.props.currentLanguage} handleLangChange={this.props.handleLangChange}>
                    <div className="title">
                        <Link to="/companies">{strings.get('App.companyPages.title')}</Link>
                    </div>
                    <SearchBar
                        placeholder={ strings.get('App.searchPlaceholders.company') }
                        searchTerm={ this.props.filters.searchTerm }
                        fetchItems={ this.props.fetchCompanies }
                        setSearchTerm={ this.props.setSearchTerm }
                    />
                    <div className="main-btns">
                        <Link to="/companies/categories" className="btn btn-default">{strings.get('App.companyPages.manage')}</Link>
                        <Link to="/companies/add" className="btn btn-primary">{strings.get('App.companyPages.addCompany')}</Link>
                    </div>
                </Topbar>

                <div className="content">
                    <CompanyList
                        items={ this.props.companies }
                        sorter={ this.props.sorter }
                        currentItem={ this.props.currentCompany }
                        fetchItems={ this.props.fetchCompanies }
                        setCurrentItemId={ this.props.setCurrentCompanyId }
                        unsetCurrentItemId={ this.props.unsetCurrentCompanyId }
                        deleteItem={ this.props.deleteCompany }
                        toggleSorter={ this.props.toggleSorter }
                    />

                    <Pagination
                        pagination={ this.props.pagination }
                        setCurrentPage={ this.props.setCurrentPage }
                        fetchItems={ this.props.fetchCompanies }
                    />
                </div>
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        companies: companiesSelectors.getItemsByPage(state, (companiesSelectors.getPagination(state)).currentPage),
        sorter: companiesSelectors.getSorter(state),
        filters: companiesSelectors.getFilters(state),
        pagination: companiesSelectors.getPagination(state),
        currentCompany: companiesSelectors.getCurrentItem(state),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchCompanies: (deleteCache) => {
            dispatch(companiesActions.fetchItems(deleteCache))
        },
        setSearchTerm: (searchTerm) => {
            dispatch(companiesActions.setSearchTerm(searchTerm))
        },
        toggleSorter: (searchTerm) => {
            dispatch(companiesActions.toggleSorter(searchTerm))
        },
        setCurrentPage: (page) => {
            dispatch(companiesActions.setCurrentPage(page))
        },
        setCurrentCompanyId: (id) => {
            dispatch(companiesActions.setCurrentItemId(id))
        },
        unsetCurrentCompanyId: () => {
            dispatch(companiesActions.unsetCurrentItemId())
        },
        deleteCompany: (id) => {
            dispatch(companiesActions.deleteItem(id))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompanyListPage);