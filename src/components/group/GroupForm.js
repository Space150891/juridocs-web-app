import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../../services/strings';
import language from '../../services/language';
import { Link, browserHistory } from 'react-router';
import _ from 'lodash';
import './GroupForm.scss'

import GroupFormUsers from './GroupFormUsers';

class GroupForm extends Component {

    state = {
        currentItemLoaded: false,
        users: [],
        form: {
            users_ids: '',
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

            form['users_ids'] = _.map(this.props.currentItem.users, (item) => {
                return item.id
            }).join(',');

            this.setState({
                currentItemLoaded: true,
                users: this.props.currentItem.users.asMutable(),
                form
            });
        }
    }

    hasError(inputName) {
        return (inputName == 'image') ? this.state.fileRejected : !!this.props.exceptions[inputName];
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

    handleUsersChange(items) {
        let users_ids = _.map(items, (item) => {
            return item.id
        }).join(',');

        this.setState({
            users: items,
            form: _.extend(this.state.form, {
                users_ids,
            }),
        });
    }

    handleSaveClick(e) {
        e.preventDefault();
        this.props.saveItem(this.state);
    }

    handleCancelClick(e) {
        e.preventDefault();
        browserHistory.push('/users/groups');
    }

    render() {
        let nameLabel = this.hasError('name') ? `${strings.get('App.groups.groupForm.name')} ${this.getErrorMessage('name')}` : strings.get('App.groups.groupForm.name');

        return (
            <div className="GroupForm row">
                <form className="col-sm-12 col-md-6">
                    <div className={ this.getErrorClass('name', 'form-group') }>
                        <label className="control-label">{ nameLabel }</label>
                        <input className="form-control" type="text" name="name" value={ this.state.form.name } onChange={ this.handleInputChange } />
                    </div>
                    <GroupFormUsers
                        users={ this.props.users }
                        selected={ this.state.users }
                        onChange={ this.handleUsersChange }
                    />
                    <div className="form-actions">
                        <button className="btn btn-primary" onClick={ this.handleSaveClick }>{strings.get('App.groups.groupForm.save')}</button>
                        <button className="btn btn-default" onClick={ this.handleCancelClick }>{strings.get('App.groups.groupForm.cancel')}</button>
                    </div>
                </form>
            </div>
        );
    }

}

GroupForm.propTypes = {
    exceptions: React.PropTypes.object.isRequired,
    users: React.PropTypes.object.isRequired,
    saveItem: React.PropTypes.func.isRequired,
}

export default GroupForm;