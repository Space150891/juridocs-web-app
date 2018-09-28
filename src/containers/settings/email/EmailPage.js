import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../../../services/strings';
import settings from '../../../services/settings';
import { Link } from 'react-router';
import '../../Page.scss';

import * as settingsActions from '../../../store/settings/actions';
import * as settingsSelectors from '../../../store/settings/selectors';

import Modal from 'boron/DropModal';
import Topbar from '../../../components/Topbar';
import SubTopbar from '../../../components/SubTopbar';
import SearchBar from '../../../components/SearchBar';
import SettingsTabs from '../../../components/settings/SettingsTabs';
import EmailForm from '../../../components/settings/email/EmailForm';

class LanguageListPage extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillMount() {
        this.props.fetchAllSettings();
    }

    showSaveModal() {
        this.refs.saveModal.show();
    }
      
    hideSaveModal() {
        this.refs.saveModal.hide();
    }

    saveSettings(data) {
        let subjectPromise = this.props.updateSetting(data.form[settings.keys.EMAIL_SUBJECT]);
        let messagePromise = this.props.updateSetting(data.form[settings.keys.EMAIL_MESSAGE]);

        Promise.all([subjectPromise, messagePromise])
            .then(() => {
                this.showSaveModal();
            })
    }

    handleShowModal() {
        _.delay(() => {
            this.hideSaveModal();
        }, 500);
    }

    render() {
        return (
            <div className="LanguageListPage">
                <Modal className="boron-modal no-body" ref="saveModal" onShow={ this.handleShowModal }>
                    <span>
                        <h2>{strings.get('App.settings.settingsSaved')}</h2>
                    </span>
                </Modal>
                <Topbar currentLanguage={this.props.currentLanguage} handleLangChange={this.props.handleLangChange}>
                    <div className="title">
                        <Link to="/settings/email">{strings.get('App.settings.title')}</Link>
                    </div>
                </Topbar>
                <SubTopbar>
                    <SettingsTabs />
                </SubTopbar>

                <div className="content">
                    <EmailForm
                        settings={ this.props.settings }
                        saveSettings={ this.saveSettings }
                    />
                </div>
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        settings: settingsSelectors.getItems(state),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchAllSettings: () => {
            dispatch(settingsActions.fetchAllItems())
        },
        updateSetting: (data) => {
            return dispatch(settingsActions.updateItem(data))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LanguageListPage);