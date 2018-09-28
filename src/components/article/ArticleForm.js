import React, { Component } from 'react';
import autoBind from 'react-autobind';
import strings from '../../services/strings';
import { browserHistory } from 'react-router';
import Editor from '../Editor';
import _ from 'lodash';

class ArticleForm extends Component {

    state = {
        currentItemLoaded: false,
        form: {
            name: '',
            url: '',
            article_category_id: '',
            articleCategories: [],
            content: '',
            visible: false,
            content_type: false, //if false, so no need to be link
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
        form.content_type = Number(this.state.form.content_type);

        this.setState(_.extend(this.state.form, form), ()=>{
            this.props.saveItem(this.state);
        });
    }

    handleCancelClick(e) {
        e.preventDefault();
        browserHistory.push('/articles');
    }

    handleCheckboxChange(e) {
        let form = {};
        form[e.target.name] = e.target.checked;
        this.setState({
            form: _.extend(this.state.form, form)
        });
    }

    handleContentChange(e) {
        this.setState({
            form: _.extend(this.state.form, {
                content: e.target.getContent(),
            }),
        });
    }

    getArticleCategories() {
        return _.map(this.props.articleCategories, (item) => {
            return (
                <option key={`item-${item.id}`} value={item.id}>{item.name}</option>
            );
        });
    }

    render() {
        let nameLabel = this.hasError('name') ? `${strings.get('App.articleForm.name')} ${this.getErrorMessage('name')}` : strings.get('App.articleForm.name');
        let urlLabel = this.hasError('url') ? `${strings.get('App.articleForm.url')} ${this.getErrorMessage('url')}` : strings.get('App.articleForm.url');
        let contentLabel = this.hasError('content') ? `${strings.get('App.articleForm.content')} ${this.getErrorMessage('content')}` : strings.get('App.articleForm.content');

        return (
            <div className="ArticleForm row">
                <form className="col-sm-12 col-md-6">
                    <div className={ this.getErrorClass('name', 'form-group') }>
                        <label className="control-label">{ nameLabel }</label>
                        <input className="form-control" type="text" name="name" value={ this.state.form.name } onChange={ this.handleInputChange } />
                    </div>
                    <div className={ this.getErrorClass('url', 'form-group') }>
                        <label className="control-label">{ urlLabel }</label>
                        <input className="form-control" type="text" name="url" value={ this.state.form.url } onChange={ this.handleInputChange } />
                    </div>
                    <div className="articleCategories">
                        <label className="control-label">{ strings.get('App.articleForm.articleCategory') }</label>
                        <select className="form-control" name="article_category_id" value={ this.state.form.article_category_id } onChange={ this.handleInputChange }>
                            <option value="">{ strings.get('App.articleForm.choose') }</option>
                            { this.getArticleCategories() }
                        </select>
                    </div>
                    <div className="visibility">
                        <label className="control-label">{ strings.get('App.articleForm.visible') }</label>
                        <input type="checkbox" name="visible" checked={ this.state.form.visible } onChange={ this.handleCheckboxChange }/>
                    </div>
                    <div className="content_type">
                        <label className="control-label">{ strings.get('App.articleForm.content_type') }</label>
                        <input type="checkbox" name="content_type" checked={ this.state.form.content_type } onChange={ this.handleCheckboxChange }/>
                    </div>
                    <div className={ this.getErrorClass('content', 'form-group col-sm-12') }>
                        <label className="control-label">{ contentLabel }</label>
                        <Editor
                            content={ this.state.form.content }
                            handleChange={ this.handleContentChange }
                        />
                    </div>
                    <div className="form-actions">
                        <button className="btn btn-primary" onClick={ this.handleSaveClick }>{strings.get('App.articleForm.save')}</button>
                        <button className="btn btn-default" onClick={ this.handleCancelClick }>{strings.get('App.articleForm.cancel')}</button>
                    </div>
                </form>
            </div>
        );
    }
}

ArticleForm.propTypes = {
    exceptions: React.PropTypes.object.isRequired,
    saveItem: React.PropTypes.func.isRequired,
};

export default ArticleForm;