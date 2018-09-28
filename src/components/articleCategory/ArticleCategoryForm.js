import React, { Component } from 'react';
import autoBind from 'react-autobind';
import strings from '../../services/strings';
import { browserHistory } from 'react-router';
import _ from 'lodash';

class ArticleCategoryForm extends Component {

    state = {
        currentItemLoaded: false,
        form: {
            name: '',
            url: '',
            visible: false,
        }
    };

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentDidMount() {
        this.tryLoadCurrentItem();
    }

    componentDidUpdate() {
        this.tryLoadCurrentItem();
    }

    tryLoadCurrentItem() {
        if (this.props.currentItem && !this.state.currentItemLoaded) {
            let form = _.extend({}, this.state.form);
            _.map(this.state.form, (value, key) => {
                form[key] = (this.props.currentItem[key]) ? this.props.currentItem[key] : this.state.form[key];
            });

            this.setState({
                currentItemLoaded: true,
                form
            });
        }
    }

    hasError(inputName) {
        return !!this.props.exceptions[inputName];
    }

    getErrorClass(inputName, defaultClasses = '') {
        return this.hasError(inputName) ? defaultClasses + ' has-error' : defaultClasses;
    }

    getErrorMessage(inputName) {
        return this.props.exceptions[inputName];
    }

    handleInputChange(e) {
        let form = {};
        form[e.target.name] = e.target.value;
        this.setState({
            form: _.extend(this.state.form, form)
        });
    }

    handleSaveClick(e) {
        e.preventDefault();
        let form = {};
        form.visible = Number(this.state.form.visible);

        this.setState(_.extend(this.state.form, form), ()=>{
            this.props.saveItem(this.state);
        });
    }

    handleCancelClick(e) {
        e.preventDefault();
        browserHistory.push('/articleCategories');
    }

    handleCheckboxChange(e) {
        let form = {};
        form[e.target.name] = e.target.checked;
        this.setState({
            form: _.extend(this.state.form, form)
        });
    }

    render() {
        let nameLabel = this.hasError('name') ? `${strings.get('App.articleCategoryForm.name')} ${this.getErrorMessage('name')}` : strings.get('App.articleCategoryForm.name');
        let urlLabel = this.hasError('url') ? `${strings.get('App.articleCategoryForm.url')} ${this.getErrorMessage('url')}` : strings.get('App.articleCategoryForm.url');

        return (
            <div className="ArticleCategoryForm row">
                <form className="col-sm-12 col-md-6">
                    <div className={ this.getErrorClass('name', 'form-group') }>
                        <label className="control-label">{ nameLabel }</label>
                        <input className="form-control" type="text" name="name" value={ this.state.form.name } onChange={ this.handleInputChange } />
                    </div>
                    <div className="visibility">
                        <label className="control-label">{ strings.get('App.articleCategoryForm.visible') }</label>
                        <input type="checkbox" name="visible" checked={ this.state.form.visible } onChange={ this.handleCheckboxChange }/>
                    </div>
                    <div className="form-actions">
                        <button className="btn btn-primary" onClick={ this.handleSaveClick }>{strings.get('App.articleCategoryForm.save')}</button>
                        <button className="btn btn-default" onClick={ this.handleCancelClick }>{strings.get('App.articleCategoryForm.cancel')}</button>
                    </div>
                </form>
            </div>
        );
    }
}

ArticleCategoryForm.propTypes = {
    exceptions: React.PropTypes.object.isRequired,
    saveItem: React.PropTypes.func.isRequired,
};

export default ArticleCategoryForm;