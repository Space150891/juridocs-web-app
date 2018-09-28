/**
 * Created by Admin on 7/25/2017.
 */
import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import strings from '../../services/strings';
import '../Page.scss';

import * as usersActions from '../../store/users/actions';
import * as usersSelectors from '../../store/users/selectors';

import Topbar from '../../components/Topbar';
import SubTopbar from '../../components/SubTopbar';
import UserFrom from '../../components/user/UserForm';

class BlockedUsersEditPage extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillMount() {
        this.props.fetchUser(this.props.params.id);
        this.props.setCurrentUserId(this.props.params.id);
        this.props.fetchAllUsers();
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
                        <Link to="/users">{strings.get('App.blockedUsers.editPage.title')}</Link>
                        <span className="hidden-xs">
                <span className="divider">/</span>
                <Link to={`/users/${this.props.params.id}`}>{strings.get('App.blockedUsers.editPage.edit')}</Link>
            </span>
                    </div>
                </Topbar>
                <div className="content">
                    <UserFrom
                        exceptions={ this.props.exceptions }
                        currentItem={ this.props.users }
                        user={ this.props.users }
                        saveItem={ this.saveUser }
                    />
                </div>
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        users: usersSelectors.getCurrentItem(state),
    }
}
function mapDispatchToProps(dispatch) {
    return {
        fetchAllUsers: (deleteCache) => {
            dispatch(usersActions.fetchAllItems(deleteCache))
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
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BlockedUsersEditPage);