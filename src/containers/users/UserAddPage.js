import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../../services/strings';
import { Link } from 'react-router';
import '../Page.scss';

import * as categoriesActions from '../../store/categories/actions';
import * as categoriesSelectors from '../../store/categories/selectors';
import * as usersActions from '../../store/users/actions';
import * as usersSelectors from '../../store/users/selectors';
import * as groupsActions from '../../store/groups/actions';
import * as groupsSelectors from '../../store/groups/selectors';

import Topbar from '../../components/Topbar';
import SubTopbar from '../../components/SubTopbar';
import UserFrom from '../../components/user/UserForm';

class CategoryAddPage extends Component {

  constructor(props) {
    super(props);
    autoBind(this);
  }

  componentWillMount() {
    this.props.fetchAllUsers();
    this.props.fetchGroups();
    this.props.fetchCategories();
  }

  componentWillUnmount() {
    this.props.clearExceptions();
  }

  saveUser(data) {
    this.props.createUser(data.form);
  }

  render() {
    return (
      <div className="CategoryAddPage">
        <Topbar currentLanguage={this.props.currentLanguage} handleLangChange={this.props.handleLangChange}>
          <div className="title">
            <Link to="/users">{strings.get('App.userPages.title')}</Link>
            <span className="hidden-xs">
                <span className="divider">/</span>
                <Link to="/users/add">{strings.get('App.userPages.add')}</Link>
            </span>
          </div>
        </Topbar>

        <div className="content">
          <UserFrom
            exceptions={ this.props.exceptions }
            categories={ this.props.categories }
            currentItem={ this.props.users }
            currentGroup={ this.props.currentGroup }
            user={ this.props.users }
            saveItem={ this.saveUser }
            groups={ this.props.groups }
          />
        </div>
      </div>
    ) ;
  }

}

function mapStateToProps(state) {
  return {
    groups: groupsSelectors.getItems(state),
    users: usersSelectors.getItems(state),
    categories: categoriesSelectors.getItems(state),
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchAllUsers: (deleteCache) => {
      dispatch(usersActions.fetchAllItems(deleteCache))
    },
    createUser: (data) => {
      dispatch(usersActions.createItem(data))
    },
    fetchGroups: (deleteCache) => {
        dispatch(groupsActions.fetchItems(deleteCache))
    },
    fetchCategories: (deleteCache) => {
        dispatch(categoriesActions.fetchItems(deleteCache))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryAddPage);