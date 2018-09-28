import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../../services/strings';
import { Link, browserHistory } from 'react-router';
import _ from 'lodash';

import Dropzone from 'react-dropzone';

class PartnerForm extends Component {

    state = {
        currentItemLoaded: false,
        file: null,
        fileRejected: false,
        form: {
            name: '',
            image: '',
            url: '',
            visible: false,
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
            });

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
        let form = {};
        form.visible = Number(this.state.form.visible);

        this.setState(_.extend(this.state.form, form), ()=>{
            this.props.saveItem(this.state);
        });
    }

    handleCancelClick(e) {
        e.preventDefault();
        browserHistory.push('/partners');
    }

    handleCheckboxChange(e) {
        let form = {};
        form[e.target.name] = e.target.checked;
        this.setState({
            form: _.extend(this.state.form, form)
        });

    }

    render() {
        let nameLabel = this.hasError('name') ? `${strings.get('App.partnerForm.name')} ${this.getErrorMessage('name')}` : strings.get('App.partnerForm.name');
        let imageLabel = this.hasError('image') ? strings.get('Exceptions.imageTooBig') : strings.get('App.partnerForm.image');
        let urlLabel = this.hasError('url') ? `${strings.get('App.partnerForm.url')} ${this.getErrorMessage('url')}` : strings.get('App.partnerForm.url');

        let dropzoneContent = this.getPreviewImage() ? this.getPreviewImage() : strings.get('App.partnerForm.chooseImage');
        return (
            <div className="PartnerForm row">
                <form className="col-sm-12 col-md-6">
                    <div className={ this.getErrorClass('name', 'form-group') }>
                        <label className="control-label">{ nameLabel }</label>
                        <input className="form-control" type="text" name="name" value={ this.state.form.name } onChange={ this.handleInputChange } />
                    </div>
                    <div className={ this.getErrorClass('url', 'form-group') }>
                        <label className="control-label">{ urlLabel }</label>
                        <input className="form-control" type="text" name="url" value={ this.state.form.url } onChange={ this.handleInputChange } />
                    </div>
                    <div className="visibility">
                        <label className="control-label">{ strings.get('App.partnerForm.visible') }</label>
                        <input type="checkbox" name="visible" checked={ this.state.form.visible } onChange={ this.handleCheckboxChange }/>
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
                    <div className="form-actions">
                        <button className="btn btn-primary" onClick={ this.handleSaveClick }>{strings.get('App.partnerForm.save')}</button>
                        <button className="btn btn-default" onClick={ this.handleCancelClick }>{strings.get('App.partnerForm.cancel')}</button>
                    </div>
                </form>
            </div>
        );
    }
}

PartnerForm.propTypes = {
    exceptions: React.PropTypes.object.isRequired,
    saveItem: React.PropTypes.func.isRequired,
}

export default PartnerForm;