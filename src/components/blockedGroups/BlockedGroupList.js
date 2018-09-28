import React, { Component } from 'react';
import autoBind from 'react-autobind';
import strings from '../../services/strings';
import { browserHistory } from 'react-router';
import _ from 'lodash';

import Modal from 'boron/DropModal';

class BlockedGroupList extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    getLogo(item) {
        return (
            <div className="item-logo default-logo ion-android-people"></div>
        );
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

    showUnBlockModal(){
        this.refs.unBlockModal.show();
    }

    hideUnBlockModal(){
        this.refs.unBlockModal.hide();
    }

    handleUnBlockClick(id){
        this.props.setCurrentItemId(id);
        this.showUnBlockModal();
    }

    handleConfirmUnBlockClick(){
        this.props.unBlockItem(this.props.currentItem.id);
        _.delay(() => this.props.unsetCurrentItemId(), 250);
        this.hideUnBlockModal();
    }

    handleCancelUnBlockClick(){
        _.delay(() => this.props.unsetCurrentItemId(), 250);
        this.hideUnBlockModal();
    }


    handleEditClick(id) {
        browserHistory.push(`/users/groups/blockedGroups/${id}`);
    }

    render() {

        let items = _.map(this.props.items, (item) => {
            return (
                <tr key={ item.id }>
                    <td>
                        { this.getLogo(item) }
                    </td>
                    <td>
                        <div className="details">
                            <div className="name">
                                { item.name }
                            </div>
                            <div className="description">
                                { `${_.size(item.users)} ${strings.get('App.blockedGroups.listPage.users')}`}
                            </div>
                        </div>
                    </td>
                    <td><i onClick={() => this.handleDeleteClick(item.id)} className="btn btn-default delete-btn ion-trash-b" /></td>
                    <td><i onClick={() => this.handleUnBlockClick(item.id)} className="btn btn-default unblock-btn ion-unlocked" /></td>
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

        let unBlockModalContent = this.props.currentItem ? (
            <span>
                <h2>{ strings.get('App.blockModal.unBlockMessage', {itemName: this.props.currentItem.name}) }</h2>
                <div className="form-actions">
                    <button className="btn btn-lg btn-danger" onClick={ this.handleConfirmUnBlockClick }>{ strings.get('App.blockModal.unBlock') }</button>
                    <button className="btn btn-lg btn-default" onClick={ this.handleCancelUnBlockClick }>{ strings.get('App.blockModal.cancel') }</button>
                </div>
            </span>
        ) : null;

        return (
            <span className="GroupList">
                <Modal className="boron-modal" ref="deleteModal">
                    { deleteModalContent }
                </Modal>
                <Modal className="boron-modal" ref="unBlockModal">
                    { unBlockModalContent }
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

BlockedGroupList.propTypes = {
    items: React.PropTypes.array.isRequired,
    fetchItems: React.PropTypes.func.isRequired,
    setCurrentItemId: React.PropTypes.func.isRequired,
    unsetCurrentItemId: React.PropTypes.func.isRequired,
    deleteItem: React.PropTypes.func.isRequired,
    unBlockItem: React.PropTypes.func.isRequired
}

export default BlockedGroupList;