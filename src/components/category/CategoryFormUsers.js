import React, { Component } from 'react';
import autoBind from 'react-autobind';
import strings from '../../services/strings';
import language from '../../services/language';
import _ from 'lodash';

import ActiveLabel from '../ActiveLabel';

class CategoryFormUsers extends Component {

    state = {
        selectedLoaded: false,
        selected: [],
    }

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentDidMount() {
        this.tryLoadSelected();
    }

    componentDidUpdate() {
        this.tryLoadSelected();
    }

    tryLoadSelected() {
        if (_.size(this.props.selected) && !this.state.selectedLoaded) {
            this.setState({
                selectedLoaded: true,
                selected: this.props.selected,
            });
        }
    }

    handleAdd(e) {
        let id = e.target.value;
        let added = (_.findIndex(this.state.selected, (item) => {
            return item.id == id;
        }) > -1);

        if (!added) {
            let selected = _.extend([], this.state.selected);
            selected.push(this.props.users[`_${id}`]);

            this.props.onChange(selected);
            this.setState({ selected });
        }
    }

    handleRemove(value) {
        let selected = _.filter(this.state.selected, (item) => {
            return item.id != value;
        });

        this.props.onChange(selected);
        this.setState({ selected });
    }

    render() {

        let users = _.map(this.props.users, (item) => {
            return (<option value={ item.id } key={ item.id }>{ `${item.first_name} ${item.last_name}` }</option>);
        })

        let selectedUsers = _.map(this.props.selected, (user) => {
            return (
                <ActiveLabel
                    name={`${user.first_name} ${user.last_name}`}
                    value={ user.id }
                    onRemove={ this.handleRemove }
                    key={ user.id }
                />
            );
        });

        return (
            <div className="CategoryFormUsers">
                <div className="form-group">
                    <label className="control-label">{strings.get('App.categoryFormUsers.title')}</label>
                    <div>
                        { selectedUsers }
                    </div>
                    <select className="form-control" name="users" value="" onChange={ this.handleAdd }>
                        <option value="" disabled>{strings.get('App.categoryFormUsers.choose')}</option>
                        { users }
                    </select>
                </div>
            </div>
        );
    }

}

CategoryFormUsers.propTypes = {
    users: React.PropTypes.object.isRequired,
    selected: React.PropTypes.array.isRequired,
    onChange: React.PropTypes.func.isRequired,
}

export default CategoryFormUsers;