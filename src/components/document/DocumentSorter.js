import React, { Component } from 'react';
import autoBind from 'react-autobind';
import strings from '../../services/strings';
import language from '../../services/language';
import _ from 'lodash';

import './DocumentSorter.scss';

class DocumentSorter extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    getSorter() {
        if (this.props.sorter) {
            return this.props.sorter.column;
        }

        return '';
    }

    handleChange(e) {
        let sorter = {
            column: e.target.value,
            descending: true,
        }

        if (sorter.column == 'name') {
            sorter.descending = false;
        }

        this.props.setSorter(sorter);
        this.props.fetchItems(true);
    }

    render() {
        return (
            <div className="DocumentSorter">
                <label>{strings.get('App.documents.sorter.title')}</label>
                <select className="form-control" name="sorter" value={ this.getSorter() } onChange={ this.handleChange }>
                    <option value="name">{strings.get('App.documents.sorter.name')}</option>
                    <option value="price">{strings.get('App.documents.sorter.price')}</option>
                    <option value="downloads">{strings.get('App.documents.sorter.downloads')}</option>
                    <option value="created_at">{strings.get('App.documents.sorter.newest')}</option>
                </select>
            </div>
        );
    }

}

DocumentSorter.propTypes = {
    sorter: React.PropTypes.object,
    setSorter: React.PropTypes.func.isRequired,
    fetchItems: React.PropTypes.func.isRequired,
}

export default DocumentSorter;