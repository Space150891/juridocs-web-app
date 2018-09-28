import React, { Component } from 'react';
import autoBind from 'react-autobind';
import strings from '../../services/strings';
import { browserHistory } from 'react-router';
import _ from 'lodash';
import './GroupList.scss';

import Modal from 'boron/DropModal';

class GroupList extends Component {

    state = {
        "reason" : ""
    };

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

    showBlockModal() {
        this.setState({"reason":""});
        this.refs.blockModal.show();
    }

    hideBlockModal() {
        this.refs.blockModal.hide();
    }

    handleBlockClick(id) {
        this.props.setCurrentItemId(id);
        this.showBlockModal();
    }

    handleConfirmBlockClick() {
        this.props.blockItem(this.props.currentItem.id, this.state);
        _.delay(() => this.props.unsetCurrentItemId(), 250);
        this.hideBlockModal();
    }

    handleCancelBlockClick() {
        _.delay(() => this.props.unsetCurrentItemId(), 250);
        this.hideBlockModal();
    }

    handleInputChange(e){
        this.setState({"reason": e.target.value});
    }

    handleEditClick(id) {
        browserHistory.push(`/users/groups/${id}`);
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
                                { `${_.size(item.users)} ${strings.get('App.blockedGroups.listPage.users')}` }
                            </div>
                        </div>
                    </td>
                    <td><i onClick={() => this.handleEditClick(item.id)} className="btn btn-default edit-btn ion-edit"></i></td>
                    <td><i onClick={() => this.handleDeleteClick(item.id)} className="btn btn-default delete-btn ion-trash-b"></i></td>
                    <td><i onClick={() => this.handleBlockClick(item.id)} className="btn btn-default block-btn ion-locked"></i></td>
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

        let blockModalContent = this.props.currentItem ? (
            <span>
                <h2>{ strings.get('App.blockModal.message', {itemName: this.props.currentItem.name}) }</h2>
                <div className="form-actions">
                    <label htmlFor="reason">{ strings.get('App.blockModal.reason') }</label>
                    <textarea id="reason" className="form-control" type="text" name="reason" onChange={ this.handleInputChange } /><br/>
                    <button className="btn btn-lg btn-danger" onClick={ this.handleConfirmBlockClick }>{ strings.get('App.blockModal.block') }</button>
                    <button className="btn btn-lg btn-default" onClick={ this.handleCancelBlockClick }>{ strings.get('App.blockModal.cancel') }</button>
                </div>
            </span>
        ) : null;

        return (
            <span className="GroupList">
                <Modal className="boron-modal" ref="deleteModal">
                    { deleteModalContent }
                </Modal>
                <Modal className="boron-modal" ref="blockModal">
                    { blockModalContent }
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

GroupList.propTypes = {
    items: React.PropTypes.array.isRequired,
    sorter: React.PropTypes.object.isRequired,
    fetchItems: React.PropTypes.func.isRequired,
    setCurrentItemId: React.PropTypes.func.isRequired,
    unsetCurrentItemId: React.PropTypes.func.isRequired,
    deleteItem: React.PropTypes.func.isRequired,
    blockItem: React.PropTypes.func.isRequired,
    toggleSorter: React.PropTypes.func.isRequired,
}

export default GroupList;