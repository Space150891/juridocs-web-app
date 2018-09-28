import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import strings from '../../services/strings';
import Topbar from "../../components/Topbar";
import ArticleCategoryList from "../../components/articleCategory/ArticleCategoryList";
import Pagination from "../../components/Pagination";

import '../Page.scss';

import * as articleCategoriesActions from '../../store/articleCategories/actions';
import * as articleCategoriesSelectors from '../../store/articleCategories/selectors';

class ArticleCategoriesListPage extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillMount() {
        this.props.fetchArticleCategories();
    }

    componentWillUnmount() {
        this.props.unsetCurrentArticleCategoryId();
        this.props.clearExceptions();
    }

    render() {
        return (
            <div className="ArticleCategoriesListPage">
                <Topbar currentLanguage={ this.props.currentLanguage } handleLangChange={ this.props.handleLangChange }>
                    <div className="title">
                        <Link to="/articleCategories">{ strings.get('App.articleCategoryPages.listPage.title') }</Link>
                    </div>
                    <div className="main-btns">
                        <Link to="/articles" className="btn btn-default">{ strings.get('App.articleCategoryPages.listPage.articleList') }</Link>
                        <Link to="/articleCategories/add" className="btn btn-primary">{strings.get('App.articleCategoryPages.listPage.addArticleCategory')}</Link>
                    </div>
                </Topbar>

                <div className="content">
                    <ArticleCategoryList
                        items={ this.props.articleCategories }
                        currentItem={ this.props.currentArticleCategory }
                        fetchItems={ this.props.fetchArticleCategories }
                        setCurrentItemId={ this.props.setCurrentArticleCategoryId }
                        unsetCurrentItemId={ this.props.unsetCurrentArticleCategoryId }
                        deleteItem={ this.props.deleteArticleCategory }
                    />

                    <Pagination
                        pagination={ this.props.pagination }
                        setCurrentPage={ this.props.setCurrentPage }
                        fetchItems={ this.props.fetchArticleCategories }
                    />
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        articleCategories: articleCategoriesSelectors.getItemsByPage(state, (articleCategoriesSelectors.getPagination(state)).currentPage),
        pagination: articleCategoriesSelectors.getPagination(state),
        currentArticleCategory: articleCategoriesSelectors.getCurrentItem(state),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchArticleCategories: (deleteCache) => {
            dispatch(articleCategoriesActions.fetchItems(deleteCache))
        },
        setCurrentPage: (page) => {
            dispatch(articleCategoriesActions.setCurrentPage(page))
        },
        setCurrentArticleCategoryId: (id) => {
            dispatch(articleCategoriesActions.setCurrentItemId(id))
        },
        unsetCurrentArticleCategoryId: () => {
            dispatch(articleCategoriesActions.unsetCurrentItemId())
        },
        deleteArticleCategory: (id) => {
            dispatch(articleCategoriesActions.deleteItem(id))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ArticleCategoriesListPage);