import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../../services/strings';
import { Link, browserHistory } from 'react-router';
import _ from 'lodash';

import Dropzone from 'react-dropzone';

class CompanyForm extends Component {

    state = {
        currentItemLoaded: false,
        file: null,
        fileRejected: false,
        form: {
            company_category_id: '',
            name: '',
            address: '',
            postal_code: '',
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
                form
            });
        }
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

    getPreviewImage() {
        if (this.state.file) {
            return (<img src={ this.state.file.preview } />);
        } else {
            return (this.props.currentItem && this.props.currentItem.imageURL) ? (
                <img src={ this.props.currentItem.imageURL } />
            ) : null;
        }
    }

    handleInputChange(e) {
        let form = {};
        form[e.target.name] = e.target.value;
        this.setState({
            form: _.extend(this.state.form, form)
        });
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
        this.props.saveItem(this.state);
    }

    handleCancelClick(e) {
        e.preventDefault();
        browserHistory.push('/companies');
    }

    render() {
        let nameLabel = this.hasError('name') ? `${strings.get('App.companies.companyForm.name')} ${this.getErrorMessage('name')}` : strings.get('App.companies.companyForm.name');
        let addressLabel = this.hasError('address') ? `${strings.get('App.companies.companyForm.address')} ${this.getErrorMessage('address')}` : strings.get('App.companies.companyForm.address');
        let postalCodeLabel = this.hasError('postal_code') ? `${strings.get('App.companies.companyForm.postalCode')} ${this.getErrorMessage('postal_code')}` : strings.get('App.companies.companyForm.postalCode');
        let companyCategoryLabel = this.hasError('company_category_id') ? `${strings.get('App.companies.companyForm.companyCategory')} ${this.getErrorMessage('company_category_id')}` : strings.get('App.companies.companyForm.companyCategory');
        let imageLabel = this.hasError('image') ? strings.get('Exceptions.imageTooBig') : strings.get('App.companies.companyForm.image');

        let companyCategories = _.map(this.props.companyCategories, (item) => {
            return (<option value={ item.id } key={ item.id }>{ item.name }</option>);
        });

        let dropzoneContent = this.getPreviewImage() ? this.getPreviewImage() : strings.get('App.companies.companyForm.chooseImage');

        return (
            <div className="CompanyForm row">
                <form className="col-sm-12 col-md-6">
                    <div className={ this.getErrorClass('name', 'form-group') }>
                        <label className="control-label">{ nameLabel }</label>
                        <input className="form-control" type="text" name="name" value={ this.state.form.name } onChange={ this.handleInputChange } />
                    </div>
                    <div className={ this.getErrorClass('company_category_id', 'form-group') }>
                        <label className="control-label">{ companyCategoryLabel }</label>
                        <select className="form-control" name="company_category_id" value={ this.state.form.company_category_id } onChange={ this.handleInputChange }>
                            <option value="" disabled>{strings.get('App.companies.companyForm.choose')}</option>
                            { companyCategories }
                        </select>
                    </div>
                    <div className={ this.getErrorClass('image', 'form-group') }>
                        <label className="control-label">{ imageLabel }</label>
                        <Dropzone 
                            className="dropzone"
                            onDrop={ this.handleFileDrop }
                            multiple={ false }
                            maxSize={ 4096000 }
                            accept="image/*">
                            { dropzoneContent }
                        </Dropzone>
                    </div>
                    <div className={ this.getErrorClass('address', 'form-group') }>
                        <label className="control-label">{ addressLabel }</label>
                        <textarea className="form-control" name="address" value={ this.state.form.address } onChange={ this.handleInputChange }></textarea>
                    </div>
                    <div className={ this.getErrorClass('postal_code', 'form-group') }>
                        <label className="control-label">{ postalCodeLabel }</label>
                        <input className="form-control" type="text" name="postal_code" value={ this.state.form.postal_code } onChange={ this.handleInputChange } />
                    </div>
                    <div className="form-actions">
                        <button className="btn btn-primary" onClick={ this.handleSaveClick }>{strings.get('App.companies.companyForm.save')}</button>
                        <button className="btn btn-default" onClick={ this.handleCancelClick }>{strings.get('App.companies.companyForm.cancel')}</button>
                    </div>
                </form>
            </div>
        );
    }

}

CompanyForm.propTypes = {
    exceptions: React.PropTypes.object.isRequired,
    companyCategories: React.PropTypes.object.isRequired,
    saveItem: React.PropTypes.func.isRequired,
}

export default CompanyForm;