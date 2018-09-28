import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../../../services/strings';
import settings from '../../../services/settings';
import language from '../../../services/language';
import { Link, browserHistory } from 'react-router';
import _ from 'lodash';

import Editor from '../../Editor';

class DenyMessageModal extends Component {

    state = {
        currentSettingsLoaded: false,
        form: {
            deny_message: {
                value: ''
            },
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
                    deny_message: this.props.settings[settings.keys.DENY_MESSAGE],
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
    handleSaveClick(e) {
        e.preventDefault();
        this.props.saveSettings(this.state);
    }

    handleCancelClick(e) {
        e.preventDefault();
        this.setState({
            form: {
                deny_message: this.props.settings[settings.keys.DENY_MESSAGE],
            }
        });
    }
    render() {
        return (
            <div className="placeholderForm row">
                <form className="col-sm-12 col-md-8">
                    <div className="form-group">
                        <label className="control-label">Deny Message</label>
                        <input  className="form-control" type="text" name="deny_message" value={ this.state.form.deny_message.value } onChange={ this.handleInputChange } />
                    </div>
                    <div className="form-actions">
                        <button className="btn btn-primary" onClick={ this.handleSaveClick }>Save</button>
                        <button className="btn btn-default" onClick={ this.handleCancelClick }>Cancel</button>
                    </div>
                </form>
            </div>
        );
    }
}
DenyMessageModal.propTypes = {
    settings: React.PropTypes.object,
    saveSettings: React.PropTypes.func.isRequired,
}

export default DenyMessageModal;