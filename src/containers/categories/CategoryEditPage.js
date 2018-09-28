import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../../services/strings';
import { Link } from 'react-router';
import '../Page.scss';

import * as categoriesActions from '../../store/categories/actions';
import * as categoriesSelectors from '../../store/categories/selectors';
import * as usersActions from '../../store/users/actions';
import * as usersSelectors from '../../store/users/selectors';
import * as groupsActions from '../../store/groups/actions';
import * as groupsSelectors from '../../store/groups/selectors';

import Topbar from '../../components/Topbar';
import SubTopbar from '../../components/SubTopbar';
import CategoryForm from '../../components/category/CategoryForm';

class CategoryEditPage extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillMount() {
        this.props.fetchCategory(this.props.params.id);
        this.props.setCurrentCategoryId(this.props.params.id);

        this.props.fetchAllCategories();
        this.props.fetchAllUsers();
        this.props.fetchAllGroups();
    }

    componentWillUnmount() {
        this.props.unsetCurrentCategoryId();
        this.props.clearExceptions();
    }

    saveCategory(data) {
        this.props.updateCategory(this.props.params.id, data.form);
        if (data.file) {
            this.props.uploadCategoryLogo(this.props.params.id, data.file);
        }
    }

    render() {
        return (
            <div className="CategoryEditPage">
                <Topbar currentLanguage={this.props.currentLanguage} handleLangChange={this.props.handleLangChange}>
                    <div className="title">
                        <Link to="/categories">{strings.get('App.categoryPages.edit.title')}</Link>
                        <span className="hidden-xs">
                            <span className="divider">/</span>
                            <Link to={`/categories/${this.props.params.id}`}>{strings.get('App.categoryPages.edit.edit')}</Link>
                        </span>
                    </div>
                </Topbar>
                <div className="content">
                    <CategoryForm
                        exceptions={ this.props.exceptions }
                        categories={ this.props.categories }
                        currentItem={ this.props.currentCategory }
                        users={ this.props.users }
                        groups={ this.props.groups }
                        saveItem={ this.saveCategory }
                    />
                </div>
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        currentCategory: categoriesSelectors.getCurrentItem(state),
        categories: categoriesSelectors.getItems(state),
        users: usersSelectors.getItems(state),
        groups: groupsSelectors.getItems(state),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchAllCategories: (deleteCache) => {
            dispatch(categoriesActions.fetchAllItems(deleteCache))
        },
        fetchAllUsers: (deleteCache) => {
            dispatch(usersActions.fetchAllItems(deleteCache))
        },
        fetchAllGroups: (deleteCache) => {
            dispatch(groupsActions.fetchAllItems(deleteCache))
        },
        fetchCategory: (id) => {
            dispatch(categoriesActions.fetchItem(id))
        },
        setCurrentCategoryId: (id) => {
            dispatch(categoriesActions.setCurrentItemId(id))
        },
        unsetCurrentCategoryId: () => {
            dispatch(categoriesActions.unsetCurrentItemId())
        },
        updateCategory: (id, data) => {
            dispatch(categoriesActions.updateItem(id, data))
        },
        uploadCategoryLogo: (id, file) => {
            dispatch(categoriesActions.uploadItemLogo(id, file))
        },
        createCategory: (data) => {
            dispatch(categoriesActions.createItem(data))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryEditPage);