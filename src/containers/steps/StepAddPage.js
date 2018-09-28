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

class StepAddPage extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillUnmount() {
        this.props.clearExceptions();
    }

    saveStep(data) {
        this.props.createStep(data.form);
    }

    render() {
        return (
            <div className="StepAddPage">
                <Topbar currentLanguage={this.props.currentLanguage} handleLangChange={this.props.handleLangChange}>
                    <div className="title">
                        <Link to="/glossaries">{strings.get('App.stepPages.glossaries')}</Link>
                        <span className="hidden-xs">
                            <span className="divider">/</span>
                            <Link to="/glossaries/steps">{strings.get('App.stepPages.title')}</Link>
                            <span className="divider">/</span>
                            <Link to="/glossaries/steps/add">{strings.get('App.stepPages.add')}</Link>
                        </span>
                    </div>
                </Topbar>

                <div className="content">
                    <StepForm
                        exceptions={ this.props.exceptions }
                        saveItem={ this.saveStep }
                    />
                </div>
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        //
    }
}

function mapDispatchToProps(dispatch) {
    return {
        createStep: (data) => {
            dispatch(stepsActions.createItem(data))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StepAddPage);