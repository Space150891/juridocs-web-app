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

class GenderStringEditPage extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillMount() {
        this.props.fetchGenderString(this.props.params.id);
        this.props.setCurrentGenderStringId(this.props.params.id);
    }

    componentWillUnmount() {
        this.props.unsetCurrentGenderStringId();
        this.props.clearExceptions();
    }

    saveGenderString(data) {
        this.props.updateGenderString(this.props.params.id, data.form);
    }

    render() {
        return (
            <div className="GenderStringEditPage">
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
                        currentItem={ this.props.currentGenderString }
                        saveItem={ this.saveGenderString }
                    />
                </div>
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        currentGenderString: genderStringsSelectors.getCurrentItem(state),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchGenderString: (id) => {
            dispatch(genderStringsActions.fetchItem(id))
        },
        setCurrentGenderStringId: (id) => {
            dispatch(genderStringsActions.setCurrentItemId(id))
        },
        unsetCurrentGenderStringId: () => {
            dispatch(genderStringsActions.unsetCurrentItemId())
        },
        updateGenderString: (id, data) => {
            dispatch(genderStringsActions.updateItem(id, data))
        },
        createGenderString: (data) => {
            dispatch(genderStringsActions.createItem(data))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GenderStringEditPage);