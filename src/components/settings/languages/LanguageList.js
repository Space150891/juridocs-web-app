import React, { Component } from 'react';
import autoBind from 'react-autobind';
import strings from '../../../services/strings';
import { browserHistory } from 'react-router';
import _ from 'lodash';
import './LanguageList.scss';

import Switch from '../../Switch.js';

class LanguageList extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    handleChange(id, enabled) {
        this.props.updateItem(id, {
            status: (enabled ? 1 : 0)
        });
    }

    handleLanguageClick(id) {
        browserHistory.push(`/settings/languages/${id}`) ;
    }

    render() {

        let items = _.map(this.props.items, (value) => {
            return (
                <tr key={ value.id }>
                    <td style={{cursor: "pointer"}} onClick={()=> {this.handleLanguageClick(value.id)} }>
                         { strings.get(`Languages.${value.iso2}`) }
                    </td>
                    <td>
                        <Switch 
                            enabled={ !!value.status }
                            onChange={ (enabled) => this.handleChange(value.id, enabled) }
                        />
                    </td>
                </tr>
            );
        });

        return (
            <span className="LanguageList">
                <table className="table">
                    <tbody>
                        { items }
                    </tbody>
                </table>
            </span>
        );
    }
}

LanguageList.propTypes = {
    items: React.PropTypes.object.isRequired,
    updateItem: React.PropTypes.func.isRequired,
    setCurrentItemId: React.PropTypes.func.isRequired,
    unsetCurrentItemId: React.PropTypes.func.isRequired,
}

export default LanguageList;