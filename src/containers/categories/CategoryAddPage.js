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

class CategoryAddPage extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillMount() {
        this.props.fetchAllCategories();
        this.props.fetchAllUsers();
        this.props.fetchAllGroups();
    }

    componentWillUnmount() {
        this.props.clearExceptions();
    }

    saveCategory(data) {
        if (data.file) {
            this.props.createCategoryWithLogo(data.form, data.file);
        } else {
            this.props.createCategory(data.form);
        }
    }

    render() {
        return (
            <div className="CategoryAddPage">
                <Topbar currentLanguage={this.props.currentLanguage} handleLangChange={this.props.handleLangChange}>
                    <div className="title">
                        <Link to="/categories">{strings.get('App.categoryPages.add.title')}</Link>
                        <span className="hidden-xs">
                            <span className="divider">/</span>
                            <Link to="/categories/add">{strings.get('App.categoryPages.add.add')}</Link>
                        </span>
                    </div>
                </Topbar>

                <div className="content">
                    <CategoryForm
                        exceptions={ this.props.exceptions }
                        categories={ this.props.categories }
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
        createCategory: (data) => {
            dispatch(categoriesActions.createItem(data))
        },
        createCategoryWithLogo: (data, file) => {
            dispatch(categoriesActions.createItemWithLogo(data, file))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryAddPage);