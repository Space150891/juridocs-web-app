import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../../services/strings';
import { Link, browserHistory } from 'react-router';
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

class GlossaryAddPage extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillMount() {
        this.props.fetchAllGlossaries();
        this.props.fetchAllCategories();
        this.props.fetchAllSteps();
    }

    componentWillUnmount() {
        this.props.clearExceptions();
    }

    async saveGlossary(data) {
        await this.props.createGlossary(data.form);
        browserHistory.push(`/glossaries`);
    }

    render() {
        return (
            <div className="GlossaryAddPage">
                <Topbar currentLanguage={this.props.currentLanguage} handleLangChange={this.props.handleLangChange}>
                    <div className="title">
                        <Link to="/glossaries">{strings.get('App.glossaryPages.title')}</Link>
                        <span className="hidden-xs">
                            <span className="divider">/</span>
                            <Link to="/glossaries/add">{strings.get('App.glossaryPages.add')}</Link>
                        </span>
                    </div>
                </Topbar>

                <div className="content">
                    <GlossaryForm
                        exceptions={ this.props.exceptions }
                        categories={ this.props.categories }
                        glossaries={ this.props.glossaries }
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
        createGlossary: (data) => {
            dispatch(glossariesActions.createItem(data))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GlossaryAddPage);