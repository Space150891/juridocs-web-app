import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../../services/strings';
import { Link } from 'react-router';
import '../Page.scss';

import * as documentsActions from '../../store/documents/actions';
import * as documentsSelectors from '../../store/documents/selectors';
import * as categoriesActions from '../../store/categories/actions';
import * as categoriesSelectors from '../../store/categories/selectors';
import * as glossariesActions from '../../store/glossaries/actions';
import * as glossariesSelectors from '../../store/glossaries/selectors';
import * as stepsActions from '../../store/steps/actions';
import * as stepsSelectors from '../../store/steps/selectors';

import Topbar from '../../components/Topbar';
import SubTopbar from '../../components/SubTopbar';
import DocumentForm from '../../components/document/DocumentForm';
import { getModal, getTemplateData } from '../../components/document/DocumentForm';
import _ from 'lodash';

class DocumentEditPage extends Component {

    state = {
        fieldsLoaded : false,
    };

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillMount() {
        this.props.fetchDocument(this.props.params.id);
        this.props.setCurrentDocumentId(this.props.params.id);

        this.props.fetchAllSteps();
        this.props.fetchAllGlossaries();
        this.props.fetchAllCategories();
    }

    componentWillUnmount() {
        this.props.unsetCurrentDocumentId();
        this.props.unsetFieldsOrder();
        this.props.clearExceptions();
    }

    saveDocument(data) {
        this.props.updateDocument(this.props.params.id, data.form);
        if (data.file) {
            this.props.uploadDocumentLogo(this.props.params.id, data.file);
        }
    }

    updateItemOrder(data){
        this.props.updateDocumentOrder(this.props.params.id, data);
    }

    validateDocument(data){
        this.props.validateDoc(this.props.params.id, data);
    }

    showOrderFieldsModal(){
        let modal = getModal();
        if(!(this.props.exceptions.template && this.props.exceptions.template.notDefined))
        modal.show();
    }

    handleOrderFieldsClick(){
        this.setState({fieldsLoaded: false});
        let templateData = getTemplateData();
        this.validateDocument(templateData);
        this.setState({fieldsLoaded: true});
        _.delay(() => {this.showOrderFieldsModal()},250);
    }

    render() {
        return (
            <div className="DocumentEditPage">
                <Topbar currentLanguage={this.props.currentLanguage} handleLangChange={this.props.handleLangChange}>
                    <div className="title">
                        <Link to="/documents">{strings.get('App.documentPages.title')}</Link>
                        <span className="hidden-xs">

                            <span className="divider">/</span>
                            <Link to={`/documents/${this.props.params.id}`}>{strings.get('App.documentPages.edit')}</Link>
                        </span>
                    </div>
                    <div className="main-btns">
                        <button className="btn btn-default" onClick={ this.handleOrderFieldsClick }>{strings.get('App.documentPages.orderFields')}</button>
                    </div>
                </Topbar>

                <div className="content">
                    <DocumentForm
                        exceptions={ this.props.exceptions }
                        categories={ this.props.categories }
                        glossaries={ this.props.glossaries }
                        currentItem={ this.props.currentDocument }
                        saveItem={ this.saveDocument }
                        fields={ this.props.fields }
                        fieldsOrder={ this.props.fieldsOrder }
                        selectors={ this.props.selectors }
                        clauses={ this.props.clauses }
                        steps={ this.props.steps }
                        stepsFromValidation={ this.props.stepsFromValidation }
                        updateItemOrder={ this.updateItemOrder }
                        updateGlossary={ this.props.updateGlossary }
                        createGlossary={ this.props.createGlossary }
                    />
                </div>
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        categories: categoriesSelectors.getItems(state),
        currentDocument: documentsSelectors.getCurrentItem(state),
        fields: documentsSelectors.getFields(state),
        fieldsOrder: documentsSelectors.getFieldsOrder(state),
        selectors: documentsSelectors.getSelectors(state),
        clauses: documentsSelectors.getClauses(state),
        stepsFromValidation: documentsSelectors.getSteps(state),
        steps: stepsSelectors.getItems(state),
        glossaries: glossariesSelectors.getItems(state),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchAllCategories: (deleteCache) => {
            dispatch(categoriesActions.fetchAllItems(deleteCache))
        },
        fetchAllSteps: (deleteCache) => {
            dispatch(stepsActions.fetchAllItems(deleteCache));
        },
        fetchAllGlossaries: () => {
            dispatch(glossariesActions.fetchAllItems())
        },
        fetchDocument: (id) => {
            dispatch(documentsActions.fetchItem(id))
        },
        setCurrentDocumentId: (id) => {
            dispatch(documentsActions.setCurrentItemId(id))
        },
        unsetCurrentDocumentId: () => {
            dispatch(documentsActions.unsetCurrentItemId())
        },
        updateDocument: (id, data) => {
            dispatch(documentsActions.updateItem(id, data))
        },
        uploadDocumentLogo: (id, file) => {
            dispatch(documentsActions.uploadItemLogo(id, file))
        },
        createDocument: (data) => {
            dispatch(documentsActions.createItem(data))
        },
        validateDoc: (id,data) => {
            dispatch(documentsActions.validateItem(id, data))
        },
        fetchStep: (id) => {
            dispatch(stepsActions.fetchItem(id));
        },
        updateDocumentOrder: (id, data) => {
            dispatch(documentsActions.updateItemOrder(id, data));
        },
        updateGlossary: (id, data) => {
            dispatch(glossariesActions.updateItem(id, data))
        },
        createGlossary: (data) => {
            dispatch(glossariesActions.createItem(data))
        },
        unsetFieldsOrder: () => {
            dispatch(documentsActions.unsetFieldsOrder());
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentEditPage);