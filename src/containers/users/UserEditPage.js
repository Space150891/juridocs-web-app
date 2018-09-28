import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import strings from '../../services/strings';
import '../Page.scss';


/* TODO: will be changed */
import api from '../../services/api';

import * as usersActions from '../../store/users/actions';
import * as usersSelectors from '../../store/users/selectors';
import * as groupsActions from '../../store/groups/actions';
import * as groupsSelectors from '../../store/groups/selectors';
import * as categoriesActions from '../../store/categories/actions';
import * as categoriesSelectors from '../../store/categories/selectors';
import * as scopesActions from '../../store/scopes/actions';
import * as scopesSelectors from '../../store/scopes/selectors';

import Topbar from '../../components/Topbar';
import UserFrom from '../../components/user/UserForm';

class UserEditPage extends Component {

  constructor(props) {
    super(props);
    autoBind(this);
  }

  componentWillMount() {
    this.props.fetchUser(this.props.params.id);
    this.props.setCurrentUserId(this.props.params.id);

    this.props.fetchRoles();

    this.props.fetchGroups();
    this.props.fetchCategories();
  }

  componentWillUnmount() {
    this.props.unsetCurrentUserId();
    this.props.clearExceptions();
  }

  saveUser(data) {
    this.props.updateUser(this.props.params.id, data.form);
  }

  render() {
    return (
        <div className="CategoryEditPage">
          <Topbar currentLanguage={this.props.currentLanguage} handleLangChange={this.props.handleLangChange}>
            <div className="title">
              <Link to="/users">{strings.get('App.userPages.title')}</Link>
              <span className="hidden-xs">
                <span className="divider">/</span>
                <Link to={`/users/${this.props.params.id}`}>{strings.get('App.userPages.edit')}</Link>
            </span>
            </div>
          </Topbar>
          <div className="content">
            <UserFrom
                exceptions={ this.props.exceptions }
                currentItem={ this.props.currentUser }
                saveItem={ this.saveUser }
                changeUserRole={ this.changeUserRole }
                groups={ this.props.groups }
                categories={ this.props.categories }
                roles={ this.props.roles }
            />
          </div>
        </div>
    );
  }

}

function mapStateToProps(state) {
  return {
    currentUser: usersSelectors.getCurrentItem(state),
    groups: groupsSelectors.getItems(state),
    categories: categoriesSelectors.getItems(state),
    roles: scopesSelectors.getScopes(state),
  }
}
function mapDispatchToProps(dispatch) {
  return {
    fetchAllUsers: (deleteCache) => {
      dispatch(usersActions.fetchAllItems(deleteCache))
    },
    fetchUsers: (deleteCache) => {
      dispatch(usersActions.fetchItems(deleteCache))
    },
    setCurrentUserId: (id) => {
      dispatch(usersActions.setCurrentItemId(id))
    },
    fetchUser: (id) => {
      dispatch(usersActions.fetchItem(id))
    },
    unsetCurrentUserId: () => {
      dispatch(usersActions.unsetCurrentItemId())
    },
    updateUser: (id, data) => {
      dispatch(usersActions.updateItem(id, data))
    },
    // updateUserScope: (id, data) => {
    //   dispatch(usersActions.updateItem(id, data))
    // },
    fetchGroups: (deleteCache) => {
        dispatch(groupsActions.fetchItems(deleteCache))
    },
    fetchCategories: (deleteCache) => {
        dispatch(categoriesActions.fetchItems(deleteCache))
    },
    fetchRoles: () => {
        dispatch(scopesActions.fetchAllRoles())
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserEditPage);