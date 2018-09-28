import React, {Component} from 'react';
import autoBind from 'react-autobind';
import strings from '../../services/strings';
import {browserHistory} from 'react-router';
import moment from 'moment';
import _ from 'lodash';
import './UserList.scss';

import Modal from 'boron/DropModal';

class UserList extends Component {

    state = {
        "reason" : ""
    };

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
        browserHistory.push(`/users/${id}`)
    }

    showDeleteModal() {
        this.refs.deleteModal.show();
    }

    hideDeleteModal() {
        this.refs.deleteModal.hide();
    }

    showBlockModal() {
        this.refs.blockModal.show();
    }

    hideBlockModal() {
        this.setState({"reason": ""});
        this.refs.blockModal.hide();
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
        this.setState({"reason" : e.target.value});
    }

    render() {
        let items = _.map(this.props.items, (item) => {
            return (
                <tr key={ item.id }>
                    <td style={{ cursor: 'pointer' }}  onClick={() => this.handleEditClick(item.id)}>
                        { this.getLogo(item) }
                    </td>
                    <td style={{ cursor: 'pointer' }}  onClick={() => this.handleEditClick(item.id)}>
                        <div className="details">
                            <div className="name">{ item.first_name + ' ' + item.last_name }</div>
                        </div>
                    </td>
                    <td>{ _.size(item.downloads) }</td>
                    <td>{ this.getRole(item) }</td>
                    <td>{ this.getRegisterDate(item) }</td>
                    <td>
                        <i onClick={() => this.handleEditClick(item.id)}
                           className="btn btn-default edit-btn ion-edit" />
                        <i onClick={() => this.handleDeleteClick(item.id)}
                           className="btn btn-default delete-btn ion-trash-b" />
                        <i onClick={() => this.handleBlockClick(item.id)}
                           className="btn btn-default block-btn ion-locked" />
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
        let blockModalContent = this.props.currentItem ? (
            <span>
              <h2>{ strings.get('App.blockModal.message', {itemName: `${this.props.currentItem.first_name} ${this.props.currentItem.last_name}`}) }</h2>
              <div className="form-actions">
                  <label htmlFor="reason">Reason</label>
                  <textarea id="reason" className="form-control" type="text" name="reason" onChange={ this.handleInputChange }></textarea><br/>
                  <button className="btn btn-lg btn-danger"
                          onClick={ this.handleConfirmBlockClick }>{ strings.get('App.blockModal.block') }</button>
                  <button className="btn btn-lg btn-default"
                          onClick={ this.handleCancelBlockClick }>{ strings.get('App.blockModal.cancel') }</button>
              </div>
          </span>
        ) : null;
        return (
            <span className="UserList">
          <Modal className="boron-modal" ref="deleteModal">
              { deleteModalContent }
          </Modal>
            <Modal className="boron-modal" ref="blockModal">
                { blockModalContent }
            </Modal>
          <table className="table">
              <thead>
                  <tr>
                      <th/>
                      <th/>
                      <th>{strings.get('App.users.downloads')}</th>
                      <th>{strings.get('App.users.role')}</th>
                      <th>{strings.get('App.users.registered')}</th>
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

UserList.propTypes = {
    items: React.PropTypes.array.isRequired,
    fetchItems: React.PropTypes.func.isRequired,
    setCurrentItemId: React.PropTypes.func.isRequired,
    unsetCurrentItemId: React.PropTypes.func.isRequired,
    deleteItem: React.PropTypes.func.isRequired,
    blockItem: React.PropTypes.func.isRequired
}

export default UserList;