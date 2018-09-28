import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import strings from '../../services/strings';

import '../Page.scss';
import Topbar from "../../components/Topbar";
import ArticleCategoryForm from "../../components/articleCategory/ArticleCategoryForm";

import * as articleCategoriesActions from '../../store/articleCategories/actions';
import * as articleCategoriesSelectors from '../../store/articleCategories/selectors';

class ArticleCategoriesAddPage extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillUnmount() {
        this.props.clearExceptions();
    }

    saveArticleCategory(data) {
        this.props.createArticleCategory(data.form);
    }

    render() {
        return (
            <div className="ArticleCategoriesAddPage">
                <Topbar currentLanguage={this.props.currentLanguage} handleLangChange={ this.props.handleLangChange } >
                    <div className="title">
                        <Link to="/articleCategories">{strings.get('App.articleCategoryPages.add.title')}</Link>
                        <span className="hidden-xs">
                            <span className="divider">/</span>
                            <Link to="/articleCategories/add">{strings.get('App.articleCategoryPages.add.add')}</Link>
                        </span>
                    </div>
                    <div className="main-btns">
                        <Link className="btn btn-primary" to="/articles/add">{strings.get('App.articleCategoryPages.add.addArticle')}</Link>
                    </div>
                </Topbar>

                <div className="content">
                    <ArticleCategoryForm
                        exceptions = {this.props.exceptions}
                        saveItem={ this.saveArticleCategory }
                    />
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {

    }
}

function mapDispatchToProps(dispatch) {
    return {
        createArticleCategory: (data) => {
            dispatch(articleCategoriesActions.createItem(data))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ArticleCategoriesAddPage);