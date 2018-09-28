import React, { Component } from 'react';
import autoBind from 'react-autobind';
import strings from '../../services/strings';
import language from '../../services/language';
import _ from 'lodash';

import ActiveLabel from '../ActiveLabel';

class GlossaryFormFieldsOptions extends Component {

    state = {
        addedLoaded: false,
        added: [],
        option: '',
    }

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentDidMount() {
        this.tryLoadAdded();
    }

    componentDidUpdate() {
        this.tryLoadAdded();
    }

    tryLoadAdded() {
        if (_.size(this.props.added) && !this.state.addedLoaded) {
            this.setState({
                addedLoaded: true,
                added: this.props.added,
            });
        }
    }

    handleChange(e) {
        this.setState({ option: e.target.value })
    }

    handleAdd() {
        let added = (_.findIndex(this.state.added, (item) => {
            return item == this.state.option;
        }) > -1);

        if (!added) {
            let added = _.extend([], this.state.added);
            added.push(this.state.option);

            this.props.onChange(added);
            this.setState({ added, option: '' });
        }
    }

    handleRemove(value) {
        let added = _.filter(this.state.added, (item) => {
            return item != value;
        });

        this.props.onChange(added);
        this.setState({ added });
    }

    render() {

        let options = _.map(this.props.options, (item) => {
            return (<option value={ item.id } key={ item.id }>{ item.name }</option>);
        })

        let addedOptions = _.map(this.props.added, (option, key) => {
            return (
                <ActiveLabel
                    name={ option }
                    value={ option }
                    onRemove={ this.handleRemove }
                    key={ key }
                />
            );
        });

        return (
            <div className="GlossaryFormFieldsOptions">
                <div className="form-group">
                    <label className="control-label">{strings.get('App.glossaries.glossaryForm.fieldOptions.title')}</label>
                    <div>
                        { addedOptions }
                    </div>
                    <div className="row">
                        <div className="col-sm-9">
                            <input className="form-control" type="text" name="option" placeholder={strings.get('App.glossaries.glossaryForm.fieldOptions.placeholder')} value={ this.state.option } onChange={ this.handleChange } />
                        </div>
                        <div className="col-sm-3">
                            <div className="btn btn-default" onClick={ this.handleAdd }>{strings.get('App.glossaries.glossaryForm.fieldOptions.add')}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

GlossaryFormFieldsOptions.propTypes = {
    added: React.PropTypes.array.isRequired,
    onChange: React.PropTypes.func.isRequired,
}

export default GlossaryFormFieldsOptions;