import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import strings from '../../services/strings';
import Topbar from "../../components/Topbar";
import ArticleForm from "../../components/article/ArticleForm";

import '../Page.scss';

import * as articlesActions from '../../store/articles/actions';
import * as articlesSelectors from '../../store/articles/selectors';
import * as articleCategoriesActions from '../../store/articleCategories/actions';
import * as articleCategoriesSelectors from '../../store/articleCategories/selectors';

class ArticlesEditPage extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillMount() {
        this.props.fetchArticle(this.props.params.id);
        this.props.fetchArticleCategories();
        this.props.setCurrentArticleId(this.props.params.id);
    }

    componentWillUnmount() {
        this.props.unsetCurrentArticleId();
        this.props.clearExceptions();
    }

    saveArticle(data) {
        this.props.updateArticle(this.props.params.id, data.form);
        if (data.file) {
            this.props.uploadArticleLogo(this.props.params.id, data.file);
        }
    }

    render() {
        return (
            <div className="ArticlesEditPage">
                <Topbar currentLanguage={this.props.currentLanguage} handleLangChange={this.props.handleLangChange}>
                    <div className="title">
                        <Link to="/articles">{strings.get('App.articlePages.edit.title')}</Link>
                        <span className="xs-hidden">
                            <span className="divider">/</span>
                            <Link to={`/articles/${this.props.params.id}`}>{strings.get('App.articlePages.edit.edit')}</Link>
                        </span>
                    </div>
                </Topbar>

                <div className="content">
                    <ArticleForm
                        exceptions={ this.props.exceptions }
                        articles={ this.props.articles }
                        currentItem={ this.props.currentArticle }
                        saveItem={ this.saveArticle }
                        articleCategories={ this.props.articleCategories }
                    />
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        currentArticle: articlesSelectors.getCurrentItem(state),
        articles: articlesSelectors.getItems(state),
        articleCategories: articleCategoriesSelectors.getItems(state),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchAllArticles: (deleteCache) => {
            dispatch(articlesActions.fetchAllItems(deleteCache))
        },
        fetchArticle: (id) => {
            dispatch(articlesActions.fetchItem(id))
        },
        setCurrentArticleId: (id) => {
            dispatch(articlesActions.setCurrentItemId(id))
        },
        unsetCurrentArticleId: () => {
            dispatch(articlesActions.unsetCurrentItemId())
        },
        updateArticle: (id, data) => {
            dispatch(articlesActions.updateItem(id, data))
        },
        createArticle: (data) => {
            dispatch(articlesActions.createItem(data))
        },
        fetchArticleCategories: () => {
            dispatch(articleCategoriesActions.fetchAllItems())
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ArticlesEditPage);