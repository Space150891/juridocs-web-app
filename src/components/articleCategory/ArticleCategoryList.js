import React, { Component } from 'react';
import autoBind from 'react-autobind';
import strings from '../../services/strings';
import { browserHistory } from 'react-router';
import _ from 'lodash';

import Modal from 'boron/DropModal';

class ArticleCategoryList extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
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
        browserHistory.push(`/articleCategories/${id}`);
    }

    render() {

        let items = _.map(this.props.items, (item, i) => {
            return (
                <tr key={ item.id }>
                    <td style={{ cursor: 'pointer' }}  onClick={() => this.handleEditClick(item.id)}>
                        <div className="details">
                            <div className="name">{ item.name }</div>
                        </div>
                    </td>
                    <td><i onClick={() => this.handleDeleteClick(item.id)} className="btn btn-default delete-btn ion-trash-b" /></td>
                    <td><i onClick={() => this.handleEditClick(item.id)} className="btn btn-default edit-btn ion-edit" /></td>
                </tr>
            );
        });

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
            <span className="ArticleCategoryList">
                <Modal className="boron-modal" ref="deleteModal">
                    { deleteModalContent }
                </Modal>
                <table className="table">
                    <tbody>
                        { items }
                    </tbody>
                </table>
            </span>
        );
    }
}

ArticleCategoryList.propTypes = {
    items: React.PropTypes.array.isRequired,
    fetchItems: React.PropTypes.func.isRequired,
    setCurrentItemId: React.PropTypes.func.isRequired,
    unsetCurrentItemId: React.PropTypes.func.isRequired,
    deleteItem: React.PropTypes.func.isRequired,
};

export default ArticleCategoryList;