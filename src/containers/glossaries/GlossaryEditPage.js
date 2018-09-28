import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../../services/strings';
import { browserHistory } from 'react-router';
import { Link } from 'react-router';
import '../Page.scss';

import * as glossariesActions from '../../store/glossaries/actions';
import * as glossariesSelectors from '../../store/glossaries/selectors';
import * as categoriesActions from '../../store/categories/actions';
import * as categoriesSelectors from '../../store/categories/selectors';
import * as stepsActions from '../../store/steps/actions';
import * as stepsSelectors from '../../store/steps/selectors';

import Topbar from '../../components/Topbar';
import SubTopbar from '../../components/SubTopbar';
import GlossaryForm from '../../components/glossary/GlossaryForm';

class GlossaryEditPage extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillMount() {
        this.props.fetchGlossary(this.props.params.id);
        this.props.setCurrentGlossaryId(this.props.params.id);

        this.props.fetchAllGlossaries();
        this.props.fetchAllCategories();
        this.props.fetchAllSteps();
    }

    componentWillUnmount() {
        this.props.unsetCurrentGlossaryId();
        this.props.clearExceptions();
    }

    async saveGlossary(data) {
        await this.props.updateGlossary(this.props.params.id, data.form);
        browserHistory.push(`/glossaries`);
    }

    render() {
        return (
            <div className="GlossaryEditPage">
                <Topbar currentLanguage={this.props.currentLanguage} handleLangChange={this.props.handleLangChange}>
                    <div className="title">
                        <Link to="/glossaries">{strings.get('App.glossaryPages.title')}</Link>
                        <span className="hidden-xs">
                            <span className="divider">/</span>
                            <Link to={`/glossaries/${this.props.params.id}`}>{strings.get('App.glossaryPages.edit')}</Link>
                        </span>
                    </div>
                </Topbar>

                <div className="content">
                    <GlossaryForm
                        exceptions={ this.props.exceptions }
                        categories={ this.props.categories }
                        glossaries={ this.props.glossaries }
                        currentItem={ this.props.currentGlossary }
                        steps={ this.props.steps }
                        saveItem={ this.saveGlossary }
                    />
                </div>
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        currentGlossary: glossariesSelectors.getCurrentItem(state),
        glossaries: glossariesSelectors.getItems(state),
        categories: categoriesSelectors.getItems(state),
        steps: stepsSelectors.getItems(state),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchAllGlossaries: () => {
            dispatch(glossariesActions.fetchAllItems())
        },
        fetchAllCategories: (deleteCache) => {
            dispatch(categoriesActions.fetchAllItems(deleteCache))
        },
        fetchAllSteps: (deleteCache) => {
            dispatch(stepsActions.fetchAllItems(deleteCache))
        },
        fetchGlossary: (id) => {
            dispatch(glossariesActions.fetchItem(id))
        },
        setCurrentGlossaryId: (id) => {
            dispatch(glossariesActions.setCurrentItemId(id))
        },
        unsetCurrentGlossaryId: () => {
            dispatch(glossariesActions.unsetCurrentItemId())
        },
        updateGlossary: (id, data) => {
            dispatch(glossariesActions.updateItem(id, data))
        },
        createGlossary: (data) => {
            dispatch(glossariesActions.createItem(data))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GlossaryEditPage);