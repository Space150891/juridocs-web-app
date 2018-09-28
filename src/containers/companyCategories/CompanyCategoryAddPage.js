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
import CompanyCategoryForm from '../../components/companyCategory/CompanyCategoryForm';

class CompanyCategoryAddPage extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillUnmount() {
        this.props.clearExceptions();
    }

    saveCompanyCategory(data) {
        this.props.createCompanyCategory(data.form);
    }

    render() {
        return (
            <div className="CompanyCategoryAddPage">
                <Topbar currentLanguage={this.props.currentLanguage} handleLangChange={this.props.handleLangChange}>
                    <div className="title">
                        <Link to="/companies">{strings.get('App.companyCategoryPages.title')}</Link>
                        <span className="hidden-xs">
                            <span className="divider">/</span>
                            <Link to="/companies/categories">{strings.get('App.companyCategoryPages.categories')}</Link>
                            <span className="divider">/</span>
                            <Link to="/companies/categories/add">{strings.get('App.companyCategoryPages.add')}</Link>
                        </span>
                    </div>
                </Topbar>

                <div className="content">
                    <CompanyCategoryForm
                        exceptions={ this.props.exceptions }
                        saveItem={ this.saveCompanyCategory }
                    />
                </div>
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        //
    }
}

function mapDispatchToProps(dispatch) {
    return {
        createCompanyCategory: (data) => {
            dispatch(companyCategoriesActions.createItem(data))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompanyCategoryAddPage);