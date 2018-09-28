import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../../services/strings';
import { Link } from 'react-router';
import '../Page.scss';

import * as groupsActions from '../../store/groups/actions';
import * as groupsSelectors from '../../store/groups/selectors';
import * as usersActions from '../../store/users/actions';
import * as usersSelectors from '../../store/users/selectors';

import Topbar from '../../components/Topbar';
import GroupForm from '../../components/group/GroupForm';

class GroupAddPage extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillMount() {
        this.props.fetchAllUsers();
    }

    componentWillUnmount() {
        this.props.clearExceptions();
    }

    saveGroup(data) {
        this.props.createGroup(data.form);
    }

    render() {
        return (
            <div className="GroupAddPage">
                <Topbar currentLanguage={this.props.currentLanguage} handleLangChange={this.props.handleLangChange}>
                    <div className="title">
                        <Link to="/users/groups">{strings.get('App.groupPages.title')}</Link>

                        <span className="hidden-xs">
                            <span className="divider">/</span>
                            <Link to="/users/groups/add">{strings.get('App.groupPages.add')}</Link>
                        </span>
                    </div>
                </Topbar>

                <div className="content">
                    <GroupForm
                        exceptions={ this.props.exceptions }
                        users={ this.props.users }
                        saveItem={ this.saveGroup }
                    />
                </div>
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        users: usersSelectors.getItems(state),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchAllUsers: (deleteCache) => {
            dispatch(usersActions.fetchAllItems(deleteCache))
        },
        createGroup: (data) => {
            dispatch(groupsActions.createItem(data))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupAddPage);