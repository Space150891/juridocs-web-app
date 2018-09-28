import React, { Component } from 'react';
import autoBind from 'react-autobind';
import strings from '../services/strings';

import './SubTopbar.scss';

class SubTopbar extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    render() {
        return (
            <nav className="SubTopbar">
                { this.props.children }
            </nav>
        );
    }

}

SubTopbar.propTypes = {
    //
}

export default SubTopbar;