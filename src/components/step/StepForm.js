import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../../services/strings';
import language from '../../services/language';
import { Link, browserHistory } from 'react-router';
import _ from 'lodash';

class StepForm extends Component {

    state = {
        currentItemLoaded: false,
        form: {
            language_id: language.get(),
            name: '',
            order: '',
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
        this.props.saveItem(_.extend(this.state, {
            form: _.extend(this.state.form, {
                language_id: language.get()
            })
        }));
    }

    handleCancelClick(e) {
        e.preventDefault();
        browserHistory.push('/glossaries/steps');
    }

    render() {
        let nameLabel = this.hasError('name') ? `${strings.get('App.glossaries.steps.name')} ${this.getErrorMessage('name')}` : strings.get('App.glossaries.steps.name');

        return (
            <div className="StepForm row">
                <form>
                    <div className="col-sm-12 col-md-6">
                        <div className={ this.getErrorClass('name', 'form-group') }>
                            <label className="control-label">{ nameLabel }</label>
                            <input className="form-control" type="text" name="name" value={ this.state.form.name } onChange={ this.handleInputChange } />
                        </div>
                        <div className="form-actions">
                            <button className="btn btn-primary" onClick={ this.handleSaveClick }>{strings.get('App.glossaries.steps.save')}</button>
                            <button className="btn btn-default" onClick={ this.handleCancelClick }>{strings.get('App.glossaries.steps.cancel')}</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }

}

StepForm.propTypes = {
    exceptions: React.PropTypes.object.isRequired,
    saveItem: React.PropTypes.func.isRequired,
}

export default StepForm;