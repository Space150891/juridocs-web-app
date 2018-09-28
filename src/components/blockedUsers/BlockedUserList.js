import React, {Component} from 'react';
import autoBind from 'react-autobind';
import strings from '../../services/strings';
import {browserHistory} from 'react-router';
import moment from 'moment';
import _ from 'lodash';

import Modal from 'boron/DropModal';

class BlockedUserList extends Component {
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
            <div className="item-logo default-logo ion-android-person"></div>
        );
    }

    getRole(item) {
        if (_.find(item.scopes, (scope) => {
                return scope.name == 'admin';
            })) {
            return strings.get('App.users.scopes.admin');
        }

        return strings.get('App.users.scopes.user');
    }

    getRegisterDate(item) {
        return moment(item.created_at).format('DD MMM YYYY');
    }

    handleEditClick(id) {
        browserHistory.push(`/users/blockedUsers/${id}`)
    }

    showDeleteModal() {
        this.refs.deleteModal.show();
    }

    hideDeleteModal() {
        this.refs.deleteModal.hide();
    }

    showBlockModal() {
        this.refs.unBlockModal.show();
    }

    hideBlockModal() {
        this.refs.unBlockModal.hide();
    }

    handleDeleteClick(id) {
        this.props.setCurrentItemId(id);
        this.showDeleteModal();
    }

    handleBlockClick(id) {
        this.props.setCurrentItemId(id);
        this.showBlockModal();
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

    handleConfirmUnBlockClick() {
        this.props.unBlockItem(this.props.currentItem.id);
        _.delay(() => this.props.unsetCurrentItemId(), 250);
        this.hideBlockModal();
    }

    handleCancelBlockClick() {
        _.delay(() => this.props.unsetCurrentItemId(), 250);
        this.hideBlockModal();
    }

    render() {
        let items = _.map(this.props.items, (item) => {
            return (
                <tr key={ item.id }>
                    <td style={{ cursor: 'pointer' }} onClick={() => this.handleEditClick(item.id)}>
                        { this.getLogo(item) }
                    </td>
                    <td>
                        <div className="details">
                            <div style={{ cursor: 'pointer' }} onClick={() => this.handleEditClick(item.id)} className="name">{ item.first_name + ' ' + item.last_name }</div>
                        </div>
                    </td>
                    <td>{ _.size(item.downloads) }</td>
                    <td>{ this.getRole(item) }</td>
                    <td>{ this.getRegisterDate(item) }</td>
                    <td>{ item.reason }</td>
                    <td>
                        <i onClick={() => this.handleDeleteClick(item.id)}
                           className="btn btn-default delete-btn ion-trash-b" />
                        <i onClick={() => this.handleBlockClick(item.id)}
                           className="btn btn-default block-btn ion-unlocked" />
                    </td>
                </tr>
            );
        });
        let deleteModalContent = this.props.currentItem ? (
            <span>
                <h2>{ strings.get('App.deleteModal.message', {itemName: `${this.props.currentItem.first_name} ${this.props.currentItem.last_name}`}) }</h2>
                <div className="form-actions">
                    <button className="btn btn-lg btn-danger"
                            onClick={ this.handleConfirmDeleteClick }>{ strings.get('App.deleteModal.delete') }</button>
                    <button className="btn btn-lg btn-default"
                            onClick={ this.handleCancelDeleteClick }>{ strings.get('App.deleteModal.cancel') }</button>
                </div>
            </span>
        ) : null;

        let unBlockModalContent = this.props.currentItem ? (
            <span>
              <h2>{ strings.get('App.blockModal.unBlockMessage', {itemName: `${this.props.currentItem.first_name} ${this.props.currentItem.last_name}`}) }</h2>
              <div className="form-actions">
                  <button className="btn btn-lg btn-danger"
                          onClick={ this.handleConfirmUnBlockClick }>{ strings.get('App.blockModal.unBlock') }</button>
                  <button className="btn btn-lg btn-default"
                          onClick={ this.handleCancelBlockClick }>{ strings.get('App.blockModal.cancel') }</button>
              </div>
          </span>
        ) : null;
        return (
            <span className="BlockedUserList">
          <Modal className="boron-modal" ref="deleteModal">
              { deleteModalContent }
          </Modal>
            <Modal className="boron-modal" ref="unBlockModal">
                { unBlockModalContent }
            </Modal>
          <table className="table">
              <thead>
                  <tr>
                      <th/>
                      <th/>
                      <th>{strings.get('App.users.downloads')}</th>
                      <th>{strings.get('App.users.role')}</th>
                      <th>{strings.get('App.users.registered')}</th>
                      <th>{strings.get('App.users.reason')}</th>
                  </tr>
              </thead>
              <tbody>
                  { items }
              </tbody>
          </table>
        </span>
        );
    }
}

BlockedUserList.propTypes = {
    items: React.PropTypes.array.isRequired,
    fetchItems: React.PropTypes.func.isRequired,
    setCurrentItemId: React.PropTypes.func.isRequired,
    unsetCurrentItemId: React.PropTypes.func.isRequired,
    deleteItem: React.PropTypes.func.isRequired,
    unBlockItem: React.PropTypes.func.isRequired
}

export default BlockedUserList;