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

class GroupEditPage extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillMount() {
        this.props.fetchGroup(this.props.params.id);
        this.props.setCurrentGroupId(this.props.params.id);

        this.props.fetchAllUsers();
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
                        <Link to="/users/groups">{strings.get('App.groupPages.title')}</Link>
                        <span className="hidden-xs">
                            <span className="divider">/</span>
                            <Link to={`/users/groups/${this.props.params.id}`}>{strings.get('App.groupPages.edit')}</Link>
                        </span>
                    </div>
                </Topbar>

                <div className="content">
                    <GroupForm
                        exceptions={ this.props.exceptions }
                        users={ this.props.users }
                        currentItem={ this.props.currentGroup }
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
        currentGroup: groupsSelectors.getCurrentItem(state),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchAllUsers: (deleteCache) => {
            dispatch(usersActions.fetchAllItems(deleteCache))
        },
        fetchGroup: (id) => {
            dispatch(groupsActions.fetchItem(id))
        },
        setCurrentGroupId: (id) => {
            dispatch(groupsActions.setCurrentItemId(id))
        },
        unsetCurrentGroupId: () => {
            dispatch(groupsActions.unsetCurrentItemId())
        },
        updateGroup: (id, data) => {
            dispatch(groupsActions.updateItem(id, data))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupEditPage);