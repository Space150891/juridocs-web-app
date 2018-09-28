import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import strings from '../../services/strings';
import Topbar from "../../components/Topbar";
import ArticleList from "../../components/article/ArticleList";
import Pagination from "../../components/Pagination";

import '../Page.scss';

import * as articlesActions from '../../store/articles/actions';
import * as articlesSelectors from '../../store/articles/selectors';

class ArticlesListPage extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillMount() {
        this.props.fetchArticles();
    }

    componentWillUnmount() {
        this.props.unsetCurrentArticleId();
        this.props.clearExceptions();
    }

    render() {
        return (
            <div className="ArticlesListPage">
                <Topbar currentLanguage={ this.props.currentLanguage } handleLangChange={ this.props.handleLangChange }>
                    <div className="title">
                        <Link to="/articleCategories">{ strings.get('App.articlePages.listPage.articleCategories') }</Link>
                        <span className="xs-hidden">
                            <span className="divier">/</span>
                            <Link to="/articles">{ strings.get('App.articlePages.listPage.title') }</Link>
                        </span>
                    </div>
                    <div className="main-btns">
                        <Link to="/articles/add" className="btn btn-primary">{strings.get('App.articlePages.listPage.addArticle')}</Link>
                    </div>
                </Topbar>

                <div className="content">
                    <ArticleList
                        items={ this.props.articles }
                        currentItem={ this.props.currentArticle }
                        fetchItems={ this.props.fetchArticles }
                        setCurrentItemId={ this.props.setCurrentArticleId }
                        unsetCurrentItemId={ this.props.unsetCurrentArticleId }
                        deleteItem={ this.props.deleteArticle }
                    />

                    <Pagination
                        pagination={ this.props.pagination }
                        setCurrentPage={ this.props.setCurrentPage }
                        fetchItems={ this.props.fetchArticles }
                    />
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        articles: articlesSelectors.getItemsByPage(state, (articlesSelectors.getPagination(state)).currentPage),
        pagination: articlesSelectors.getPagination(state),
        currentArticle: articlesSelectors.getCurrentItem(state),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchArticles: (deleteCache) => {
            dispatch(articlesActions.fetchItems(deleteCache))
        },
        setCurrentPage: (page) => {
            dispatch(articlesActions.setCurrentPage(page))
        },
        setCurrentArticleId: (id) => {
            dispatch(articlesActions.setCurrentItemId(id))
        },
        unsetCurrentArticleId: () => {
            dispatch(articlesActions.unsetCurrentItemId())
        },
        deleteArticle: (id) => {
            dispatch(articlesActions.deleteItem(id))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ArticlesListPage);