import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../../services/strings';
import language from '../../services/language';
import { Link, browserHistory } from 'react-router';
import _ from 'lodash';
import './GlossaryForm.scss';

import ActiveLabel from '../ActiveLabel';
import GlossaryFormSelectors from './GlossaryFormSelectors';
import GlossaryFormClauses from './GlossaryFormClauses';
import GlossaryFormFields from './GlossaryFormFields';

class GlossaryForm extends Component {

    state = {
        currentItemLoaded: false,
        allCategories: true,
        categories: [],
        glossary: {
            selectors: [],
            clauses: [],
            fields: [],
        },
        form: {
            language_id: language.get(),
            category_ids: '',
            name: '',
            value: '',
        }
    }

    componentDidMount() {
        this.tryLoadCurrentItem();
    }

    componentDidUpdate() {
        this.tryLoadCurrentItem();
    }

    constructor(props) {
        super(props);
        autoBind(this);
    }

    tryLoadCurrentItem() {
        if (this.props.currentItem && !this.state.currentItemLoaded) {
            let form = _.extend({}, this.state.form);
            _.map(this.state.form, (value, key) => {
                form[key] = (this.props.currentItem[key]) ? this.props.currentItem[key] : this.state.form[key];
            })
            this.setState({
                currentItemLoaded: true,
                allCategories: !_.size(this.props.currentItem.categories),
                categories: this.props.currentItem.categories,
                glossary: JSON.parse(this.props.currentItem['value']),
                form
            });
        } /*else if( this.props.currentRule && !this.state.form.name) {
            let form = _.extend({}, this.state.form);
            let glossary = _.extend({}, this.state.glossary);
            _.map(this.props.glossaries, (item) => {
               if (!form.name) {
                   form.name = item.name;
                   glossary = JSON.parse(item.value);
               }
            });
            this.setState({form, glossary});
        }*/
    }

    hasError(inputName) {
        return !!this.props.exceptions[inputName];
    }

    getErrorClass(inputName, defaultClasses = '') {
        return this.hasError(inputName) ? defaultClasses + ' has-error' : defaultClasses;
    }

    getErrorMessage(inputName) {
        return this.props.exceptions[inputName];
    }

    handleInputChange(e) {
        let form = {};
        form[e.target.name] = e.target.value;
        this.setState({
            form: _.extend(this.state.form, form)
        });
        if(this.props.currentRule){
            let glossary = _.extend({}, this.state.glossary);
            let flag = false;
            _.map(this.props.glossaries, (item) => {
                if(item.name === this.state.form.name) {
                    glossary = JSON.parse(item.value);
                    this.setState({categories: item.categories, allCategories: !Boolean(_.size(item.categories))});
                    flag = true;
                    return;
                }
            });
            if (flag === false) glossary = {"selectors": [], "clauses": [], "fields": []};
            this.setState({glossary, itemsLoaded: false});
        }
    }

    handleAllCategoriesChange(e) {
        this.setState({
            allCategories: e.target.checked
        });
    }

    handleCategoryAdd(e) {
        let id = e.target.value;
        let added = (_.findIndex(this.state.categories, (item) => {
            return item.id == id;
        }) > -1);

        if (!added) {
            let categories = _.extend([], this.state.categories);
            categories.push(this.props.categories[`_${id}`]);
            this.setState({ 
                categories,
                allCategories: false,
            });
        }
    }

    handleCategoryRemove(value) {
        let categories = _.filter(this.state.categories, (item) => {
            return item.id != value;
        });

        this.setState({ 
            categories,
            allCategories: _.size(categories) == 0,
        });
    }

    handleSelectorsChange(items) {
        this.setState({
            glossary: _.extend(this.state.glossary, {
                selectors: items,
            }),
        });
    }

    handleClausesChange(items) {
        this.setState({
            glossary: _.extend(this.state.glossary, {
                clauses: items,
            }),
        });
    }

    handleFieldsChange(items) {
        this.setState({
            glossary: _.extend(this.state.glossary, {
                fields: items,
            }),
        });
    }

    handleSaveClick(e) {
        e.preventDefault();

        let categoryIds = this.state.allCategories ? '' : (
            _.map(this.state.categories, (item) => {
                return item.id;
            }).join(',')
        );

        let value = JSON.stringify(this.state.glossary);

        this.props.saveItem({
            form: {
                language_id: language.get(),
                name: this.state.form.name,
                category_ids: categoryIds,
                value,
            }
        });
    }

    handleCancelClick(e) {
        e.preventDefault();
        if( !this.props.currentRule )
            browserHistory.push('/glossaries');
        else
            this.props.hideAddRuleModal();
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

    addClick() {
        let arr = ["fields", "clauses", "selectors"];
        _.map(arr, (item) => {
            this.refs[item].refs.hidden.style.display = this.refs[item].refs.hidden.style.display !== "none" ? "none" : this.refs[item].refs.hidden.style.display;
        });
    }

    render() {
        let nameLabel = this.hasError('name') ? `${strings.get('App.glossaries.glossaryForm.name')} ${this.getErrorMessage('name')}` : strings.get('App.glossaries.glossaryForm.name');
        let categoriesLabel = this.hasError('category_ids') ? `${strings.get('App.glossaries.glossaryForm.category')} ${this.getErrorMessage('category_ids')}` : strings.get('App.glossaries.glossaryForm.category');

        let arr = [[],[]];
        _.map(this.props.categories, (item)=>{
            this.getCategoryTree(this.props.categories, item, arr);
        });

        let categories = _.map(arr[0], (category, i) => {
            let sub = arr[1][i] ? " ".repeat(Math.round(arr[1][i] * 3 + arr[1][i] * 3)) + "|" + "_" : " ";
            return <option className={`depth-${arr[1][i]}`} value={ category.id } key={ category.id }>
                {`${sub} ${category.name}`}
            </option>;
        });

        let selectedCategories = this.state.allCategories ? null : _.map(this.state.categories, (item) => {
            return (
                <div key={`category-${item.id}`}>
                    <ActiveLabel
                        name={ item.name }
                        value={ item.id }
                        onRemove={ this.handleCategoryRemove }
                    />
                </div>
            );
        });

        let nameInput;
        if (this.props.currentRule) {
            nameInput = (
                <div style={{position: "relative"}}>
                    <select className="form-control" name="name" value={ this.state.form.name } onChange={ this.handleInputChange }>
                        {
                            _.map(this.props.glossaries, (glossary) => {
                                return (
                                    <option key={`item-${glossary.id}`} value={glossary.name}>{glossary.name}</option>
                                )
                            })
                        }
                    </select>
                    <input className="form-control editableInput" type="text" name="name" value={ this.state.form.name } onChange={ this.handleInputChange } />
                 </div>
            );
        } else {
            nameInput = (<input className="form-control" type="text" name="name" value={ this.state.form.name } onChange={ this.handleInputChange } />);
        }

        return (
            <div className="GlossaryForm row">
                <form>
                    <div className="col-sm-6">
                        <div className={ this.getErrorClass('name', 'form-group') }>
                            <label className="control-label">{ nameLabel }</label>
                            { nameInput }
                        </div>
                        <div className="divider"></div>
                        <GlossaryFormSelectors
                            ref="selectors"
                            steps={ this.props.steps }
                            glossaries={ this.props.glossaries }
                            items={ this.state.glossary.selectors }
                            currentGlossary={ this.props.currentItem }
                            onChange={ this.handleSelectorsChange }
                            currentItem={ this.props.currentRule }
                            addClick={ this.addClick }
                        />
                        <div className="divider"></div>
                        <GlossaryFormClauses
                            ref="clauses"
                            steps={ this.props.steps }
                            glossaries={ this.props.glossaries }
                            items={ this.state.glossary.clauses }
                            currentGlossary={ this.props.currentItem }
                            onChange={ this.handleClausesChange }
                            currentItem={ this.props.currentRule }
                            addClick={ this.addClick }
                        />
                        <div className="divider"></div>
                        <GlossaryFormFields
                            ref="fields"
                            steps={ this.props.steps }
                            glossaries={ this.props.glossaries }
                            items={ this.state.glossary.fields }
                            currentGlossary={ this.props.currentItem }
                            onChange={ this.handleFieldsChange }
                            currentItem={ this.props.currentRule }
                            addClick={ this.addClick }
                        />
                        <div className="form-actions">
                            <button className="btn btn-primary" onClick={ this.handleSaveClick }>{strings.get('App.glossaries.glossaryForm.save')}</button>
                            <button className="btn btn-default" onClick={ this.handleCancelClick }>{strings.get('App.glossaries.glossaryForm.cancel')}</button>
                        </div>
                    </div>
                    <div className="col-sm-4 col-sm-offset-1">
                        <div className={ this.getErrorClass('category_ids', 'form-group') }>
                            <label className="control-label">{ categoriesLabel }</label>
                            <div className="checkbox">
                                <label>
                                    <input type="checkbox" checked={ this.state.allCategories } onChange={ this.handleAllCategoriesChange } />
                                    {strings.get('App.glossaries.glossaryForm.all')}
                                </label>
                            </div>
                            { selectedCategories }
                            <select className="form-control" value="" onChange={ this.handleCategoryAdd }>
                                <option value="" disabled>{strings.get('App.glossaries.glossaryForm.choose')}</option>
                                { categories }
                            </select>
                        </div>
                    </div>
                </form>
            </div>
        );
    }

}

GlossaryForm.propTypes = {
    exceptions: React.PropTypes.object,
    glossaries: React.PropTypes.object,
    categories: React.PropTypes.object,
    steps: React.PropTypes.object,
    saveItem: React.PropTypes.func,
}

export default GlossaryForm;