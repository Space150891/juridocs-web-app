import React, { Component } from 'react';
import autoBind from 'react-autobind';
import strings from '../../services/strings';
import _ from 'lodash';

import ActiveLabel from '../ActiveLabel';

class CategoryFormTeamMembers extends Component {

    state = {
        selectedLoaded: false,
        selected: [],
    };

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
            return item.id === parseInt(id);
        }) > -1);

        if (!added) {
            let selected = _.extend([], this.state.selected);
            let newItemId = _.findIndex(this.props.teamMembers, (item) => {
                return item.id === parseInt(id);
            });

            selected.push(this.props.teamMembers[newItemId]);

            this.props.onChange(selected);
            this.setState({ selected });
        }
    }

    handleRemove(value) {
        let selected = _.filter(this.state.selected, (item) => {
            return item.id !== value;
        });

        this.props.onChange(selected);
        this.setState({ selected });
    }

    render() {

        let teamMembers = _.map(this.props.teamMembers, (item) => {
            return (<option value={ item.id } key={ item.id }>{`${item.first_name} ${item.last_name}`}</option>);
        });

        let selectedTeamMembers = _.map(this.state.selected, (item) => {
            return (
                <ActiveLabel
                    name={ `${item.first_name} ${item.last_name}` }
                    value={ item.id }
                    onRemove={ this.handleRemove }
                    key={ item.id }
                />
            );
        });

        return (
            <div className="CategoryFormTeamMembers">
                <div className="form-group">
                    <label className="control-label">{strings.get('App.categoryFormTeamMembers.title')}</label>
                    <div>
                        { selectedTeamMembers }
                    </div>
                    <select className="form-control" name="teamMembers" value="" onChange={ this.handleAdd }>
                        <option value="" disabled>{strings.get('App.categoryFormTeamMembers.choose')}</option>
                        { teamMembers }
                    </select>
                </div>
            </div>
        );
    }

}

CategoryFormTeamMembers.propTypes = {
    teamMembers: React.PropTypes.array.isRequired,
    selected: React.PropTypes.array.isRequired,
    onChange: React.PropTypes.func.isRequired,
};

export default CategoryFormTeamMembers;