import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../../services/strings';
import { Link, browserHistory } from 'react-router';
import _ from 'lodash';

import * as authActions from '../../store/auth/actions';

class CompanyCategoryForm extends Component {

    state = {
        currentItemLoaded: false,
        form: {
            name: '',
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

    handleInputChange(e) {
        let form = {};
        form[e.target.name] = e.target.value;
        this.setState({
            form: _.extend(this.state.form, form)
        });
    }

    handleSaveClick(e) {
        e.preventDefault();
        this.props.saveItem(this.state);
    }

    handleCancelClick(e) {
        e.preventDefault();
        browserHistory.push('/companies/categories');
    }

    render() {
        let nameLabel = this.hasError('name') ? `${strings.get('App.companies.companyCategoryForm.name')} ${this.getErrorMessage('name')}` : strings.get('App.companies.companyCategoryForm.name');

        return (
            <div className="CompanyCategoryForm row">
                <form className="col-sm-12 col-md-6">
                    <div className={ this.getErrorClass('name', 'form-group') }>
                        <label className="control-label">{ nameLabel }</label>
                        <input className="form-control" type="text" name="name" value={ this.state.form.name } onChange={ this.handleInputChange } />
                    </div>
                    <div className="form-actions">
                        <button className="btn btn-primary" onClick={ this.handleSaveClick }>{strings.get('App.companies.companyCategoryForm.save')}</button>
                        <button className="btn btn-default" onClick={ this.handleCancelClick }>{strings.get('App.companies.companyCategoryForm.cancel')}</button>
                    </div>
                </form>
            </div>
        );
    }

}

CompanyCategoryForm.propTypes = {
    exceptions: React.PropTypes.object.isRequired,
    saveItem: React.PropTypes.func.isRequired,
}

export default CompanyCategoryForm;