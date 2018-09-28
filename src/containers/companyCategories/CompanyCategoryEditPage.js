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

class CompanyCategoryEditPage extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillMount() {
        this.props.fetchCompanyCategory(this.props.params.id);
        this.props.setCurrentCompanyCategoryId(this.props.params.id);
    }

    componentWillUnmount() {
        this.props.unsetCurrentCompanyCategoryId();
        this.props.clearExceptions();
    }

    saveCompanyCategory(data) {
        this.props.updateCompanyCategory(this.props.params.id, data.form);
    }

    render() {
        return (
            <div className="CompanyCategoryEditPage">
                <Topbar currentLanguage={this.props.currentLanguage} handleLangChange={this.props.handleLangChange}>
                    <div className="title">
                        <Link to="/companies">{strings.get('App.companyCategoryPages.title')}</Link>
                        <span className="hidden-xs">
                            <span className="divider">/</span>
                            <Link to="/companies/categories">{strings.get('App.companyCategoryPages.categories')}</Link>
                            <span className="divider">/</span>
                            <Link to={`/companies/categories/${this.props.params.id}`}>{strings.get('App.companyCategoryPages.edit')}</Link>
                        </span>
                    </div>
                </Topbar>

                <div className="content">
                    <CompanyCategoryForm
                        exceptions={ this.props.exceptions }
                        currentItem={ this.props.currentCompanyCategory }
                        saveItem={ this.saveCompanyCategory }
                    />
                </div>
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        currentCompanyCategory: companyCategoriesSelectors.getCurrentItem(state),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchCompanyCategory: (id) => {
            dispatch(companyCategoriesActions.fetchItem(id))
        },
        setCurrentCompanyCategoryId: (id) => {
            dispatch(companyCategoriesActions.setCurrentItemId(id))
        },
        unsetCurrentCompanyCategoryId: () => {
            dispatch(companyCategoriesActions.unsetCurrentItemId())
        },
        updateCompanyCategory: (id, data) => {
            dispatch(companyCategoriesActions.updateItem(id, data))
        },
        createCompanyCategory: (data) => {
            dispatch(companyCategoriesActions.createItem(data))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompanyCategoryEditPage);