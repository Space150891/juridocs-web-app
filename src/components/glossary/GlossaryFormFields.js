import React, { Component } from 'react'
import autoBind from 'react-autobind'
import { connect } from 'react-redux'
import strings from '../../services/strings'
import { Link, browserHistory } from 'react-router'
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc'
import _ from 'lodash'

import FadeModal from 'boron/FadeModal'
import DropModal from 'boron/DropModal'
import ActiveLabel from '../ActiveLabel'
import GlossaryFormFieldOptions from './GlossaryFormFieldOptions'
import GlossaryFormFieldNumericCondition from './GlossaryFormFieldNumericCondition'
import Editor from '../Editor'

let componentInstance = null

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
  )
})

const SortableList = SortableContainer(({items}) => {
  let rows = _.map(items, (value) => {
    return (
      <SortableItem key={`item-${value.index}`} index={ value.index } value={ value }/>
    )
  })

  return (
    <div>
      { rows }
    </div>
  )
})

class GlossaryFormFields extends Component {

  types = {
    TEXT: 'text',
    TEXTAREA: 'textarea',
    NUMERIC: 'numeric',
    DATE: 'date',
    SELECTOR: 'selector',
    GENDER_SELECTOR: 'gender_selector',
  }

  state = {
    itemsLoaded: false,
    currentItemKey: -1,
    currentItem: null,
    errors: {},
    tmpItem: {
      stepId: -1,
      name: '',
      label: '',
      type: this.types.TEXT,
      options: [],
      male: '',
      female: '',
      condition: {
        type: '',
        percentage: 100,
        field: '',
      },
      placeholder: '',
      placeholderField: '',
      helperText: '',
      helperLink: '',
      warningText: '',
      isRequired: 1,
    },
    items: [],
    warningClass: "form-group hidden",
  }

  componentDidMount () {
    this.tryLoadItems()
  }

  componentDidUpdate () {
    this.tryLoadItems()
  }

  constructor (props) {
    super(props)
    autoBind(this)
    componentInstance = this
  }

  tryLoadItems () {
    if (_.size(this.props.items) && !this.state.itemsLoaded) {
      this.setState({
        itemsLoaded: true,
        items: this.props.items,
      })
    } else if (!this.state.tmpItem.name && this.props.currentItem && this.props.currentItem.type === 'field') {
      let tmpItem = _.extend({}, this.state.tmpItem);
      tmpItem.name = this.props.currentItem.name;
        if(tmpItem.isRequired === "2") {
            this.setState({warningClass: "form-group"});
        } else {
            this.setState({warningClass: "form-group hidden"});
        }
      this.setState({
        tmpItem
      })
    } else if (_.size(this.state.items) && _.size(this.props.items) && this.state.items !== this.props.items) {
      this.setState({items: this.props.items})
    } else if (_.size(this.props.items) === 0 && this.props.currentItem && this.state.itemsLoaded) {
      this.setState({itemsLoaded: false, items: this.props.items})
    }


  }

  validate () {
    let item = this.state.tmpItem
    let duplicate = this.isDuplicated(item)
    let errors = {}

    if (item.name == '') {
      errors['name'] = strings.get('Exceptions.required')
    }
    else if (!/^[a-z0-9_]+$/.test(item.name)) {
      errors['name'] = strings.get('Exceptions.onlyLowercase')
    }

    if (item.label == '') {
      errors['label'] = strings.get('Exceptions.required')
    }

    if (item.stepId == -1) {
      errors['stepId'] = strings.get('Exceptions.required')
    }

    if (item.type == this.types.SELECTOR && item.options == '') {
      errors['options'] = strings.get('Exceptions.requireds')
    }

    if (duplicate) {
      if (_.isObject(duplicate)) {
        errors['name'] = strings.get('Exceptions.glossaryDuplicate', {itemName: duplicate.name})
      } else {
        errors['name'] = strings.get('Exceptions.glossaryDuplicate')
      }
    }

    if (_.size(errors)) {
      this.setState({errors})
      return false
    }

    return true
  }

  isDuplicated (item) {
    let duplicate
    let currentGlossary = this.props.currentGlossary

    // If item has been edited and name didn't change is not duplicate
    if (this.state.currentItem && item.name == this.state.currentItem.name) {
      return null
    }

    // Check duplicates in other glossaries
    _.each(this.props.glossaries, glossary => {
      // Skip current glossary
      if (!currentGlossary || currentGlossary.id != glossary.id) {
        let value = JSON.parse(glossary.value)

        _.each(value.fields, field => {
          if (field.name == item.name) {
            duplicate = glossary
          }
        })
      }
    })

    // Check duplicates into current glossary
    _.each(this.state.items, field => {
      if (field.name == item.name) {
        duplicate = true
      }
    })

    return duplicate
  }

  hasError (inputName) {
    return !!this.state.errors[inputName]
  }

  getErrorClass (inputName, defaultClasses = '') {
    return this.hasError(inputName) ? defaultClasses + ' has-error' : defaultClasses
  }

  getErrorMessage (inputName) {
    return this.state.errors[inputName]
  }

  showFormModal () {
    this.refs.formModal.show()
  }

  showDeleteModal () {
    this.refs.deleteModal.show()
  }

  hideFormModal () {
    this.refs.formModal.hide()
  }

  hideDeleteModal () {
    this.refs.deleteModal.hide()
  }

  handleItemClick (key) {
    this.showFormModal()
    this.setState({
      currentItemKey: key,
      currentItem: _.extend({}, this.state.items[key]),
      tmpItem: _.extend({}, this.state.items[key]),
    })
  }

  handleItemRemove (key) {
    this.showDeleteModal()
    this.setState({
      currentItemKey: key,
    })
  }

  handleConfirmItemRemove (e) {
    e.preventDefault()
    let items = _.filter(this.state.items, (item, key) => {
      return key != this.state.currentItemKey
    })

    this.props.onChange(items)
    this.hideDeleteModal()
    _.delay(() => this.setState({
      currentItemKey: -1,
      items,
    }), 250)
  }

  handleAddClick () {
    if (this.props.currentItem)
      this.props.addClick()

    this.showFormModal()
  }

  handleSortEnd ({oldIndex, newIndex}) {
    let items = arrayMove(this.state.items, oldIndex, newIndex)
    this.props.onChange(items)
    this.setState({items})
  }

  handleInputChange (e) {
    let item = {}
    item[e.target.name] = e.target.value
    this.setState({
      tmpItem: _.extend(this.state.tmpItem, item)
    })
  }

  handleEditorChangeHelper(e) {
    this.setState({
        tmpItem: _.extend(this.state.tmpItem, {
            helperText: e.target.getContent()
        })
    });
  }

  handleEditorChangeWarning(e) {
    this.setState({
        tmpItem: _.extend(this.state.tmpItem, {
            warningText: e.target.getContent()
        })
    });
  }

  handleRequiredChange (e) {
    let item = {}
    item[e.target.name] = e.target.value
    this.setState({
      tmpItem: _.extend(this.state.tmpItem, item)
    })

    if(e.target.value === "2") {
     this.setState({warningClass: "form-group"});
    } else {
      this.setState({warningClass: "form-group hidden"});
    }
  }

  handleCheckboxChange (e) {
    let item = {}
    item[e.target.name] = e.target.checked
    this.setState({
      tmpItem: _.extend(this.state.tmpItem, item)
    })
  }

  handleOptionsChange (options) {
    this.setState({
      tmpItem: _.extend(this.state.tmpItem, {options})
    })
  }

  handleNumericContitionChange (condition) {
    this.setState({
      tmpItem: _.extend(this.state.tmpItem, {condition})
    })
  }

  handleFormModalHide () {
    this.setState({
      itemsLoaded: false,
      currentItemKey: -1,
      currentItem: null,
      errors: {},
      tmpItem: {
        stepId: -1,
        name: '',
        label: '',
        type: this.types.TEXT,
        options: [],
        male: '',
        female: '',
        condition: {
          type: '',
          percentage: 100,
          field: '',
        },
        placeholder: '',
        helperText: '',
        helperLink: '',
        isRequired: 1,
        warningText: '',
      },
      items: [],
    })
  }

  handleSaveClick (e) {
    e.preventDefault()

    // Validate temporary item
    if (this.validate()) {
      let items = _.extend([], this.state.items)

      if (this.state.currentItemKey == -1) {
        // Add item
        items.push(this.state.tmpItem)
      } else {
        // Edit item
        items[this.state.currentItemKey] = this.state.tmpItem
      }
      this.hideFormModal()
      this.props.onChange(items)
    }
  }

  handleCancelClick (e) {
    e.preventDefault()
    this.hideFormModal()
    this.hideDeleteModal()
  }

  handleAccordionToggle () {
    if (this.props.currentItem)
      this.refs.hidden.style.display = this.refs.hidden.style.display === 'none' ? '' : 'none'
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


  render () {
    let nameLabel = this.hasError('name') ? `${strings.get('App.glossaries.glossaryForm.fields.name')} ${this.getErrorMessage('name')}` : strings.get('App.glossaries.glossaryForm.fields.name')
    let labelLabel = this.hasError('label') ? `${strings.get('App.glossaries.glossaryForm.fields.label')} ${this.getErrorMessage('label')}` : strings.get('App.glossaries.glossaryForm.fields.label')
    let stepLabel = this.hasError('stepId') ? `${strings.get('App.glossaries.glossaryForm.fields.step')} ${this.getErrorMessage('stepId')}` : strings.get('App.glossaries.glossaryForm.fields.step')
    let typeLabel = this.hasError('type') ? `${strings.get('App.glossaries.glossaryForm.fields.type')} ${this.getErrorMessage('type')}` : strings.get('App.glossaries.glossaryForm.fields.type')
    let placeholderLabel = this.hasError('placeholder') ? `${strings.get('App.glossaries.glossaryForm.fields.placeholder')} ${this.getErrorMessage('placeholder')}` : strings.get('App.glossaries.glossaryForm.fields.placeholder')
    let optionsLabel = this.hasError('options') ? `${strings.get('App.glossaries.glossaryForm.fields.options')} ${this.getErrorMessage('options')}` : strings.get('App.glossaries.glossaryForm.fields.options')
    let maleLabel = this.hasError('male') ? `${strings.get('App.glossaries.glossaryForm.fields.male')} ${this.getErrorMessage('male')}` : strings.get('App.glossaries.glossaryForm.fields.male')
    let femaleLabel = this.hasError('female') ? `${strings.get('App.glossaries.glossaryForm.fields.female')} ${this.getErrorMessage('female')}` : strings.get('App.glossaries.glossaryForm.fields.female')
    let helperTextLabel = this.hasError('helperText') ? `${strings.get('App.glossaries.glossaryForm.fields.helperText')} ${this.getErrorMessage('helperText')}` : strings.get('App.glossaries.glossaryForm.fields.helperText')
    let warningTextLabel = this.hasError('warningText') ? `${strings.get('App.glossaries.glossaryForm.fields.warningText')} ${this.getErrorMessage('warningText')}` : strings.get('App.glossaries.glossaryForm.fields.warningText')
    let helperLinkLabel = this.hasError('helperLink') ? `${strings.get('App.glossaries.glossaryForm.fields.helperLink')} ${this.getErrorMessage('helperLink')}` : strings.get('App.glossaries.glossaryForm.fields.helperLink')
    let isRequiredLabel = this.hasError('isRequired') ? `${strings.get('App.glossaries.glossaryForm.fields.isRequired')} ${this.getErrorMessage('isRequired')}` : strings.get('App.glossaries.glossaryForm.fields.isRequired')
    let Test = "divide answer question ([[age_o_or_a]]) about age by 3";
    let steps = _.map(this.props.steps, (item) => {
      let newLabel = this.buildLabel(item.name);
      return (<option value={ item.id } key={ item.id }>{ newLabel }</option>)
    })

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
    ) : null

    let deleteModal = (
      <DropModal className="boron-modal" ref="deleteModal">
        { deleteModalContent }
      </DropModal>
    )

    let optionsFormGroup = null
    let numericConditionFormGroup = null

    if (this.state.tmpItem.type == this.types.NUMERIC) {
      numericConditionFormGroup = (
        <GlossaryFormFieldNumericCondition
          field={ this.state.tmpItem }
          fields={ this.state.items }
          onChange={ this.handleNumericContitionChange }
        />
      )
    }

    else if (this.state.tmpItem.type == this.types.SELECTOR) {
      optionsFormGroup = (
        <GlossaryFormFieldOptions
          added={ this.state.tmpItem.options }
          onChange={ this.handleOptionsChange }
        />
      )
    }

    else if (this.state.tmpItem.type == this.types.GENDER_SELECTOR) {
      optionsFormGroup = (
        <span>
                    <div className={ this.getErrorClass('male', 'form-group') }>
                        <label className="control-label">{ maleLabel }</label>
                        <input className="form-control" type="text" name="male" value={ this.state.tmpItem.male }
                               onChange={ this.handleInputChange }/>
                    </div>
                    <div className={ this.getErrorClass('female', 'form-group') }>
                        <label className="control-label">{ femaleLabel }</label>
                        <input className="form-control" type="text" name="female" value={ this.state.tmpItem.female }
                               onChange={ this.handleInputChange }/>
                    </div>
                </span>
      )
    }

    let formModal = (
      <FadeModal className="boron-modal form-modal" ref="formModal" onHide={ this.handleFormModalHide }>
        <div className="scrollable">
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
          <div className={ this.getErrorClass('label', 'form-group') }>
            <label className="control-label">{ labelLabel }</label>
            {/* THIS LABEL !!! */}
            <textarea className="form-control" name="label" value={ this.state.tmpItem.label }
                      onChange={ this.handleInputChange }></textarea>
          </div>
          <div className={ this.getErrorClass('stepId', 'form-group') }>
            <label className="control-label">{ stepLabel }</label>
            <select className="form-control" name="stepId" value={ this.state.tmpItem.stepId }
                    onChange={ this.handleInputChange }>
              <option value="-1" disabled>{strings.get('App.glossaries.glossaryForm.fields.choose')}</option>
              { steps }
            </select>
          </div>
          <div className={ this.getErrorClass('type', 'form-group') }>
            <label className="control-label">{ typeLabel }</label>
            <select className="form-control" name="type" value={ this.state.tmpItem.type }
                    onChange={ this.handleInputChange }>
              <option value={ this.types.TEXT }>{strings.get('App.glossaries.glossaryForm.fields.types.text')}</option>
              <option
                value={ this.types.TEXTAREA }>{strings.get('App.glossaries.glossaryForm.fields.types.textarea')}</option>
              <option
                value={ this.types.NUMERIC }>{strings.get('App.glossaries.glossaryForm.fields.types.numeric')}</option>
              <option value={ this.types.DATE }>{strings.get('App.glossaries.glossaryForm.fields.types.date')}</option>
              <option
                value={ this.types.SELECTOR }>{strings.get('App.glossaries.glossaryForm.fields.types.selector')}</option>
              <option
                value={ this.types.GENDER_SELECTOR }>{strings.get('App.glossaries.glossaryForm.fields.types.genderSelector')}</option>
            </select>
          </div>
          { optionsFormGroup }
          { numericConditionFormGroup }
          <div className={ this.getErrorClass('placeholder', 'form-group') }>
            <label className="control-label">{ placeholderLabel }</label>
            <input className="form-control" type="text" name="placeholder" value={ this.state.tmpItem.placeholder }
                   onChange={ this.handleInputChange }/>
          </div>
          <div className={ this.getErrorClass('helperText', 'form-group') }>
            <label className="control-label">{ helperTextLabel }</label>
            {/* <input className="form-control" type="text" name="helperText" value={ this.state.tmpItem.helperText }
                   onChange={ this.handleInputChange }/> */}
            <Editor name="helperText" content={ this.state.tmpItem.helperText } handleChange={ this.handleEditorChangeHelper } height={200} />
          </div>
          <div className={ this.getErrorClass('helperLink', 'form-group') }>
            <label className="control-label">{ helperLinkLabel }</label>
            <input className="form-control" type="text" name="helperLink" value={ this.state.tmpItem.helperLink }
                   onChange={ this.handleInputChange }/>
          </div>
          <div className={ this.getErrorClass('isRequired', 'form-group') }>
            <label className="control-label">{ isRequiredLabel }</label>
            <select className="form-control" name="isRequired" value={ this.state.tmpItem.isRequired }
                    onChange={ this.handleRequiredChange }>
              <option value={ 1 }>Required</option>
              <option value={ 2 }>Required with deny option</option>
              <option value={ 0 }>Optional</option>
            </select>
          </div>
          <div className={this.getErrorClass('warningText', this.state.warningClass)}>
            <label className="control-label">{ warningTextLabel }</label>
            {/* <input className="form-control" type="text" name="warningText" value={ this.state.tmpItem.warningText }
                    onChange={ this.handleInputChange }/> */}
            <Editor name="warningText" content={ this.state.tmpItem.warningText } handleChange={ this.handleEditorChangeWarning } height={200} />
          </div>
        </div>
        <div className="form-actions">
          <button className="btn btn-primary"
                  onClick={ this.handleSaveClick }>{strings.get('App.glossaries.glossaryForm.fields.save')}</button>
          <button className="btn btn-default"
                  onClick={ this.handleCancelClick }>{strings.get('App.glossaries.glossaryForm.fields.cancel')}</button>
        </div>
      </FadeModal>
    )
    let newItems = this.state.items
    let y = []
    newItems.map((item, index) => {
      if (!y[item['stepId'] - 1])
        y[item['stepId'] - 1] = []
      item.index = index
      y[item['stepId'] - 1].push(item)
    })
    newItems = []
    y.map((item) => {
      if (typeof item !== 'undefined')
        newItems.push(item)
    })

    let list = newItems.map((item, i) => {
      let stepName = _.size(this.props.steps) ? this.buildLabel(this.props.steps['_' + item[0].stepId].name) : null
      return (
        <div key={ 'item-' + i }>
          <label>{strings.get('App.glossaries.glossaryForm.fields.stepTitle', {stepName})}</label>
          <SortableList
            items={ item }
            onSortEnd={ this.handleSortEnd }
            axis="xy"
            useDragHandle={ true }
            lockToContainerEdges={ true }
            helperClass="SortableItem Field"
          />
        </div>
      )
    })

    let labelClassName = (this.props.currentItem) ? 'pointer control-label' : 'control-label'
    let divStyle = (this.props.currentItem) ? {display: 'none'} : {}

    return (
      <div className="GlossaryFormFields form-group">
        { deleteModal }
        { formModal }
        <div className="header">
          <label onClick={ this.handleAccordionToggle }
                 className={ labelClassName }>{strings.get('App.glossaries.glossaryForm.fields.title')}</label>
          <span className="btn btn-default small-add" onClick={ this.handleAddClick }>
                        <i className="ion-android-add"></i>
                    </span>
        </div>
        <div style={ divStyle } ref="hidden">
          { list }
        </div>
      </div>
    )
  }

}

GlossaryFormFields.propTypes = {
  items: React.PropTypes.array,
  steps: React.PropTypes.object,
  onChange: React.PropTypes.func.isRequired,
}

export default GlossaryFormFields