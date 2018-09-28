import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../../services/strings';
import { Link } from 'react-router';
import '../Page.scss';

import * as categoriesActions from '../../store/categories/actions';
import * as categoriesSelectors from '../../store/categories/selectors';

import Topbar from '../../components/Topbar';
import SubTopbar from '../../components/SubTopbar';
import SearchBar from '../../components/SearchBar';
import CategoryList from '../../components/category/CategoryList';
import Pagination from '../../components/Pagination';


const sort = {
    type : {
        asc: 'ion-arrow-up-a',
    },
    iteration : {
        asc: 'asc',
    }
};



class CategoryListPage extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillMount() {
        this.props.fetchCategories();
    }

    changeSort() {
        this.props.toggleSorter(sort.iteration[this.props.sorter || 'asc']);
        this.props.fetchCategories();
    }

    render() {
        return (
            <div className="CategoryListPage">
                <Topbar currentLanguage={this.props.currentLanguage} handleLangChange={this.props.handleLangChange}>
                    <div className="title">
                        <Link to="/categories">{strings.get('App.categoryPages.listPage.title')}</Link>
                    </div>
                    <SearchBar
                        placeholder={ strings.get('App.searchPlaceholders.category') }
                        searchTerm={ this.props.filters.searchTerm }
                        fetchItems={ this.props.fetchCategories }
                        setSearchTerm={ this.props.setSearchTerm }
                    />
                    <span className="sort-by-name btn btn-info" onClick={this.changeSort.bind(this)}>
                        {strings.get('App.categoryForm.sortByName')} <i className={sort.type[this.props.sorter]} />
                    </span>
                    <div className="main-btns">
                        <Link to="/categories/add" className="btn btn-primary">{strings.get('App.categoryPages.listPage.addCategory')}</Link>
                    </div>
                </Topbar>

                <div className="content">
                    <CategoryList
                        items={ this.props.categories }
                        subCategories={ this.props.subCategories }
                        sorter={ this.props.sorter }
                        currentItem={ this.props.currentCategory }
                        fetchItems={ this.props.fetchCategories }
                        setCurrentItemId={ this.props.setCurrentCategoryId }
                        unsetCurrentItemId={ this.props.unsetCurrentCategoryId }
                        deleteItem={ this.props.deleteCategory }
                    />

                    <Pagination
                        pagination={ this.props.pagination }
                        setCurrentPage={ this.props.setCurrentPage }
                        fetchItems={ this.props.fetchCategories }
                    />
                </div>
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        subCategories: state.categories.subCategories,
        categories: categoriesSelectors.getItemsByPage(state, (categoriesSelectors.getPagination(state)).currentPage),
        sorter: categoriesSelectors.getSorter(state),
        filters: categoriesSelectors.getFilters(state),
        pagination: categoriesSelectors.getPagination(state),
        currentCategory: categoriesSelectors.getCurrentItem(state),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchCategories: (deleteCache) => {
            dispatch(categoriesActions.fetchItems(deleteCache))
        },
        setSearchTerm: (searchTerm) => {
            dispatch(categoriesActions.setSearchTerm(searchTerm))
        },
        toggleSorter: (searchTerm) => {
            dispatch(categoriesActions.toggleSorter(searchTerm))
        },
        setCurrentPage: (page) => {
            dispatch(categoriesActions.setCurrentPage(page))
        },
        setCurrentCategoryId: (id) => {
            dispatch(categoriesActions.setCurrentItemId(id))
        },
        unsetCurrentCategoryId: () => {
            dispatch(categoriesActions.unsetCurrentItemId())
        },
        deleteCategory: (id) => {
            dispatch(categoriesActions.deleteItem(id))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryListPage);
