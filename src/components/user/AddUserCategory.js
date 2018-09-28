import React, { Component } from 'react';
import autoBind from 'react-autobind';
import strings from '../../services/strings';
import _ from 'lodash';

import ActiveLabel from '../ActiveLabel';

class AddUserCategory extends Component {

    state = {
        selectedLoaded: false,
        selected: [],
    };

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentDidMount() {
        this.tryLoadSelected() ;
    }

    componentDidUpdate() {
        this.tryLoadSelected() ;
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
            return item.id === id;
        }) > -1);

        if (!added) {
            let selected = _.extend([], this.state.selected);
            selected.push(this.props.categories[`_${id}`]);

            this.props.onChange(selected);
            this.setState({ selected });
        }
    }

    handleRemove(value) {
        let selected = _.filter(this.state.selected, (item) => {
            return item.id !== value;
        });

        this.props.onChange(selected) ;
        this.setState({ selected }) ;
    }

    render() {
        let selectedCategories = _.map(this.props.selected, (category) => {
            return (
                <ActiveLabel
                    name={`${category.name}`}
                    value={ category.id }
                    onRemove={ this.handleRemove }
                    key={ category.id }
                />
            );
        });
        let categories = _.map(this.props.categories, (item) => {
            return (<option value={ item.id } key={ item.id }>{ `${item.name}` }</option>);
        });
        return (
            <div className="GroupFormUsers" style={this.props.style}>
                <div className="form-category">
                    <label className="control-label">{strings.get('App.users.addUserCategory.title')}</label>
                    <div>
                        { selectedCategories }
                    </div>
                    <select className="form-control" name="users" value="" onChange={ this.handleAdd }>
                        <option value="" disabled>{strings.get('App.users.addUserCategory.choose')}</option>
                        { categories }
                    </select>
                </div>
            </div>
        );
    }
}

AddUserCategory.propTypes = {
    categories: React.PropTypes.object.isRequired,
    selected: React.PropTypes.array.isRequired,
    onChange: React.PropTypes.func.isRequired,
};

export default AddUserCategory;