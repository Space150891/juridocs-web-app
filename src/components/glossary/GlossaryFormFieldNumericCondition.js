import React, { Component } from 'react';
import autoBind from 'react-autobind';
import strings from '../../services/strings';
import _ from 'lodash';

class GlossaryFormFieldNumericCondition extends Component {

    state = {
        conditionLoaded: false,
        fieldsLoaded: false,
        condition: {
            type: '',
            percentage: 100,
            field: '',
        },
        fields: [],
    }

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentDidMount() {
        this.tryLoadCondition();
        this.tryLoadFields();
    }

    componentDidUpdate() {
        this.tryLoadCondition();
        this.tryLoadFields();
    }

    tryLoadCondition() {
        if (this.props.field && _.size(this.props.field.condition) && !this.state.conditionLoaded) {
            this.setState({
                conditionLoaded: true,
                condition: this.props.field.condition,
            });
        }
    }

    tryLoadFields() {
        if (_.size(this.props.fields) && this.props.field && !this.state.fieldsLoaded) {
            this.setState({
                fieldsLoaded: true,
                fields: _.filter(this.props.fields, (field) => { 
                    return (field.type == 'numeric' && field.name != this.props.field.name) 
                }),
            });
        }
    }

    handleNumericContitionChange(e) {
        let condition = _.extend(this.state.condition, {});
        let value = e.target.value;

        if (e.target.name == 'percentage') {
            value = parseInt(value) ? parseInt(value) : '';
        }

        condition[e.target.name] = value;

        this.props.onChange(condition);
        this.setState({ condition });
    }

    render() {

        let percentageFormGroup = (this.state.condition.type == '>%' || this.state.condition.type == '<%') ? (
            <div className="col-sm-4">
                <input className="form-control percentage" type="text" name="percentage" value={ this.state.condition.percentage } onChange={ this.handleNumericContitionChange } />
                <span>{strings.get('App.glossaries.glossaryForm.numericCondition.percentOf')}</span>
            </div>
        ) : null;

        let fieldClassName = (this.state.condition.type == '>%' || this.state.condition.type == '<%') ? 'col-sm-4' : 'col-sm-8';

        let fieldFormGroup = this.state.condition.type ? (
            <div className={ fieldClassName }>
                <select className="form-control" name="field" value={ this.state.condition.field } onChange={ this.handleNumericContitionChange }>
                    <option value="" disabled>{strings.get('App.glossaries.glossaryForm.numericCondition.choose')}</option>
                    { _.map(this.state.fields, (field, key) => {
                        return <option value={ field.name } key={ key }>{ field.name }</option>
                    }) }
                </select>
            </div>
        ) : null;

        let typeClassName = this.state.condition.type ? 'col-sm-4' : 'col-sm-12';

        return (
            <div className="GlossaryFormFieldNumericCondition">
                <div className="form-group">
                    <label className="control-label">{strings.get('App.glossaries.glossaryForm.numericCondition.condition')}</label>
                    <div className="row">
                        <div className={ typeClassName }>
                            <select className="form-control" name="type" value={ this.state.condition.type } onChange={ this.handleNumericContitionChange }>
                                <option value="">{strings.get('App.glossaries.glossaryForm.numericCondition.none')}</option>
                                <option value=">">{strings.get('App.glossaries.glossaryForm.numericCondition.greaterThan')}</option>
                                <option value=">%">{strings.get('App.glossaries.glossaryForm.numericCondition.greaterThanPercent')}</option>
                                <option value="<">{strings.get('App.glossaries.glossaryForm.numericCondition.lessThan')}</option>
                                <option value="<%">{strings.get('App.glossaries.glossaryForm.numericCondition.lessThanPercent')}</option>
                            </select>
                        </div>
                        { percentageFormGroup }
                        { fieldFormGroup }
                    </div>
                </div>
            </div>
        );
    }

}

GlossaryFormFieldNumericCondition.propTypes = {
    field: React.PropTypes.any.isRequired,
    fields: React.PropTypes.array.isRequired,
    onChange: React.PropTypes.func.isRequired,
}

export default GlossaryFormFieldNumericCondition;