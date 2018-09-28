import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../../services/strings';
import AddUserGroup from './AddUserGroup';
import AddUserCategory from "./AddUserCategory";
import { Link, browserHistory } from 'react-router';
import _ from 'lodash';
import Dropzone from 'react-dropzone';


import UserHelper from '../../helpers/userHelper';


class UserForm extends Component {

  state = {
    currentItemLoaded: false,
    passwordConform: false,
    currentGroupLoaded: false,
    form: {
        first_name: '',
        last_name: '',
        email: '',
        team_member: '',
        visible: '',
        position: '',
        description: '',
        password: '',
        password_conform:'',
        groups_ids: '',
        groups: [],
        categories_ids: '',
        scope_id: '',
        assigned_categories: [],
    }
  };

  constructor(props) {
      super(props);
      autoBind(this);
  }

  componentDidMount() {
    this.tryLoadCurrentItem();
  }

  componentDidUpdate() {
    this.tryLoadCurrentItem();
  }
  tryLoadCurrentItem() {
      if (this.props.currentItem && !this.state.currentItemLoaded) {
          let form = _.extend({}, this.state.form);
          _.map(this.state.form, (value, key) => {
              form[key] = (this.props.currentItem[key]) ? this.props.currentItem[key] : this.state.form[key];
          });
          form['groups_ids'] = _.map(this.props.currentItem.groups, (item) => {
              return item.id
          }).join(',');
          form['categories_ids'] = _.map(this.props.currentItem.assigned_categories, (item) => {
              return item.id
          }).join(',');
          form['team_member'] = Boolean(this.props.currentItem.team_member);
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
      let form = _.extend({}, this.state.form);
      const scopeId = this.state.form.scope_id;
      const userId = this.props.currentItem.id;

      form.team_member = Number(this.state.form.team_member);
      form.visible = Number(this.state.form.visible);
      this.setState({form});
      if (form.password === form.password_conform) {
          this.setState({conformError:false}, () => {
              this.props.saveItem(this.state);
          });
      }else {
          this.setState({conformError:true});
          return;
      }
  }

  handleCancelClick(e) {
    e.preventDefault();
    browserHistory.push('/users');
  }
  handleGroupsChange(groups) {
      let groups_ids = _.map(groups, (item) => {
          return item.id
      }).join(',');

      this.setState({
          form: _.extend(this.state.form, {
              groups_ids,
              groups,
          }),
      });
  }

  handleCategoriesChange(assigned_categories) {
      let categories_ids = _.map(assigned_categories, (category) => {
          return category.id
      }).join(',');

      this.setState({
          form: _.extend(this.state.form, {
              categories_ids,
              assigned_categories,
          }),
      });
  }

  handleCheckboxChange(e) {
      let form = _.extend({},this.state.form);
      form[e.target.name] = e.target.checked;
      this.setState({form});
  }

  changeScope(e) {
    this.state.form.scope_id = e.target.value;
    this.setState(this.state);
  }

  render() {
    const currentUserRoleID = this.props.currentItem ? this.props.currentItem.scopes[0].id : 0;

    let firstNameLabel = this.hasError('first_name') ? `${strings.get('App.users.userForm.firstName')} ${this.getErrorMessage('first_name')}` : strings.get('App.users.userForm.firstName');
    let lastNameLabel = this.hasError('last_name') ? `${strings.get('App.users.userForm.lastName')} ${this.getErrorMessage('last_name')}` : strings.get('App.users.userForm.lastName');
    let emailLabel = this.hasError('email') ? `${strings.get('App.users.userForm.email')} ${this.getErrorMessage('email')}` : strings.get('App.users.userForm.email');
    let passwordLabel = this.hasError('password') ? `${strings.get('App.users.userForm.password')} ${this.getErrorMessage('password')}` : strings.get('App.users.userForm.password');
    let passwordConform = this.state.conformError ? (
        <div className='form-group has-error'>
            <label className="control-label">{strings.get('App.users.userForm.passwordsNotSame')}</label>
            <input className="form-control" type="password" name="password_conform" value={ this.state.form.password_conform } onChange={ this.handleInputChange } />
        </div>
    ) : (<div className='form-group'>
        <label className="control-label">{strings.get('App.users.userForm.confirmPassword')}</label>
        <input className="form-control" type="password" name="password_conform" value={ this.state.form.password_conform } onChange={ this.handleInputChange } />
    </div>);
    let displayStyle = this.state.form.team_member ? "block" : "none" ;
    let teamItemsStyle = {
        display: displayStyle
    };
    return (
      <div className="CompanyForm row">
        <form className="col-sm-12 col-md-6">
          <div className={ this.getErrorClass('first_name', 'form-group') }>
            <label className="control-label">{ firstNameLabel }</label>
            <input className="form-control" type="text" name="first_name" value={ this.state.form.first_name } onChange={ this.handleInputChange } />
          </div>
          <div className={ this.getErrorClass('last_name', 'form-group') }>
            <label className="control-label">{ lastNameLabel }</label>
            <input className="form-control" type="text" name="last_name" value={ this.state.form.last_name } onChange={ this.handleInputChange } />
          </div>
          {
            _.isArray(this.props.roles) ?
            <div className="form-group">
              <label className="control-label">{strings.get('App.users.role')}</label>
              <select className="form-control" value={this.state.form.scope_id || currentUserRoleID} onChange={this.changeScope.bind(this)}>
                { this.props.roles.map( (role, key) => <option value={role.id} key={key}>{strings.get(`App.users.scopes.${role.name}`)}</option>) }
              </select>
            </div> : ''
          }
          <AddUserGroup
              groups={ this.props.groups }
              selected={ this.state.form.groups }
              onChange={ this.handleGroupsChange }
          />
          <div className="team_member form-group">
              <label className="control-label">{ strings.get('App.users.userForm.role.team.title') }</label>
              <input type="checkbox" name="team_member" checked={ this.state.form.team_member } onChange={ this.handleCheckboxChange } />
          </div>
          <div className="team_visibility form-group" style={teamItemsStyle}>
              <label className="control-label">{ strings.get('App.users.userForm.role.team.visible') }</label>
              <input type="checkbox" name="visible" checked={ this.state.form.visible } onChange={ this.handleCheckboxChange } />
          </div>
          <div className="team_position form-group" style={teamItemsStyle}>
              <label className="control-label">{ strings.get('App.users.userForm.role.team.position') }</label>
              <input className="form-control" type="text" name="position" value={ this.state.form.position } onChange={ this.handleInputChange } />
          </div>
          <div className="team_description form-group" style={teamItemsStyle}>
              <label className="control-label">{ strings.get('App.users.userForm.role.team.description') }</label>
              <input className="form-control" type="text" name="description" value={ this.state.form.description } onChange={ this.handleInputChange } />
          </div>
          <AddUserCategory
              categories={ this.props.categories }
              selected={ this.state.form.assigned_categories }
              onChange={ this.handleCategoriesChange }
              style={ teamItemsStyle }
          />
          <div className={ this.getErrorClass('email', 'form-group') }>
            <label className="control-label">{ emailLabel }</label>
            <input className="form-control" type="text" name="email" value={ this.state.form.email } onChange={ this.handleInputChange } />
          </div>
          <div className={ this.getErrorClass('password', 'form-group') }>
            <label className="control-label">{ passwordLabel }</label>
            <input className="form-control" type="password" name="password" value={ this.state.form.password } onChange={ this.handleInputChange } />
          </div>
            {passwordConform}
          <div className="form-actions">
            <button className="btn btn-primary" onClick={ this.handleSaveClick }>{strings.get('App.users.userForm.save')}</button>
            <button className="btn btn-default" onClick={ this.handleCancelClick }>{strings.get('App.users.userForm.cancel')}</button>
          </div>
        </form>
      </div>
    );
  }

}

UserForm.propTypes = {
    exceptions: React.PropTypes.object.isRequired,
    saveItem: React.PropTypes.func.isRequired,
    groups: React.PropTypes.object.isRequired,
    categories: React.PropTypes.object.isRequired,
}

export default UserForm;
