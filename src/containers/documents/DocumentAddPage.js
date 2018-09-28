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

class DocumentAddPage extends Component {

    state = {
        fieldsLoaded : false,
    };

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillMount() {
        this.props.fetchAllCategories();
        this.props.fetchAllSteps();
        this.props.fetchAllGlossaries();
    }

    componentWillUnmount() {
        this.props.clearExceptions();
    }

    saveDocument(data) {
        if (data.file) {
            this.props.createDocumentWithLogo(data.form, data.file);
        } else {
            this.props.createDocument(data.form);
        }
    }

    render() {
        return (
            <div className="DocumentAddPage">
                <Topbar currentLanguage={this.props.currentLanguage} handleLangChange={this.props.handleLangChange}>
                    <div className="title">
                        <Link to="/documents">{strings.get('App.documentPages.title')}</Link>
                        <span className="hidden-xs">
                            <span className="divider">/</span>
                            <Link to="/documents/add">{strings.get('App.documentPages.add')}</Link>
                        </span>
                    </div>
                </Topbar>

                <div className="content">
                    <DocumentForm
                        exceptions={ this.props.exceptions }
                        categories={ this.props.categories }
                        glossaries={ this.props.glossaries }
                        saveItem={ this.saveDocument }
                        fields={ this.props.fields }
                        selectors={ this.props.selectors }
                        clauses={ this.props.clauses }
                        steps={ this.props.steps }
                        stepsFromValidation={ this.props.stepsFromValidation }
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
        fields: documentsSelectors.getFields(state),
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
        createDocument: (data) => {
            dispatch(documentsActions.createItem(data))
        },
        createDocumentWithLogo: (data, file) => {
            dispatch(documentsActions.createItemWithLogo(data, file))
        },
        fetchStep: (id) => {
            dispatch(stepsActions.fetchItem(id));
        },
        updateGlossary: (id, data) => {
            dispatch(glossariesActions.updateItem(id, data))
        },
        createGlossary: (data) => {
            dispatch(glossariesActions.createItem(data))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentAddPage);