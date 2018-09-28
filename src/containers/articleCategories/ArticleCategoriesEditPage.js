import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import strings from '../../services/strings';
import Topbar from "../../components/Topbar";
import ArticleCategoryForm from "../../components/articleCategory/ArticleCategoryForm";

import '../Page.scss';

import * as articleCategoriesActions from '../../store/articleCategories/actions';
import * as articleCategoriesSelectors from '../../store/articleCategories/selectors';

class ArticleCategoriesEditPage extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillMount() {
        this.props.fetchArticleCategory(this.props.params.id);
        this.props.setCurrentArticleCategoryId(this.props.params.id);
    }

    componentWillUnmount() {
        this.props.unsetCurrentArticleCategoryId();
        this.props.clearExceptions();
    }

    saveArticleCategory(data) {
        this.props.updateArticleCategory(this.props.params.id, data.form);
    }

    render() {
        return (
            <div className="ArticleCategoriesEditPage">
                <Topbar currentLanguage={this.props.currentLanguage} handleLangChange={this.props.handleLangChange}>
                    <div className="title">
                        <Link to="/articleCategories">{strings.get('App.articleCategoryPages.edit.title')}</Link>
                        <span className="xs-hidden">
                            <span className="divider">/</span>
                            <Link to={`/articleCategories/${this.props.params.id}`}>{strings.get('App.articleCategoryPages.edit.edit')}</Link>
                        </span>
                    </div>
                    <div className="main-btns">
                        <Link to={`/articles/add`} className="btn btn-primary">{strings.get('App.articleCategoryPages.add.addArticle')}</Link>
                    </div>
                </Topbar>

                <div className="content">
                    <ArticleCategoryForm
                        exceptions={ this.props.exceptions }
                        articleCategories={ this.props.articleCategories }
                        currentItem={ this.props.currentArticleCategory }
                        saveItem={ this.saveArticleCategory }
                    />
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        currentArticleCategory: articleCategoriesSelectors.getCurrentItem(state),
        articleCategories: articleCategoriesSelectors.getItems(state),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchAllArticleCategories: (deleteCache) => {
            dispatch(articleCategoriesActions.fetchAllItems(deleteCache))
        },
        fetchArticleCategory: (id) => {
            dispatch(articleCategoriesActions.fetchItem(id))
        },
        setCurrentArticleCategoryId: (id) => {
            dispatch(articleCategoriesActions.setCurrentItemId(id))
        },
        unsetCurrentArticleCategoryId: () => {
            dispatch(articleCategoriesActions.unsetCurrentItemId())
        },
        updateArticleCategory: (id, data) => {
            dispatch(articleCategoriesActions.updateItem(id, data))
        },
        createArticleCategory: (data) => {
            dispatch(articleCategoriesActions.createItem(data))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ArticleCategoriesEditPage);