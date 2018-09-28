import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../../../services/strings';
import language from '../../../services/language';
import { Link, browserHistory } from 'react-router';
import _ from 'lodash';

class GenderStringForm extends Component {

    state = {
        currentItemLoaded: false,
        form: {
            language_id: language.get(),
            string: '',
            male: '',
            female: '',
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
        browserHistory.push('/grammar/gender-strings');
    }

    render() {
        let stringLabel = this.hasError('string') ? `${strings.get('App.grammar.genderForm.string')} ${this.getErrorMessage('string')}` : strings.get('App.grammar.genderForm.string');
        let maleLabel = this.hasError('male') ? `${strings.get('App.grammar.genderForm.male')} ${this.getErrorMessage('male')}` : strings.get('App.grammar.genderForm.male');
        let femaleLabel = this.hasError('female') ? `${strings.get('App.grammar.genderForm.female')} ${this.getErrorMessage('female')}` : strings.get('App.grammar.genderForm.female');

        return (
            <div className="GenderStringForm row">
                <form className="col-sm-12 col-md-6">
                    <div className={ this.getErrorClass('string', 'form-group') }>
                        <label className="control-label">{ stringLabel }</label>
                        <input className="form-control" type="text" name="string" value={ this.state.form.string } onChange={ this.handleInputChange } />
                    </div>
                    <div className={ this.getErrorClass('male', 'form-group') }>
                        <label className="control-label">{ maleLabel }</label>
                        <input className="form-control" type="text" name="male" value={ this.state.form.male } onChange={ this.handleInputChange } />
                    </div>
                    <div className={ this.getErrorClass('female', 'form-group') }>
                        <label className="control-label">{ femaleLabel }</label>
                        <input className="form-control" type="text" name="female" value={ this.state.form.female } onChange={ this.handleInputChange } />
                    </div>
                    <div className="form-actions">
                        <button className="btn btn-primary" onClick={ this.handleSaveClick }>{strings.get('App.grammar.genderForm.save')}</button>
                        <button className="btn btn-default" onClick={ this.handleCancelClick }>{strings.get('App.grammar.genderForm.cancel')}</button>
                    </div>
                </form>
            </div>
        );
    }

}

GenderStringForm.propTypes = {
    exceptions: React.PropTypes.object.isRequired,
    saveItem: React.PropTypes.func.isRequired,
}

export default GenderStringForm;