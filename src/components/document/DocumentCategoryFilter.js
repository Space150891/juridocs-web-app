import React, { Component } from 'react';
import autoBind from 'react-autobind';
import strings from '../../services/strings';
import language from '../../services/language';
import _ from 'lodash';

import './DocumentCategoryFilter.scss';

class DocumentCategoryFilter extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    getCategoryTree(items, item, arr, depth = 0) {
        if(_.size(items) && _.find(items, item)) {
            if(item.parent_id && depth === 0)
                return;
            arr[0].push(item);
            arr[1].push(depth);
            _.map(items, (it) => {
                if (item.id === it.parent_id) {
                    this.getCategoryTree(items, it, arr, depth+1);
                }
            });
        }
    }

    getCategories() {
        if (this.props.categories) {
            let arr = [[],[]];
            _.map(this.props.categories, (item)=>{
                this.getCategoryTree(this.props.categories, item, arr);
            });

            return _.map(arr[0], (category, i) => {
                let sub = arr[1][i] ? " ".repeat(Math.round(arr[1][i] * 3 + arr[1][i] * 3)) + "|" + "_" : " ";
                return <option className={`depth-${arr[1][i]}`} value={ category.id } key={ category.id }>
                    {`${sub} ${category.name}`}
                    </option>;
            });
        }
    }

    getSelectedCategory() {
        if (this.props.filters) {
            return this.props.filters.categoryId;
        }

        return '';
    }

    handleChange(e) {
        this.props.setCategoryId(e.target.value);
        this.props.fetchItems(true);
    }

    render() {
        return (
            <div className="DocumentCategoryFilter">
                <label>{strings.get('App.documents.categoryFilter.from')}</label>
                <select className="form-control" name="groups" value={ this.getSelectedCategory() } onChange={ this.handleChange }>
                    <option value="">{strings.get('App.documents.categoryFilter.allCategories')}</option>
                    { this.getCategories() }
                </select>
            </div>
        );
    }

}

DocumentCategoryFilter.propTypes = {
    filters: React.PropTypes.object,
    categories: React.PropTypes.object,
    setCategoryId: React.PropTypes.func.isRequired,
    fetchItems: React.PropTypes.func.isRequired,
}

export default DocumentCategoryFilter;