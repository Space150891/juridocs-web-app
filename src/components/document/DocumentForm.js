import React, {Component} from 'react';
import autoBind from 'react-autobind';
import {connect} from 'react-redux';
import strings from '../../services/strings';
import language from '../../services/language';
import {browserHistory} from 'react-router';
import _ from 'lodash';
import './DocumentOrderField.scss';
import GlossaryForm from '../glossary/GlossaryForm';

import Editor from '../Editor';
import Dropzone from 'react-dropzone';

import Modal from 'boron/DropModal';
import {SortableHandle, SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';

let modal, templateData;

const SortableDragger = SortableHandle(() => {
  return (
    <i className="label-drag ion-android-more-vertical"/>
  );
});

const SortableItem = SortableElement(({value}) => {
  return (
    <div className="ActiveLabel">
      <div className="label-content">
        <SortableDragger/>
        <span/>
        {value.name}
      </div>
    </div>
  );
});

const SortableList = SortableContainer(({items}) => {
  let newItems = [];
  _.map(items, (value, ind) => {
    newItems.push(_.extend({newIndex: ind}, value));
  });
  let rows = _.map(newItems, (value) => {
    return (
      <SortableItem key={`item-${value.newIndex}`} index={value.newIndex} value={value}/>
    );
  });

  return (
    <div style={{width: "200px"}}>
      {rows}
    </div>
  );
});

class StepTabs extends Component {

  constructor(props) {
    super(props);
    autoBind(this);
  }

  render() {
    let className = 'tabItem';
    let items = _.map(this.props.items, (item, index) => {
      className = index === this.props.currentItemId ? 'tabItem active' : 'tabItem';
      return (
        <label className={className} key={`item-${index}`} onClick={() => {
          this.props.onClick(index)
        }}>{item.name}</label>
      );
    });
    return (
      <div>
        {items}
      </div>
    );
  }
}

class DocumentForm extends Component {

  state = {
    currentItemLoaded: false,
    stepsLoaded: false,
    fieldsLoaded: false,
    file: null,
    fileRejected: false,
    payed: false,
    checkedReadMore: false,
    form: {
      category_id: '',
      language_id: language.get(),
      name: '',
      description: "",
      read_more_link: "",
      template: '',
      payed: 0,
      price: '',
      published: '',
      shareable: false
    },
    currentRule: {},
  };

  componentDidMount() {
    modal = this.refs.orderFieldsModal;
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
      let payed;
      _.map(this.state.form, (value, key) => {
        form[key] = (this.props.currentItem[key]) ? this.props.currentItem[key] : this.state.form[key];
        if (key === 'payed') payed = !!form[key];
      });

      this.setState({
        currentItemLoaded: true,
        payed,
        form
      });
    }
    if ((_.size(this.props.fields) && !this.state.fieldsLoaded) || (this.state.fieldsLoaded && _.size(this.props.fields) !== this.state.fieldsCount)) {
      let newFields = _.map(this.props.fields, (item) => {
        return item.asMutable ? item.asMutable() : item;
      });
      _.map(this.props.selectors, (item) => {
        newFields.push(item.asMutable ? item.asMutable() : item);
      });
      _.map(this.props.clauses, (item) => {
        newFields.push(item.asMutable ? item.asMutable() : item);
      });
      if (this.props.fieldsOrder) {
        _.map(newFields, (item) => {
          if (typeof this.props.fieldsOrder[item.name] !== "undefined")
            item.index = this.props.fieldsOrder[item.name];
        });
        newFields = _.sortBy(newFields, 'index');
      }
      newFields = this.orderFieldsByStep(newFields);
      this.setState({
        fieldsLoaded: true,
        fields: newFields,
        formChanged: false,
        fieldsCount: _.size(this.props.fields),
      });
    }
    if (_.size(this.props.stepsFromValidation) && !this.state.stepsLoaded) {
      let items = _.map(this.props.stepsFromValidation, (step) => {
        return step
      });
      this.setState({
        stepsLoaded: true,
        steps: items,
        currentStepId: 0
      });
    }
    templateData = this.state.form;
  }

  hasError(inputName) {
    return (inputName === 'image') ? this.state.fileRejected : !!this.props.exceptions[inputName];
  }

  getErrorClass(inputName, defaultClasses = '') {
    return this.hasError(inputName) ? defaultClasses + ' has-error' : defaultClasses;
  }

  getErrorMessage(inputName) {
    if (inputName === 'template' && _.isObject(this.props.exceptions[inputName])) {
      return strings.get('Exceptions.notAddedRules');
    } else {
      return this.props.exceptions[inputName];
    }
  }

  getPreviewImage() {
    if (this.state.file) {
      return (<img src={this.state.file.preview}/>);
    } else {
      return (this.props.currentItem && this.props.currentItem.imageURL) ? (
        <img src={this.props.currentItem.imageURL}/>
      ) : null;
    }
  }

  handleAddRule(e, ruleName, type) {
    e.preventDefault();
    this.setState({currentRule: {name: ruleName, type}});
    this.showRuleAddModal();
  }

  showRuleAddModal() {
    this.refs.ruleAddModal.show();
  }

  hideRuleAddModal() {
    this.refs.ruleAddModal.hide();
  }

  getTemplateErrors() {
    if (this.props.exceptions.template && this.props.exceptions.template.notDefined) {
      let errors = this.props.exceptions.template.notDefined;

      let wrongFields = "";
      let wrongClauses = "";
      let wrongSelectors = "";
      if (errors) {
        if (errors.fields) {
          wrongFields = _.map(_.uniq(errors.fields), (field, i) => {
            return (
              <span key={`item-${i}`}>
                                {field}
                <button onClick={(e) => {
                  this.handleAddRule(e, field, "field")
                }} className="btn btn-default add-button" id={i}>+</button>
                                <br/>
                            </span>
            );
          });
        }
        if (errors.clauses) {
          wrongClauses = _.map(_.uniq(errors.clauses), (clause, i) => {
            return (
              <span key={`item-${i}`}>
                                {clause}
                <button onClick={(e) => {
                  this.handleAddRule(e, clause, "clause")
                }} className="btn btn-default add-button" id={i}>+</button>
                                <br/>
                            </span>
            );
          });
        }
        if (errors.selectors) {
          wrongSelectors = _.map(_.uniq(errors.selectors), (selector, i) => {
            return (
              <span key={`item-${i}`}>
                                {selector}
                <button onClick={(e) => {
                  this.handleAddRule(e, selector, "selector")
                }} className="btn btn-default add-button" id={i}>+</button>
                                <br/>
                            </span>
            );
          });
        }
      }

      return (
        <div className="alert alert-danger">
          {errors.selectors ? (
            <p>Selectors: {wrongSelectors}</p>
          ) : null}
          {errors.clauses ? (
            <p>Clauses: {wrongClauses}</p>
          ) : null}
          {errors.fields ? (
            <p>Fields: {wrongFields}</p>
          ) : null}
        </div>
      );
    }
  }

  handleInputChange(e) {
    let form = {};

    form[e.target.name] = e.target.value;
    this.setState({
      form: _.extend(this.state.form, form)
    });
  }

  handleEditorChange(e) {
    this.setState({
      tmpItem: _.extend(this.state.form, {
        description: e.target.getContent()
      })
    });
  }

  handlePayedChange(e) {
    this.setState({
      payed: e.target.checked,
      form: _.extend(this.state.form, {
        payed: e.target.checked ? 1 : 0,
      })
    });
  }

  handleTemplateChange(e) {
    this.setState({
      form: _.extend(this.state.form, {
        template: e.target.getContent(),
      }),
    });
    templateData = this.state.form;
  }

  handleFileDrop(acceptedFiles, rejectedFiles) {
    if (rejectedFiles.length) {
      this.setState({
        fileRejected: true,
      })
    } else {
      this.setState({
        file: _.first(acceptedFiles),
        fileRejected: false,
      })
    }
  }

  handleSaveClick(e) {
    e.preventDefault();
    this.props.saveItem(_.extend(this.state, {
      form: _.extend(this.state.form, {
        language_id: language.get()
      })
    }));
  }

  orderFieldsByStep(arr) {
    let y = [];
    _.map(arr, (field) => {
      if (!y[field['stepId'] - 1])
        y[field['stepId'] - 1] = [];
      y[field['stepId'] - 1].push(field);
    });

    let newArr = [];
    y = _.map(y, (item) => {
      if (typeof item !== 'undefined')
        newArr.push(item);
    });

    return newArr;
  }

  orderFieldsModalCancel() {

    /*let newFields = _.map(this.props.fields, (item) => {return item;});
    _.map(this.props.selectors,(selector) => {newFields.push(selector);});
    _.map(this.props.clauses,(clause) => {newFields.push(clause);});
    newFields = this.orderFieldsByStep(newFields);*/
    this.refs.orderFieldsModal.hide();

    /*this.setState({
        fields: newFields,
    });*/
  }

  orderFieldsModalConfirm() {
    let newFields = {};
    let ind = 0;
    _.map(this.state.fields, (items) => {
      _.map(items, (item) => {
        newFields[item.name] = ind;
        ind++;
      });
    });

    this.props.updateItemOrder(newFields);
    this.refs.orderFieldsModal.hide();
  }

  handleCancelClick(e) {
    e.preventDefault();
    browserHistory.push('/documents');
  }

  handleSortEnd({oldIndex, newIndex, index}) {
    let items = arrayMove(this.state.fields[index], oldIndex, newIndex);
    let newItems = [];
    _.map(this.state.fields, (field, ind) => {
      if (ind === index) {
        newItems[ind] = items;
      } else {
        newItems[ind] = field;
      }
    });
    this.setState({fields: newItems});
  }

  handleTabsItemClick(id) {
    this.setState({currentStepId: id});
  }

  getCategoryTree(items, item, arr, depth = 0) {
    if (_.size(items) && _.find(items, item)) {
      if (item.parent_id && depth === 0)
        return;
      arr[0].push(item);
      arr[1].push(depth);
      _.map(items, (it) => {
        if (item.id === it.parent_id) {
          this.getCategoryTree(items, it, arr, depth + 1);
        }
      });
    }
  }

  saveGlossary(data) {
    let gloss = {};
    _.map(this.props.glossaries, (glossary) => {
      if (data.form.name === glossary.name) {
        gloss.id = glossary.id;
        gloss.name = glossary.name;
        return;
      }
    });
    if (gloss.id) {
      this.props.updateGlossary(gloss.id, data.form);
    } else {
      this.props.createGlossary(data.form);
    }
    this.hideRuleAddModal();
  }

  handleChange() {
    if (!this.state.form.read_more_link) {
      this.setState({
        checkedReadMore: !this.state.checkedReadMore
      })
    }
  }

  handleChangeSharability() {
      this.state.form.shareable = !this.state.form.shareable;
      this.setState(this.state);
  }

  render() {
    const readMoreLink = this.state.checkedReadMore || this.state.form.read_more_link
      ? <div className='form-group'>
        <label className="control-label">{strings.get('App.documents.documentForm.readMoreLink')}</label>
        <input type="text" className="form-control" name="read_more_link" value={this.state.form.read_more_link}
               onChange={this.handleInputChange}/>
      </div>
      : null;
    let nameLabel = this.hasError('name') ? `${strings.get('App.documents.documentForm.name')} ${this.getErrorMessage('name')}` : strings.get('App.documents.documentForm.name');
    let priceLabel = this.hasError('price') ? `${strings.get('App.documents.documentForm.price')} ${this.getErrorMessage('price')}` : strings.get('App.documents.documentForm.price');
    let categoryLabel = this.hasError('category_id') ? `${strings.get('App.documents.documentForm.category')} ${this.getErrorMessage('category_id')}` : strings.get('App.documents.documentForm.category');
    let templateLabel = this.hasError('template') ? `${strings.get('App.documents.documentForm.template')} ${this.getErrorMessage('template')}` : strings.get('App.documents.documentForm.template');
    let imageLabel = this.hasError('image') ? strings.get('Exceptions.imageTooBig') : strings.get('App.documents.documentForm.image');

    let arr = [[], []];
    _.map(this.props.categories, (item) => {
      this.getCategoryTree(this.props.categories, item, arr);
    });

    let categories = _.map(arr[0], (category, i) => {
      let sub = arr[1][i] ? " ".repeat(Math.round(arr[1][i] * 3 + arr[1][i] * 3)) + "|" + "_" : " ";
      return <option className={`depth-${arr[1][i]}`} value={category.id} key={category.id}>
        {`${sub} ${category.name}`}
      </option>;
    });

    let descriptionLabel = this.hasError('description') ? `${strings.get('App.documents.documentForm.description')} ${this.getErrorMessage('description')}` : strings.get('App.documents.documentForm.description');
    let priceFormGroup = this.state.form.payed ? (
      <div className={this.getErrorClass('price', 'form-group col-sm-12 col-md-10 col-lg-8')}>
        <label className="control-label">{priceLabel}</label>
        <input className="form-control" type="text" name="price" value={this.state.form.price}
               onChange={this.handleInputChange}/>
      </div>
    ) : null;

    let dropzoneContent = this.getPreviewImage() ? this.getPreviewImage() : strings.get('App.documents.documentForm.chooseImage');

    let templateErrors = this.getTemplateErrors();


    let sortableListsBySteps;
    if (_.size(this.state.fields)) {
      let listItems = this.state.fields[this.state.currentStepId];
      sortableListsBySteps =
        (
          <div key={`item-${this.state.currentStepId}`}>
            <SortableList
              items={listItems}
              onSortEnd={({oldIndex, newIndex}) => {
                this.handleSortEnd({oldIndex, newIndex, index: this.state.currentStepId})
              }}
              axis="xy"
              useDragHandle={true}
              lockToContainerEdges={true}
              helperClass="SortableItem Field"
            />
          </div>
        );
    }
    let orderFieldsModalContent = (
      <div>
        <label>{strings.get('App.documents.documentForm.orderFieldsModal.title')}</label><br/>
        <StepTabs
          items={this.state.steps}
          currentItemId={this.state.currentStepId}
          fields={this.state.fields}
          onClick={this.handleTabsItemClick}
        />
        {sortableListsBySteps}
        <button style={{marginRight: ".4rem"}} className="btn btn-primary"
                onClick={this.orderFieldsModalConfirm}>{strings.get('App.documents.documentForm.orderFieldsModal.save')}</button>
        <button style={{marginLeft: ".4rem"}} className="btn btn-default"
                onClick={this.orderFieldsModalCancel}>{strings.get('App.documents.documentForm.orderFieldsModal.cancel')}</button>
      </div>
    );
    return (
      <div className="DocumentForm row">
        <Modal className="boron-modal" ref="orderFieldsModal">
          {orderFieldsModalContent}
        </Modal>
        <Modal className="boron-modal" ref="ruleAddModal">
          <GlossaryForm
            exceptions={this.props.exceptions}
            categories={this.props.categories}
            glossaries={this.props.glossaries}
            steps={this.props.steps}
            saveItem={this.saveGlossary}
            currentRule={this.state.currentRule}
            hideAddRuleModal={this.hideRuleAddModal}
          />
        </Modal>

        <form>
          <div className={this.getErrorClass('name', 'form-group col-sm-12 col-md-10 col-lg-8')}>
            <label className="control-label">{nameLabel}</label>
            <input className="form-control" type="text" name="name" value={this.state.form.name}
                   onChange={this.handleInputChange}/>
          </div>
          <div className={this.getErrorClass('category_id', 'form-group col-sm-12 col-md-10 col-lg-8')}>
            <label className="control-label">{categoryLabel}</label>
            <select className="form-control" name="category_id" value={this.state.form.category_id}
                    onChange={this.handleInputChange}>
              <option value="" disabled>{strings.get('App.documents.documentForm.choose')}</option>
              {categories}
            </select>
          </div>
          <div className="checkbox form-group col-sm-12 col-md-10 col-lg-8">
            <label>
              <input type="checkbox" checked={this.state.form.payed} onChange={this.handlePayedChange}/>
              {strings.get('App.documents.documentForm.payed')}
            </label>
          </div>
          {priceFormGroup}


          {/* TODO: Need to change. Don't support all 3 languages */}
          {this.props.currentItem ?
            <div className="form-group col-sm-12 col-md-10 col-lg-8">
              {/*<label className="control-label">
                                {strings.get('App.categoryForm.visibility.title')}
                            </label>*/}
              <select className="form-control" name="published"
                      value={this.state.form.published || this.props.currentItem.published}
                      onChange={this.handleInputChange}>
                <option value="1">Publish</option>
                <option value="0">Unpublish</option>
              </select>
            </div> : ''
          }


          <div className={this.getErrorClass('image', 'form-group col-sm-12 col-md-10 col-lg-8')}>
            <label className="control-label">{imageLabel}</label>
            <Dropzone
              className="dropzone"
              onDrop={this.handleFileDrop}
              multiple={false}
              maxSize={4096000}
              accept="image/*">
              {dropzoneContent}
            </Dropzone>
          </div>

          <div className="checkbox form-group col-sm-12 col-md-10 col-lg-8">
            <label className="control-label">
              <input
                type="checkbox"
                checked={this.state.checkedReadMore || this.state.form.read_more_link}
                onChange={this.handleChange}
              />
              {strings.get('App.documents.documentForm.addReadMoreLink')}
            </label>
          </div>

          <div className="checkbox form-group col-sm-12 col-md-10 col-lg-8">
            <label className="control-label">
              <input
                type="checkbox"
                checked={this.state.form.shareable}
                onChange={this.handleChangeSharability}
              />
              {strings.get('App.documents.documentForm.shareable')}
            </label>
          </div>

          <div className={this.getErrorClass('descriptionLabel', 'form-group col-sm-12 col-md-10 col-lg-8')}>
            <label className="control-label">{descriptionLabel}</label>
            {/* <textarea className="form-control" name="description" value={ this.state.form.description } onChange={ this.handleInputChange } /> */}
            <Editor
              content={this.state.form.description}
              handleChange={this.handleEditorChange}
              height={100}
            />
          </div>

          <div className="form-group col-sm-12 col-md-10 col-lg-8">
            {readMoreLink}
          </div>

          <div className={this.getErrorClass('template', 'form-group col-sm-12')}>
            <label className="control-label">{templateLabel}</label>
            {templateErrors}
            <Editor
              content={this.state.form.template}
              handleChange={this.handleTemplateChange}
            />
          </div>
          <div className="form-actions col-sm-12">
            <button className="btn btn-primary"
                    onClick={this.handleSaveClick}>{strings.get('App.documents.documentForm.save')}</button>
            <button className="btn btn-default"
                    onClick={this.handleCancelClick}>{strings.get('App.documents.documentForm.cancel')}</button>
          </div>
        </form>
      </div>
    );
  }

}

DocumentForm.propTypes = {
  exceptions: React.PropTypes.object.isRequired,
  categories: React.PropTypes.object.isRequired,
  saveItem: React.PropTypes.func.isRequired,
};

export default DocumentForm;

export function getModal() {
  return modal;
}

export function getTemplateData() {
  return templateData;
}
