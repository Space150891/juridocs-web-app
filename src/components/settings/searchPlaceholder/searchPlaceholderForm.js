import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../../../services/strings';
import settings from '../../../services/settings';
import language from '../../../services/language';
import { Link, browserHistory } from 'react-router';
import _ from 'lodash';

import Editor from '../../Editor';

class SearchPlaceholderForm extends Component {

    state = {
        currentSettingsLoaded: false,
        form: {
            search_placeholder: {
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
                    search_placeholder: this.props.settings[settings.keys.SEARCH_PLACEHOLDER],
                }
            });
        }
    }

    handleInputChange(e) {
        let form = _.extend(this.state.form, {});
        // form[e.target.name] = 'download_search_placeholder';
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
                search_placeholder: this.props.settings[settings.keys.SEARCH_PLACEHOLDER],
            }
        });
    }
    render() {
        return (
            <div className="placeholderForm row">
                <form className="col-sm-12 col-md-8">
                    <div className="form-group">
                        <label className="control-label">{strings.get('App.searchPlaceholderForm.placeholder')}</label>
                        <input  className="form-control" type="text" name="search_placeholder" value={ this.state.form.search_placeholder.value } onChange={ this.handleInputChange } />
                    </div>
                    <div className="form-actions">
                        <button className="btn btn-primary" onClick={ this.handleSaveClick }>{strings.get('App.searchPlaceholderForm.save')}</button>
                        <button className="btn btn-default" onClick={ this.handleCancelClick }>{strings.get('App.searchPlaceholderForm.cancel')}</button>
                    </div>
                </form>
            </div>
        );
    }
}
SearchPlaceholderForm.propTypes = {
    settings: React.PropTypes.object,
    saveSettings: React.PropTypes.func.isRequired,
}

export default SearchPlaceholderForm;