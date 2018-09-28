import React, { Component } from 'react';
import autoBind from 'react-autobind';
import strings from '../services/strings';

import './Topbar.scss';

import LanguageSelector from '../containers/LanguageSelector';

class Topbar extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    render() {
        return (
            <nav className="Topbar navbar navbar-default">
                <div className="container-fluid">
                    <LanguageSelector currentLanguage={this.props.currentLanguage} handleLangChange={this.props.handleLangChange} />
                    { this.props.children }
                </div>
            </nav>
        );
    }

}

Topbar.propTypes = {
    //
}

export default Topbar;