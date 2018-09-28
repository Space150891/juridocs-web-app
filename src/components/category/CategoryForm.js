import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../../services/strings';
import language from '../../services/language';
import { Link, browserHistory } from 'react-router';
import _ from 'lodash';
import './CategoryForm.scss';

import Dropzone from 'react-dropzone';
import CategoryFormUsers from './CategoryFormUsers';
import CategoryFormGroups from './CategoryFormGroups';
import CategoryFormTeamMembers from "./CategoryFormTeamMembers";

class CategoryForm extends Component {

    state = {
        currentItemLoaded: false,
        file: null,
        fileRejected: false,
        users: [],
        groups: [],
        checkedReadMore: false,
        form: {
            language_id: language.get(),
            parent_id: '',
            users_ids: '',
            groups_ids: '',
            teamMembers_ids: '',
            name: '',
            description: '',
            read_more_link: '',
            image: '',
            visibility: 0,
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
        this.handleChange = this.handleChange.bind(this);
    }

    tryLoadCurrentItem() {
        if (this.props.currentItem && !this.state.currentItemLoaded) {
            let form = _.extend({}, this.state.form);
            _.map(this.state.form, (value, key) => {
                form[key] = (this.props.currentItem[key]) ? this.props.currentItem[key] : this.state.form[key];
            });

            form['users_ids'] = _.map(this.props.currentItem.users, (item) => {
                return item.id
            }).join(',');

            form['groups_ids'] = _.map(this.props.currentItem.groups, (item) => {
                return item.id
            }).join(',');

            form['teamMembers_ids'] = _.map(this.props.currentItem.selectedUsers, (item) => {
                return item.id
            }).join(',');

            this.setState({
                currentItemLoaded: true,
                users: this.props.currentItem.users.asMutable(),
                groups: this.props.currentItem.groups.asMutable(),
                teamMembers: this.props.currentItem.assigned_users,
                form
            });
        }
    }
    handleChange() {
        if (!this.state.form.read_more_link)
        {
            this.setState({
                checkedReadMore: !this.state.checkedReadMore
            })
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

    getVisibilityIcon() {
        if (this.state.form.visibility == 0) {
            return <i className="visibility-icon ion-locked"></i>;
        }
        else if (this.state.form.visibility == 1) {
            return <i className="visibility-icon ion-earth"></i>;
        }
        else if (this.state.form.visibility == 2) {
            return <i className="visibility-icon ion-android-people"></i>;
        }
        else if (this.state.form.visibility == 3) {
            return <i className="visibility-icon ion-android-settings"></i>;
        }
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

    handleGroupsChange(items) {
        let groups_ids = _.map(items, (item) => {
            return item.id
        }).join(',');

        this.setState({
            groups: items,
            form: _.extend(this.state.form, {
                groups_ids,
            }),
        });
    }

    handleTeamMembersChange(items) {
        let teamMembers_ids = _.map(items, (item) => {
            return item.id
        }).join(',');

        this.setState({
            teamMembers: items,
            form: _.extend(this.state.form, {
                teamMembers_ids,
            }),
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
        this.props.saveItem(_.extend(this.state, {
            form: _.extend(this.state.form, {
                language_id: language.get()
            })
        }));
    }

    handleCancelClick(e) {
        e.preventDefault();
        browserHistory.push('/categories');
    }

    render() {
        const readMoreLink = this.state.checkedReadMore || this.state.form.read_more_link
            ? <div className={ this.getErrorClass('readMoreLabel', 'form-group') }>
                <label className="control-label">{strings.get('App.categoryForm.readMoreLink')}</label>
                <input type="text" className="form-control" name="read_more_link" value={ this.state.form.read_more_link } onChange={ this.handleInputChange } />
            </div>
            : null;
        let nameLabel = this.hasError('name') ? `${strings.get('App.categoryForm.name')} ${this.getErrorMessage('name')}` : strings.get('App.categoryForm.name');
        let descriptionLabel = this.hasError('description') ? `${strings.get('App.categoryForm.description')} ${this.getErrorMessage('description')}` : strings.get('App.categoryForm.description');
        let parentLabel = this.hasError('parent_id') ? `${strings.get('App.categoryForm.categoryParent')} ${this.getErrorMessage('parent_id')}` : strings.get('App.categoryForm.categoryParent');
        let visibilityLabel = this.hasError('visibility') ? `${strings.get('App.categoryForm.visibility.title')} ${this.getErrorMessage('visibility')}` : strings.get('App.categoryForm.visibility.title');
        let imageLabel = this.hasError('image') ? strings.get('Exceptions.imageTooBig') : strings.get('App.categoryForm.image');

        let categories = _.map(this.props.categories, (item) => {

            return (<option value={ item.id } key={ item.id }>{ item.name }</option>);
        });

        let usersFormGroup = (this.state.form.visibility == 3) ? (
            <CategoryFormUsers
                users={ this.props.users }
                selected={ this.state.users }
                onChange={ this.handleUsersChange }
            />
        ) : null;

        let groupsFormGroup = (this.state.form.visibility == 3) ? (
            <CategoryFormGroups
                groups={ this.props.groups }
                selected={ this.state.groups }
                onChange={ this.handleGroupsChange }
            />
        ) : null;
        let teamMembersFormGroup = (this.props.currentItem && this.state.currentItemLoaded) ? (
            <CategoryFormTeamMembers
                teamMembers={ this.props.currentItem.assigned_users }
                selected={ this.props.currentItem.selectedUsers }
                onChange={ this.handleTeamMembersChange }
            />
        ) : null;

        let dropzoneContent = this.getPreviewImage() ? this.getPreviewImage() : strings.get('App.categoryForm.chooseImage');
        return (
            <div className="CategoryForm row">
                <form className="col-sm-12 col-md-6">
                    <div className={ this.getErrorClass('name', 'form-group') }>
                        <label className="control-label">{ nameLabel }</label>
                        <input className="form-control" type="text" name="name" value={ this.state.form.name } onChange={ this.handleInputChange } />
                    </div>
                    <div className={ this.getErrorClass('parent_id', 'form-group') }>
                        <label className="control-label">{ parentLabel }</label>
                        <select className="form-control" name="parent_id" value={ this.state.form.parent_id } onChange={ this.handleInputChange }>
                            <option value="">{strings.get('App.categoryForm.noParent')}</option>
                            { categories }
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="control-label">
                            { visibilityLabel }
                            { this.getVisibilityIcon() }
                        </label>
                        <select className="form-control" name="visibility" value={ this.state.form.visibility } onChange={ this.handleInputChange }>
                            <option value="1">{strings.get('App.categoryForm.visibility.public')}</option>
                            <option value="2">{strings.get('App.categoryForm.visibility.loggedIn')}</option>
                            <option value="0">{strings.get('App.categoryForm.visibility.hidden')}</option>
                            <option value="3">{strings.get('App.categoryForm.visibility.custom')}</option>
                        </select>
                    </div>
                    { usersFormGroup }
                    { groupsFormGroup }
                    { teamMembersFormGroup }
                    <div className={ this.getErrorClass('description', 'form-group') }>
                        <label className="control-label">{ descriptionLabel }</label>
                        <textarea className="form-control" name="description" value={ this.state.form.description } onChange={ this.handleInputChange }></textarea>
                    </div>
                    <div>
                        <label className="control-label">{strings.get('App.categoryForm.addReadMoreLink')}</label>
                        <input
                            type="checkbox"
                            checked={ this.state.checkedReadMore || this.state.form.read_more_link }
                            onChange={ this.handleChange } />

                        { readMoreLink }
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
                        <button className="btn btn-primary" onClick={ this.handleSaveClick }>{strings.get('App.categoryForm.save')}</button>
                        <button className="btn btn-default" onClick={ this.handleCancelClick }>{strings.get('App.categoryForm.cancel')}</button>
                    </div>
                </form>
            </div>
        );
    }

}

CategoryForm.propTypes = {
    exceptions: React.PropTypes.object.isRequired,
    categories: React.PropTypes.object.isRequired,
    users: React.PropTypes.object.isRequired,
    groups: React.PropTypes.object.isRequired,
    saveItem: React.PropTypes.func.isRequired,
};

export default CategoryForm;