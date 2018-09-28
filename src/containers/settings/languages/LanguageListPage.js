import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../../../services/strings';
import { Link } from 'react-router';
import '../../Page.scss';

import * as languagesActions from '../../../store/languages/actions';
import * as languagesSelectors from '../../../store/languages/selectors';

import Topbar from '../../../components/Topbar';
import SubTopbar from '../../../components/SubTopbar';
import SearchBar from '../../../components/SearchBar';
import SettingsTabs from '../../../components/settings/SettingsTabs';
import LanguageList from '../../../components/settings/languages/LanguageList';

class LanguageListPage extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillMount() {
        this.props.fetchAllLanguages();
    }

    render() {
        return (
            <div className="LanguageListPage">
                <Topbar currentLanguage={this.props.currentLanguage} handleLangChange={this.props.handleLangChange}>
                    <div className="title">
                        <Link to="/settings/languages">{strings.get('App.settings.title')}</Link>
                    </div>
                </Topbar>
                <SubTopbar>
                    <SettingsTabs />
                </SubTopbar>

                <div className="content">
                    <LanguageList
                        items={ this.props.languages }
                        currentItem={ this.props.currentLang }
                        updateItem={ this.props.updateLanguage }
                        setCurrentItemId={ this.props.setCurrentLanguageId }
                        unsetCurrentItemId={ this.props.unsetCurrentLanguageId }
                    />
                    <Link to="/settings/languages/add" className="btn btn-primary" style={{float:'right'}}>{strings.get('App.settings.languages.addLanguage')}</Link>
                </div >
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        languages: languagesSelectors.getItems(state),
        currentLang: languagesSelectors.getCurrentItem(state),
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
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LanguageListPage);