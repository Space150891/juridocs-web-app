/**
 * Created by Admin on 7/31/2017.
 */
/**
 * Created by Admin on 7/25/2017.
 */
import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import strings from '../../services/strings';
import '../Page.scss';

import * as groupsActions from '../../store/groups/actions';
import * as groupsSelectors from '../../store/groups/selectors';

import Topbar from '../../components/Topbar';
import SubTopbar from '../../components/SubTopbar';
import GroupForm from '../../components/group/GroupForm';

class BlockedGroupsEditPage extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillMount() {
        this.props.fetchGroup(this.props.params.id);
        this.props.setCurrentGroupId(this.props.params.id);
        this.props.fetchAllGroups();
    }

    componentWillUnmount() {
        this.props.unsetCurrentGroupId();
        this.props.clearExceptions();
    }

    saveGroup(data) {
        this.props.updateGroup(this.props.params.id, data.form);
    }

    render() {
        return (
            <div className="GroupEditPage">
                <Topbar currentLanguage={this.props.currentLanguage} handleLangChange={this.props.handleLangChange}>
                    <div className="title">
                        <Link to="/users/groups">{strings.get('App.blockedGroups.editPage.title')}</Link>
                        <span className="hidden-xs">
                <span className="divider">/</span>
                <Link to={`/users/groups/${this.props.params.id}`}>{strings.get('App.blockedGroups.editPage.edit')}</Link>
            </span>
                    </div>
                </Topbar>
                <div className="content">
                    <UserFrom
                        exceptions={ this.props.exceptions }
                        currentItem={ this.props.users }
                        group={ this.props.groups }
                        saveItem={ this.saveGroup }
                    />
                </div>
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        groups: groupsSelectors.getCurrentItem(state),
    }
}
function mapDispatchToProps(dispatch) {
    return {
        fetchAllUsers: (deleteCache) => {
            dispatch(groupsActions.fetchAllItems(deleteCache))
        },
        setCurrentUserId: (id) => {
            dispatch(groupsActions.setCurrentItemId(id))
        },
        fetchUser: (id) => {
            dispatch(groupsActions.fetchItem(id))
        },
        unsetCurrentUserId: () => {
            dispatch(groupsActions.unsetCurrentItemId())
        },
        updateUser: (id, data) => {
            dispatch(groupsActions.updateItem(id, data))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BlockedGroupsEditPage);