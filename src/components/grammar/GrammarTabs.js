import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../../services/strings';
import { Link, browserHistory } from 'react-router';
import _ from 'lodash';

class GrammarTabs extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    render() {

        return (
            <span className="GrammarTabs">
                <ul className="nav nav-tabs">
                    <li className="active">
                        <Link to="/grammar/gender-strings">{strings.get('App.grammar.gender')}</Link>
                    </li>
                </ul>
            </span>
        );
    }

}

GrammarTabs.propTypes = {
    //
}

export default GrammarTabs;