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
import StepForm from '../../components/step/StepForm';

class StepEditPage extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillMount() {
        this.props.fetchStep(this.props.params.id);
        this.props.setCurrentStepId(this.props.params.id);
    }

    componentWillUnmount() {
        this.props.unsetCurrentStepId();
        this.props.clearExceptions();
    }

    saveStep(data) {
        this.props.updateStep(this.props.params.id, data.form);
    }

    render() {
        return (
            <div className="StepEditPage">
                <Topbar currentLanguage={this.props.currentLanguage} handleLangChange={this.props.handleLangChange}>
                    <div className="title">
                        <Link to="/glossaries">{strings.get('App.stepPages.glossaries')}</Link>
                        <span className="hidden-xs">
                            <span className="divider">/</span>
                            <Link to="/glossaries/steps">{strings.get('App.stepPages.title')}</Link>
                            <span className="divider">/</span>
                            <Link to={`/glossaries/steps/${this.props.params.id}`}>{strings.get('App.stepPages.edit')}</Link>
                        </span>
                    </div>
                </Topbar>

                <div className="content">
                    <StepForm
                        exceptions={ this.props.exceptions }
                        currentItem={ this.props.currentStep }
                        saveItem={ this.saveStep }
                    />
                </div>
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        currentStep: stepsSelectors.getCurrentItem(state),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchStep: (id) => {
            dispatch(stepsActions.fetchItem(id))
        },
        setCurrentStepId: (id) => {
            dispatch(stepsActions.setCurrentItemId(id))
        },
        unsetCurrentStepId: () => {
            dispatch(stepsActions.unsetCurrentItemId())
        },
        updateStep: (id, data) => {
            dispatch(stepsActions.updateItem(id, data))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StepEditPage);