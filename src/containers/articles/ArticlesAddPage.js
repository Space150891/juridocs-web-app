import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import strings from '../../services/strings';

import '../Page.scss';
import Topbar from "../../components/Topbar";
import ArticleForm from "../../components/article/ArticleForm";

import * as articlesActions from '../../store/articles/actions';
import * as articlesSelectors from '../../store/articles/selectors';
import * as articleCategoriesActions from '../../store/articleCategories/actions';
import * as articleCategoriesSelectors from '../../store/articleCategories/selectors';

class ArticlesAddPage extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillUnmount() {
        this.props.clearExceptions();
    }

    saveArticle(data) {
        this.props.createArticle(data.form);
    }

    render() {
        return (
            <div className="ArticlesAddPage">
                <Topbar currentLanguage={this.props.currentLanguage} handleLangChange={ this.props.handleLangChange } >
                    <div className="title">
                        <Link to="/articles">{strings.get('App.articlePages.add.title')}</Link>
                        <span className="hidden-xs">
                            <span className="divider">/</span>
                            <Link to="/articles/add">{strings.get('App.articlePages.add.add')}</Link>
                        </span>
                    </div>
                </Topbar>

                <div className="content">
                    <ArticleForm
                        exceptions = {this.props.exceptions}
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
        articleCategories: articleCategoriesSelectors.getItems(state),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        createArticle: (data) => {
            dispatch(articlesActions.createItem(data))
        },
        fetchArticleCategories: () => {
            dispatch(articleCategoriesActions.fetchAllItems())
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ArticlesAddPage);