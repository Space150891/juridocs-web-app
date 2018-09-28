import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../../services/strings';
import { Link } from 'react-router';
import '../Page.scss';

import * as companiesActions from '../../store/companies/actions';
import * as companiesSelectors from '../../store/companies/selectors';
import * as companyCategoriesActions from '../../store/companyCategories/actions';
import * as companyCategoriesSelectors from '../../store/companyCategories/selectors';

import Topbar from '../../components/Topbar';
import SubTopbar from '../../components/SubTopbar';
import CompanyForm from '../../components/company/CompanyForm';

class CompanyEditPage extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillMount() {
        this.props.fetchCompany(this.props.params.id);
        this.props.setCurrentCompanyId(this.props.params.id);

        this.props.fetchAllCompanyCategories();
    }

    componentWillUnmount() {
        this.props.unsetCurrentCompanyId();
        this.props.clearExceptions();
    }

    saveCompany(data) {
        this.props.updateCompany(this.props.params.id, data.form);
        if (data.file) {
            this.props.uploadCompanyLogo(this.props.params.id, data.file);
        }
    }

    render() {
        return (
            <div className="CompanyEditPage">
                <Topbar currentLanguage={this.props.currentLanguage} handleLangChange={this.props.handleLangChange}>
                    <div className="title">
                        <Link to="/companies">{strings.get('App.companyPages.title')}</Link>
                        <span className="hidden-xs">
                            <span className="divider">/</span>
                            <Link to={`/companies/${this.props.params.id}`}>{strings.get('App.companyPages.edit')}</Link>
                        </span>
                    </div>
                </Topbar>

                <div className="content">
                    <CompanyForm
                        exceptions={ this.props.exceptions }
                        companyCategories={ this.props.companyCategories }
                        currentItem={ this.props.currentCompany }
                        saveItem={ this.saveCompany }
                    />
                </div>
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        companyCategories: companyCategoriesSelectors.getItems(state),
        currentCompany: companiesSelectors.getCurrentItem(state),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchAllCompanyCategories: (deleteCache) => {
            dispatch(companyCategoriesActions.fetchAllItems(deleteCache))
        },
        fetchCompany: (id) => {
            dispatch(companiesActions.fetchItem(id))
        },
        setCurrentCompanyId: (id) => {
            dispatch(companiesActions.setCurrentItemId(id))
        },
        unsetCurrentCompanyId: () => {
            dispatch(companiesActions.unsetCurrentItemId())
        },
        updateCompany: (id, data) => {
            dispatch(companiesActions.updateItem(id, data))
        },
        uploadCompanyLogo: (id, file) => {
            dispatch(companiesActions.uploadItemLogo(id, file))
        },
        createCompany: (data) => {
            dispatch(companiesActions.createItem(data))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompanyEditPage);