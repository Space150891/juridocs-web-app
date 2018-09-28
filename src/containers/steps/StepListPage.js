import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../../services/strings';
import { Link } from 'react-router';
import '../Page.scss';

import * as stepsActions from '../../store/steps/actions';
import * as stepsSelectors from '../../store/steps/selectors';

import Topbar from '../../components/Topbar';
import SubTopbar from '../../components/SubTopbar';
import StepList from '../../components/step/StepList';
import * as glossariesSelectors from '../../store/glossaries/selectors';
import * as glossariesActions from '../../store/glossaries/actions';

class StepListPage extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillMount() {
        this.props.fetchAllSteps();
    }

    componentDidMount() {
        this.props.fetchAllGlossaries();
    }

    render() {
        return (
            <div className="StepListPage">
                <Topbar currentLanguage={this.props.currentLanguage} handleLangChange={this.props.handleLangChange}>
                    <div className="title">
                        <Link to="/glossaries">{strings.get('App.stepPages.glossaries')}</Link>
                        <span className="hidden-xs">
                            <span className="divider">/</span>
                            <Link to="/glossaries/steps">{strings.get('App.stepPages.edit')}</Link>
                        </span>
                    </div>
                    <div className="main-btns">
                        <Link to="/glossaries/steps/add" className="btn btn-primary">{strings.get('App.stepPages.addStep')}</Link>
                    </div>
                </Topbar>

                <div className="content">
                    <StepList
                        items={ this.props.steps }
                        currentItem={ this.props.currentStep }
                        fetchItems={ this.props.fetchAllSteps }
                        orderItems={ this.props.orderSteps }
                        setCurrentItemId={ this.props.setCurrentStepId }
                        unsetCurrentItemId={ this.props.unsetCurrentStepId }
                        deleteItem={ this.props.deleteStep }
                        glossaries={this.props.glossaries}
                    />
                </div>
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        steps: stepsSelectors.getItems(state),
        currentStep: stepsSelectors.getCurrentItem(state),
        glossaries:glossariesSelectors.getItems(state),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchAllSteps: (deleteCache) => {
            dispatch(stepsActions.fetchAllItems(deleteCache))
        },
        orderSteps: (items) => {
            dispatch(stepsActions.orderItems(items))
        },
        setCurrentStepId: (id) => {
            dispatch(stepsActions.setCurrentItemId(id))
        },
        unsetCurrentStepId: () => {
            dispatch(stepsActions.unsetCurrentItemId())
        },
        deleteStep: (id) => {
            dispatch(stepsActions.deleteItem(id))
        },
        fetchAllGlossaries: () => {
            dispatch(glossariesActions.fetchAllItems())
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StepListPage);