import React, {Component} from 'react';
import autoBind from 'react-autobind';
import {connect} from 'react-redux';
import strings from '../../services/strings';
import {Link, browserHistory} from 'react-router';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
import _ from 'lodash';

import FadeModal from 'boron/FadeModal';
import DropModal from 'boron/DropModal';
import ActiveLabel from '../ActiveLabel';
import Editor from '../Editor';

let componentInstance = null;

const SortableItem = SortableElement(({value}) => {
    return (
        <ActiveLabel
            name={ value.name }
            value={ value.index }
            clickable={ true }
            draggable={ true }
            onRemove={ componentInstance.handleItemRemove }
            onClick={ componentInstance.handleItemClick }
        />
    );
});

const SortableList = SortableContainer(({items}) => {
    let rows = _.map(items, (value, index) => {
        value.index = index;
        return (
            <SortableItem key={`item-${index}`} index={ index } value={ value }/>
        );
    });

    return (
        <div>
            { rows }
        </div>
    );
});

class GlossaryFormClauses extends Component {

    state = {
        itemsLoaded: false,
        currentItemKey: -1,
        currentItem: null,
        errors: {},
        tmpItem: {
            stepId: -1,
            name: '',
            description: '',
            helperText: '',
            helperLink: '',
            placeholder: '',
            placeholderField: ''
        },
        items: [],
    }

    componentDidMount() {
        this.tryLoadItems();
    }

    componentDidUpdate() {
        this.tryLoadItems();
    }

    constructor(props) {
        super(props);
        autoBind(this);
        componentInstance = this;
    }

    tryLoadItems() {
        if (_.size(this.props.items) && !this.state.itemsLoaded) {
            this.setState({
                itemsLoaded: true,
                items: this.props.items,
            });
        } else if (!this.state.tmpItem.name && this.props.currentItem && this.props.currentItem.type === "clause") {
            let tmpItem = _.extend({}, this.state.tmpItem);
            tmpItem.name = this.props.currentItem.name;
            this.setState({
                tmpItem
            });
        } else if (_.size(this.state.items) && _.size(this.props.items) && this.state.items !== this.props.items) {
            this.setState({items: this.props.items});
        } else if(_.size(this.props.items) === 0 && this.props.currentItem && this.state.itemsLoaded) {
            this.setState({itemsLoaded: false, items: this.props.items});
        }
    }

    validate() {
        let item = this.state.tmpItem;
        let duplicate = this.isDuplicated(item);
        let errors = {};

        if (item.name == '') {
            errors['name'] = strings.get('Exceptions.required');
        }
        else if (!/^[a-z0-9_]+$/.test(item.name)) {
            errors['name'] = strings.get('Exceptions.onlyLowercase');
        }

        if (item.description == '') {
            errors['description'] = strings.get('Exceptions.required');
        }

        if (item.stepId == -1) {
            errors['stepId'] = strings.get('Exceptions.required');
        }

        if (duplicate) {
            if (_.isObject(duplicate)) {
                errors['name'] = strings.get('Exceptions.existsInOther', {itemName: duplicate.name});
            } else {
                errors['name'] = strings.get('Exceptions.existsInThis');
            }
        }

        if (_.size(errors)) {
            this.setState({errors});
            return false;
        }

        return true;
    }

    isDuplicated(item) {
        let duplicate;
        let currentGlossary = this.props.currentGlossary;

        // If item has been edited and name didn't change is not duplicate
        if (this.state.currentItem && item.name == this.state.currentItem.name) {
            return null;
        }

        // Check duplicates in other glossaries
        _.each(this.props.glossaries, glossary => {
            // Skip current glossary
            if (!currentGlossary || currentGlossary.id != glossary.id) {
                let value = JSON.parse(glossary.value);

                _.each(value.clauses, clause => {
                    if (clause.name == item.name) {
                        duplicate = glossary;
                    }
                });
            }
        });

        // Check duplicates into current glossary
        _.each(this.state.items, clause => {
            if (clause.name == item.name) {
                duplicate = true;
            }
        });

        return duplicate;
    }

    hasError(inputName) {
        return !!this.state.errors[inputName];
    }

    getErrorClass(inputName, defaultClasses = '') {
        return this.hasError(inputName) ? defaultClasses + ' has-error' : defaultClasses;
    }

    getErrorMessage(inputName) {
        return this.state.errors[inputName];
    }

    showFormModal() {
        this.refs.formModal.show();
    }

    showDeleteModal() {
        this.refs.deleteModal.show();
    }

    hideFormModal() {
        this.refs.formModal.hide();
    }

    hideDeleteModal() {
        this.refs.deleteModal.hide();
    }

    handleItemClick(key) {
        this.showFormModal();
        this.setState({
            currentItemKey: key,
            currentItem: _.extend({}, this.state.items[key]),
            tmpItem: _.extend({}, this.state.items[key]),
        });
    }

    handleItemRemove(key) {
        this.showDeleteModal();
        this.setState({
            currentItemKey: key,
        });
    }

    handleConfirmItemRemove(e) {
        e.preventDefault();
        let items = _.filter(this.state.items, (item, key) => {
            return key != this.state.currentItemKey;
        });

        this.props.onChange(items);
        this.hideDeleteModal();
        _.delay(() => this.setState({
            currentItemKey: -1,
            items,
        }), 250);
    }

    handleAddClick() {
        if (this.props.currentItem)
            this.props.addClick();

        this.showFormModal();
    }

    handleSortEnd({oldIndex, newIndex}) {
        let items = arrayMove(this.state.items, oldIndex, newIndex);
        this.props.onChange(items);
        this.setState({items});
    }

    handleInputChange(e) {
        let item = {};
        item[e.target.name] = e.target.value;
        this.setState({
            tmpItem: _.extend(this.state.tmpItem, item)
        });
    }

    handleEditorChange(e) {
        this.setState({
            tmpItem: _.extend(this.state.tmpItem, {
                helperText: e.target.getContent()
            })
        });
    }

    handleFormModalHide() {
        this.setState({
            itemsLoaded: false,
            currentItemKey: -1,
            currentItem: null,
            errors: {},
            tmpItem: {
                stepId: -1,
                name: '',
                description: '',
                helperText: '',
                helperLink: '',

            },
            items: [],
        });
    }

    handleSaveClick(e) {
        e.preventDefault();

        // Validate temporary item
        if (this.validate()) {
            let items = _.extend([], this.state.items);

            if (this.state.currentItemKey == -1) {
                // Add item
                items.push(this.state.tmpItem);
            } else {
                // Edit item
                items[this.state.currentItemKey] = this.state.tmpItem;
            }

            this.hideFormModal();
            this.props.onChange(items);
        }
    }

    handleCancelClick(e) {
        e.preventDefault();
        this.hideFormModal();
        this.hideDeleteModal();
    }

    handleAccordionToggle() {
        if (this.props.currentItem)
            this.refs.hidden.style.display = this.refs.hidden.style.display === "none" ? "" : "none";
    }

    buildLabel(Item, item) {
        if (!Item || Item === undefined) return Item;
        let _glossaries = this.props.glossaries;
        let _label = Item;
        // separate out all selectors and loop through
        let result = strings.getFromBetween.get(_label, "[[", "]]");
        result.forEach((e) => {
          const reg = new RegExp(e);
          // if there's a translation - use it
          const _value = localStorage[e + '_translation'] || localStorage[e];
          if (_value !== '' && !!_value) {
            _label = _label.replace(reg, _value).replace(/\[\[|\]\]/g, '');
          } else {
            // work out pattern [[*.*_*]] for selects
            if (e.indexOf('.') > -1) {
              const field = e.split('.')[0];
              const values = e.split('.')[1].split('_');
              const selected = localStorage[field];
              if (!!selected) {
                const _keys = ['field', 'selector', 'if'];
                _keys.forEach((e) => {
                  if (this.paths[e] && this.paths[e][field]) {
                    const path = this.paths[e][field];
                    const rule = path[Object.keys(path)[0]].node;
    
                    let i = 0;
                    for (var item in rule.options) {
                      if (item === selected)
                        break;
                      i++;
                    }
                    _label = _label.replace(reg, values[i]).replace(/\[\[|\]\]/g, '');
                  }
                })
              }
            } else {
                // if there's no placeholder there, grab all glossaries
                // then concat everything and loop through to find what we're looking for
                let _value = _.map(_glossaries, (element) => {
                  return JSON.parse(element.value);
                });
                if (_value !== []) {
                  let _merged = [];
                  _value.forEach((element) => {
                    _merged = _merged.concat(element['fields'], element['clauses'], element['selectors']);
                  });
                  let replacement = _.find(_merged, (element) => {
                    return element.name === e
                  });
                  if (!!replacement) {
                    _label = _label.replace(reg, replacement.placeholderField).replace(/\[\[|\]\]/g, '');
                  }
                }
              
            }
          }
        })
        return _label;
    }

    render() {
        let nameLabel = this.hasError('name') ? `${strings.get('App.glossaries.glossaryForm.clauses.formModal.name')} ${this.getErrorMessage('name')}` : strings.get('App.glossaries.glossaryForm.clauses.formModal.name');
        let descriptionLabel = this.hasError('description') ? `${strings.get('App.glossaries.glossaryForm.clauses.formModal.description')} ${this.getErrorMessage('description')}` : strings.get('App.glossaries.glossaryForm.clauses.formModal.description');
        let stepLabel = this.hasError('stepId') ? `${strings.get('App.glossaries.glossaryForm.clauses.formModal.step')} ${this.getErrorMessage('stepId')}` : strings.get('App.glossaries.glossaryForm.clauses.formModal.step');
        let helperTextLabel = this.hasError('helperText') ? `${strings.get('App.glossaries.glossaryForm.clauses.formModal.helperText')} ${this.getErrorMessage('helperText')}` : strings.get('App.glossaries.glossaryForm.clauses.formModal.helperText');
        let helperLinkLabel = this.hasError('helperLink') ? `${strings.get('App.glossaries.glossaryForm.clauses.formModal.helperLink')} ${this.getErrorMessage('helperLink')}` : strings.get('App.glossaries.glossaryForm.clauses.formModal.helperLink');
        let placeholderLabel = this.hasError('placeholder') ? `${strings.get('App.glossaries.glossaryForm.fields.placeholder')} ${this.getErrorMessage('placeholder')}` : strings.get('App.glossaries.glossaryForm.fields.placeholder');
        let steps = _.map(this.props.steps, (item) => {
            let newLabel = this.buildLabel(item.name);
            return (<option value={ item.id } key={ item.id }>{ newLabel }</option>);
        });
        let deleteModalContent = (this.state.currentItemKey != -1) ? (
            <span>
                <h2>{ strings.get('App.deleteModal.message', {itemName: this.state.items[this.state.currentItemKey].name}) }</h2>
                <div className="form-actions">
                    <button className="btn btn-lg btn-danger"
                            onClick={ this.handleConfirmItemRemove }>{ strings.get('App.deleteModal.delete') }</button>
                    <button className="btn btn-lg btn-default"
                            onClick={ this.handleCancelClick }>{ strings.get('App.deleteModal.cancel') }</button>
                </div>
            </span>
        ) : null;

        let deleteModal = (
            <DropModal className="boron-modal" ref="deleteModal">
                { deleteModalContent }
            </DropModal>
        );

        let formModal = (
            <FadeModal className="boron-modal form-modal" ref="formModal" onHide={ this.handleFormModalHide }>
                <div className={ this.getErrorClass('name', 'form-group') }>
                    <label className="control-label">{ nameLabel }</label>
                    <input className="form-control" type="text" name="name" value={ this.state.tmpItem.name }
                           onChange={ this.handleInputChange }/>
                </div>
                <div className={ this.getErrorClass('placeholderField', 'form-group') }>
                    <label className="control-label">{ placeholderLabel }</label>
                    <input className="form-control" type="text" name="placeholderField" value={ this.state.tmpItem.placeholderField }
                        onChange={ this.handleInputChange }/>
                </div>
                <div className={ this.getErrorClass('description', 'form-group') }>
                    <label className="control-label">{ descriptionLabel }</label>
                    <textarea className="form-control" name="description" value={ this.state.tmpItem.description }
                              onChange={ this.handleInputChange }></textarea>
                </div>
                <div className={ this.getErrorClass('stepId', 'form-group') }>
                    <label className="control-label">{ stepLabel } </label>
                    <select className="form-control" name="stepId" value={ this.state.tmpItem.stepId }
                            onChange={ this.handleInputChange }>
                        <option value="-1" disabled>{strings.get('App.glossaries.glossaryForm.choose')}</option>
                        { steps }
                    </select>
                </div>
                <div className={ this.getErrorClass('placeholder', 'form-group') }>
                    <label className="control-label">{ placeholderLabel }</label>
                    <input className="form-control" type="text" name="placeholder" value={ this.state.tmpItem.placeholder }
                        onChange={ this.handleInputChange }/>
                </div>
                <div className={ this.getErrorClass('helperText', 'form-group') }>
                    <label className="control-label">{ helperTextLabel }</label>
                    {/* <input className="form-control" type="text" name="helperText"
                           value={ this.state.tmpItem.helperText } onChange={ this.handleInputChange }/> */}
                    <Editor name="helperText" content={ this.state.tmpItem.helperText } handleChange={ this.handleEditorChange } height={200} />
                </div>
                <div className={ this.getErrorClass('helperLink', 'form-group') }>
                    <label className="control-label">{ helperLinkLabel }</label>
                    <input className="form-control" type="text" name="helperLink"
                           value={ this.state.tmpItem.helperLink } onChange={ this.handleInputChange }/>
                    
                </div>
                <div className="form-actions">
                    <button className="btn btn-primary"
                            onClick={ this.handleSaveClick }>{strings.get('App.glossaries.glossaryForm.clauses.formModal.save')}</button>
                    <button className="btn btn-default"
                            onClick={ this.handleCancelClick }>{strings.get('App.glossaries.glossaryForm.clauses.formModal.cancel')}</button>
                </div>
            </FadeModal>
        );

        let labelClassName = (this.props.currentItem) ? "pointer control-label" : "control-label";
        let divStyle = (this.props.currentItem) ? {display: "none"} : {};

        return (
            <div className="GlossaryFormClauses form-group">
                { deleteModal }
                { formModal }
                <div className="header">
                    <label onClick={ this.handleAccordionToggle }
                           className={ labelClassName }>{strings.get('App.glossaries.glossaryForm.clauses.title')}</label>
                    <span className="btn btn-default small-add" onClick={ this.handleAddClick }>
                        <i className="ion-android-add"></i>
                    </span>
                </div>
                <div style={ divStyle } ref="hidden">
                    <SortableList
                        items={ this.state.items }
                        onSortEnd={ this.handleSortEnd }
                        axis="xy"
                        useDragHandle={ true }
                        lockToContainerEdges={ true }
                        helperClass="SortableItem Clause"
                    />
                </div>

            </div>
        );
    }

}

GlossaryFormClauses.propTypes = {
    items: React.PropTypes.array,
    steps: React.PropTypes.object,
    glossaries: React.PropTypes.object.isRequired,
    currentGlossary: React.PropTypes.object,
    onChange: React.PropTypes.func.isRequired,
}

export default GlossaryFormClauses;