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
import SearchPlaceholderForm from '../../../components/settings/searchPlaceholder/searchPlaceholderForm';
import DenyMessageModal from '../../../components/settings/denyMessage/denyMessageModal';

class SearchPlaceholderPage extends Component {
    state = {
        showPlaceholder: false,
        showDenyMessage: false,
    }

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

    saveSettingsPlaceholder(data) {
        let placeholderPromise = this.props.updateSetting(data.form[settings.keys.SEARCH_PLACEHOLDER]);
        Promise.all([placeholderPromise])
            .then(() => {
                this.showSaveModal();
            })
    }saveSettingsMessage(data) {
        let dennymessagePromise = this.props.updateSetting(data.form[settings.keys.DENY_MESSAGE]);
        Promise.all([dennymessagePromise])
            .then(() => {
                this.showSaveModal();
            })
    window.location.reload();
    }

    handleShowModal() {
        _.delay(() => {
            this.hideSaveModal();
        }, 500);
    }
    showPlaceholder (){
        this.setState({ showPlaceholder: true });
        this.setState({ showDenyMessage: false });
    }
    showDenyMessage (){
        this.setState({ showDenyMessage: true });
        this.setState({ showPlaceholder: false });
    }
    render() {
        //as4dsa4d45s
        return (
            <div className="SearchPlaceholderPage">
                <Modal className="boron-modal no-body" ref="saveModal" onShow={ this.handleShowModal }>
              <span>
                  <h2>{strings.get('App.settings.settingsSaved')}</h2>
              </span>
                </Modal>
                <Topbar currentLanguage={this.props.currentLanguage} handleLangChange={this.props.handleLangChange}>
                    <div className="title">
                        <Link to="/settings/searchPlaceholder">{strings.get('App.settings.title')}</Link>
                    </div>
                </Topbar>
                <SubTopbar>
                    <SettingsTabs />
                </SubTopbar>

                <div className="content">
                    <button className="btn btn-primary" onClick={this.showPlaceholder}>
                        placholder
                    </button>
                   <button className="btn btn-primary showDenyMessage"onClick={this.showDenyMessage}>
                        message
                    </button>
                    <div>
                        { this.state.showPlaceholder ? <SearchPlaceholderForm
                                settings={ this.props.settings }
                                saveSettings={ this.saveSettingsPlaceholder }
                            /> : null }
                    </div>
                    <div>
                        { this.state.showDenyMessage ?<DenyMessageModal
                                settings={ this.props.settings }
                                saveSettings={ this.saveSettingsMessage }
                            /> : null }
                    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(SearchPlaceholderPage);