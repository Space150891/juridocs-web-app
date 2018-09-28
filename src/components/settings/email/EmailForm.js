import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../../../services/strings';
import settings from '../../../services/settings';
import language from '../../../services/language';
import { Link, browserHistory } from 'react-router';
import _ from 'lodash';

import Editor from '../../Editor';

class EmailForm extends Component {

    state = {
        currentSettingsLoaded: false,
        form: {
            download_email_subject: { value: '' },
            download_email_message: { value: '' },
        }
    }

    componentDidMount() {
        this.tryLoadCurrentSettings();
    }

    componentDidUpdate() {
        this.tryLoadCurrentSettings();
    }

    constructor(props) {
        super(props);
        autoBind(this);
    }

    tryLoadCurrentSettings() {
        if (_.size(this.props.settings) && !this.state.currentSettingsLoaded) {
            this.setState({
                currentSettingsLoaded: true,
                form: {
                    download_email_subject: this.props.settings[settings.keys.EMAIL_SUBJECT],
                    download_email_message: this.props.settings[settings.keys.EMAIL_MESSAGE],
                }
            });
        }
    }

    handleInputChange(e) {
        let form = _.extend(this.state.form, {});
        form[e.target.name] = form[e.target.name].asMutable ? form[e.target.name].asMutable() : form[e.target.name];
        form[e.target.name].value = e.target.value;

        this.setState({ form });
    }

    handleMessageChange(e) {
        e.target.value = e.target.getContent();
        e.target.name = settings.keys.EMAIL_MESSAGE;
        this.handleInputChange(e);
    }

    handleSaveClick(e) {
        e.preventDefault();
        this.props.saveSettings(this.state);
    }

    handleCancelClick(e) {
        e.preventDefault();
        this.setState({
            form: {
              download_email_subject: this.props.settings[settings.keys.EMAIL_SUBJECT],
              download_email_message: this.props.settings[settings.keys.EMAIL_MESSAGE],
            }
        });
    }

    render() {
        return (
            <div className="EmailForm row">
                <form className="col-sm-12 col-md-8">
                    <div className="form-group">
                        <label className="control-label">{strings.get('App.email.subject')}</label>
                        <input className="form-control" type="text" name="download_email_subject" value={ this.state.form.download_email_subject.value } onChange={ this.handleInputChange } />
                    </div>
                    <div className="form-group">
                        <label className="control-label">{strings.get('App.email.message')}</label>
                        <Editor
                            content={ this.state.form.download_email_message.value }
                            handleChange={ this.handleMessageChange }
                            height={ 250 }
                        />
                    </div>
                    <div className="form-actions">
                        <button className="btn btn-primary" onClick={ this.handleSaveClick }>{strings.get('App.email.save')}</button>
                        <button className="btn btn-default" onClick={ this.handleCancelClick }>{strings.get('App.email.cancel')}</button>
                    </div>
                </form>
            </div>
        );
    }

}

EmailForm.propTypes = {
    settings: React.PropTypes.object,
    saveSettings: React.PropTypes.func.isRequired,
}

export default EmailForm;