import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../../../services/strings';
import { Link } from 'react-router';
import _ from 'lodash';
import '../../Page.scss';

import * as languagesActions from '../../../store/languages/actions';
import * as languagesSelectors from '../../../store/languages/selectors';

import Topbar from '../../../components/Topbar';
import SubTopbar from '../../../components/SubTopbar';
import SearchBar from '../../../components/SearchBar';
import SettingsTabs from '../../../components/settings/SettingsTabs';
import LanguageForm from '../../../components/settings/languages/LanguageForm';

class LanguageAddPage extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillMount() {
        this.props.fetchAllLanguages();
    }

    handleSubmit(state) {
        state.status = Number(state.status);
        this.props.createLanguage(state);
        _.delay(()=>{window.location.href = '/settings/languages'},500);
    }

    render() {
        return (
            <div className="LanguageAddPage">
                <Topbar currentLanguage={this.props.currentLanguage} handleLangChange={this.props.handleLangChange}>
                    <div className="title">
                        <Link to="/settings">{strings.get('App.settings.title')}</Link>
                    </div>
                </Topbar>
                <SubTopbar>
                    <SettingsTabs />
                </SubTopbar>

                <div className="content">
                    <LanguageForm
                        handleSubmit={ this.handleSubmit }
                    />
                </div>
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        languages: languagesSelectors.getItems(state),
        currentLanguage: languagesSelectors.getCurrentItem(state),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchAllLanguages: () => {
            dispatch(languagesActions.fetchAllItems())
        },
        updateLanguage: (id, data) => {
            dispatch(languagesActions.updateItem(id, data))
        },
        setCurrentLanguageId: (id) => {
            dispatch(languagesActions.setCurrentItemId(id))
        },
        unsetCurrentLanguageId: () => {
            dispatch(languagesActions.unsetCurrentItemId())
        },
        createLanguage: (data) => {
            dispatch(languagesActions.createItem(data))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LanguageAddPage);