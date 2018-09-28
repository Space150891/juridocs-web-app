import React, { Component } from 'react';
import autoBind from 'react-autobind';
import strings from '../../services/strings';
import { browserHistory } from 'react-router';
import _ from 'lodash';
import './DocumentList.scss';

import Modal from 'boron/DropModal';

class DocumentList extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    getLogo(item) {
        if (item.imageURL) {
            return (
                <div className="item-logo" style={ {backgroundImage: `url('${item.imageURL}')`} }></div>
            );
        }

        return (
            <div className="item-logo default-logo ion-android-document"></div>
        );
    }

    getPrice(item) {
        return (parseFloat(item.price) && item.payed) ? `${strings.get('App.documents.price.currencySign')}${item.price}` : (
            <span className="label label-success">{strings.get('App.documents.price.free')}</span>
        );
    }

    getCategory(item) {
        if (this.props.categories[`_${item.category_id}`]) {
            return this.props.categories[`_${item.category_id}`].name;
        }
    }

    getDocuments() {
        if (this.props.items && this.props.categories) {
            return _.map(this.props.items, (item) => {
                return (
                    <tr key={ item.id }>
                        <td style={{ cursor: 'pointer' }} onClick={() => this.handleEditClick(item.id)}>
                            { this.getLogo(item) }
                        </td>
                        <td>
                            <div className="details">
                                <div style={{ cursor: 'pointer' }}  onClick={() => this.handleEditClick(item.id)} className="name">
                                    { item.name }
                                </div>
                                <div className="description">
                                    { this.getCategory(item) }
                                </div>
                            </div>
                        </td>
                        <td>{ this.getPrice(item) }</td>
                        <td>{ _.size(item.downloads) }</td>
                        <td><i onClick={() => this.handleEditClick(item.id)} className="btn btn-default edit-btn ion-edit"></i></td>
                        <td><i onClick={() => this.handleDeleteClick(item.id)} className="btn btn-default delete-btn ion-trash-b"></i></td>
                    </tr>
                );
            });
        }
    }

    showDeleteModal() {
        this.refs.deleteModal.show();
    }
      
    hideDeleteModal() {
        this.refs.deleteModal.hide();
    }

    handleDeleteClick(id) {
        this.props.setCurrentItemId(id);
        this.showDeleteModal();
    }

    handleConfirmDeleteClick() {
        this.props.deleteItem(this.props.currentItem.id);
        _.delay(() => this.props.unsetCurrentItemId(), 250);
        this.hideDeleteModal();
    }

    handleCancelDeleteClick() {
        _.delay(() => this.props.unsetCurrentItemId(), 250);
        this.hideDeleteModal();
    }

    handleEditClick(id) {
        browserHistory.push(`/documents/${id}`);
    }

    render() {
        let deleteModalContent = this.props.currentItem ? (
            <span>
                <h2>{ strings.get('App.deleteModal.message', {itemName: this.props.currentItem.name}) }</h2>
                <div className="form-actions">
                    <button className="btn btn-lg btn-danger" onClick={ this.handleConfirmDeleteClick }>{ strings.get('App.deleteModal.delete') }</button>
                    <button className="btn btn-lg btn-default" onClick={ this.handleCancelDeleteClick }>{ strings.get('App.deleteModal.cancel') }</button>
                </div>
            </span>
        ) : null;

        return (
            <span className="DocumentList">
                <Modal className="boron-modal" ref="deleteModal">
                    { deleteModalContent }
                </Modal>
                <table className="table">
                    <thead>
                        <tr>
                            <th></th>
                            <th></th>
                            <th>{strings.get('App.documents.price.title')}</th>
                            <th>{strings.get('App.documents.downloads')}</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.getDocuments() }
                    </tbody>
                </table>
            </span>
        );
    }
}

DocumentList.propTypes = {
    items: React.PropTypes.array.isRequired,
    sorter: React.PropTypes.object.isRequired,
    fetchItems: React.PropTypes.func.isRequired,
    setCurrentItemId: React.PropTypes.func.isRequired,
    unsetCurrentItemId: React.PropTypes.func.isRequired,
    deleteItem: React.PropTypes.func.isRequired,
    toggleSorter: React.PropTypes.func.isRequired,
}

export default DocumentList;