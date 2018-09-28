import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../../services/strings';
import { Link, browserHistory } from 'react-router';
import _ from 'lodash';

class SettingsTabs extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    getLinkClassName(linkName) {
        let path = location.pathname.split('/');
        return (path[2] == linkName) ? 'active' : '';
    }

    render() {
        return (
            <span className="SettingsTabs">
                <ul className="nav nav-tabs">
                    <li className={ this.getLinkClassName('languages') }>
                        <Link to="/settings/languages">{strings.get('App.settings.languages.title')}</Link>
                    </li>
                    <li className={ this.getLinkClassName('email') }>
                        <Link to="/settings/email">{strings.get('App.settings.downloadEmail.title')}</Link>
                    </li>
                    <li className={ this.getLinkClassName('shareEmail') }>
                        <Link to="/settings/shareEmail">{strings.get('App.settings.shareEmail.title')}</Link>
                    </li>
                    <li className={ this.getLinkClassName('searchPlaceholder') }>
                        <Link to="/settings/searchPlaceholder">{strings.get('App.settings.documents.title')}</Link>
                    </li>
                </ul>
            </span>
        );
    }

}

SettingsTabs.propTypes = {
    //
}

export default SettingsTabs;