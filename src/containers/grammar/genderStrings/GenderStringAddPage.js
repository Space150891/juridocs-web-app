import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../../../services/strings';
import { Link } from 'react-router';
import '../../Page.scss';

import * as genderStringsActions from '../../../store/genderStrings/actions';
import * as genderStringsSelectors from '../../../store/genderStrings/selectors';

import Topbar from '../../../components/Topbar';
import SubTopbar from '../../../components/SubTopbar';
import GrammarTabs from '../../../components/grammar/GrammarTabs';
import GenderStringForm from '../../../components/grammar/genderString/GenderStringForm';

class GenderStringAddPage extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillUnmount() {
        this.props.clearExceptions();
    }

    saveGenderString(data) {
        this.props.createGenderString(data.form);
    }

    render() {
        return (
            <div className="GenderStringAddPage">
                <Topbar currentLanguage={this.props.currentLanguage} handleLangChange={this.props.handleLangChange}>
                        <div className="title">
                            <Link to="/grammar/gender-strings">{strings.get('App.genderStringPages.title')}</Link>
                        </div>
                </Topbar>
                <SubTopbar>
                    <GrammarTabs />
                </SubTopbar>

                <div className="content">
                    <GenderStringForm
                        exceptions={ this.props.exceptions }
                        saveItem={ this.saveGenderString }
                    />
                </div>
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        genderStrings: genderStringsSelectors.getItems(state),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchAllGenderStrings: (deleteCache) => {
            dispatch(genderStringsActions.fetchAllItems(deleteCache))
        },
        createGenderString: (data) => {
            dispatch(genderStringsActions.createItem(data))
        },
        createGenderStringWithLogo: (data, file) => {
            dispatch(genderStringsActions.createItemWithLogo(data, file))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GenderStringAddPage);