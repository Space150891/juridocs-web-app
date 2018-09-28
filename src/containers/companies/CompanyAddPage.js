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

class CompanyAddPage extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillMount() {
        this.props.fetchAllCompanyCategories();
    }

    componentWillUnmount() {
        this.props.clearExceptions();
    }

    saveCompany(data) {
        if (data.file) {
            this.props.createCompanyWithLogo(data.form, data.file);
        } else {
            this.props.createCompany(data.form);
        }
    }

    render() {
        return (
            <div className="CompanyAddPage">
                <Topbar currentLanguage={this.props.currentLanguage} handleLangChange={this.props.handleLangChange}>
                    <div className="title">
                        <Link to="/companies">{strings.get('App.companyPages.title')}</Link>
                        <span className="hidden-xs">
                            <span className="divider">/</span>
                            <Link to="/companies/add">{strings.get('App.companyPages.add')}</Link>
                        </span>
                    </div>
                </Topbar>

                <div className="content">
                    <CompanyForm
                        exceptions={ this.props.exceptions }
                        companyCategories={ this.props.companyCategories }
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
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchAllCompanyCategories: (deleteCache) => {
            dispatch(companyCategoriesActions.fetchAllItems(deleteCache))
        },
        createCompany: (data) => {
            dispatch(companiesActions.createItem(data))
        },
        createCompanyWithLogo: (data, file) => {
            dispatch(companiesActions.createItemWithLogo(data, file))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompanyAddPage);