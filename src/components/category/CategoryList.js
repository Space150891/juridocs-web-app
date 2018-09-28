import React, { Component } from 'react';
import autoBind from 'react-autobind';
import strings from '../../services/strings';
import { browserHistory } from 'react-router';
import _ from 'lodash';
import './CategoryList.scss';

import Modal from 'boron/DropModal';

class CategoryList extends Component {

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
            <div className="item-logo default-logo ion-android-list"></div>
        );
    }

    getVisibilityIcon(item) {
        if (item.visibility == 0) {
            return <i className="visibility-icon ion-locked"></i>;
        }
        else if (item.visibility == 1) {
            return <i className="visibility-icon ion-earth"></i>;
        }
        else if (item.visibility == 2) {
            return <i className="visibility-icon ion-android-people"></i>;
        }
        else if (item.visibility == 3) {
            return <i className="visibility-icon ion-android-settings"></i>;
        }
    }

    getVisibilityLabel(item) {
        if (item.visibility == 0) {
            return strings.get('App.categoryForm.visibility.hidden');
        }
        else if (item.visibility == 1) {
            return strings.get('App.categoryForm.visibility.public');
        }
        else if (item.visibility == 2) {
            return strings.get('App.categoryForm.visibility.loggedIn');
        }
        else if (item.visibility == 3) {
            return strings.get('App.categoryForm.visibility.custom');
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
        browserHistory.push(`/categories/${id}`);
    }

    getCategoryTree(items, item, arr, depth = 0) {
        if(_.size(items) && _.find(items, item)) {
            if(item.parent_id && depth === 0)
                return;
            arr[0].push(item);
            arr[1].push(depth);
            _.map(items, (it) => {
                if (item.id === it.parent_id) {
                    this.getCategoryTree(items, it, arr, depth+1);
                }
            });
        }
    }

    render() {
        let arr = [[],[]];
        _.map(this.props.items.concat(this.props.subCategories), (item) => {
            this.getCategoryTree(this.props.items.concat(this.props.subCategories), item, arr);
        });

        let items = _.map(arr[0], (item, i) => {
            let style = {
                'marginLeft' : `${arr[1][i] * 2.5}rem`,
            };
            return (
                <tr key={ item.id }>
                    <td>
                        <span style={style}>{arr[1][i] ? "|"+"_": null}</span>
                        <div className="curs-pointer" onClick={() => this.handleEditClick(item.id)}>
                            { this.getLogo(item) }
                        </div>
                    </td>
                    <td>
                        <div onClick={() => this.handleEditClick(item.id)} className="details curs-pointer">
                            <div className="name">{ item.name }</div>
                            <div className="description">
                                { this.getVisibilityIcon(item) }
                                { this.getVisibilityLabel(item) }
                            </div>
                        </div>
                    </td>
                    <td><i onClick={() => this.handleDeleteClick(item.id)} className="btn btn-default delete-btn ion-trash-b"></i></td>
                    <td><i onClick={() => this.handleEditClick(item.id)} className="btn btn-default edit-btn ion-edit"></i></td>
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
            <span className="CategoryList">
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

CategoryList.propTypes = {
    items: React.PropTypes.array.isRequired,
    fetchItems: React.PropTypes.func.isRequired,
    setCurrentItemId: React.PropTypes.func.isRequired,
    unsetCurrentItemId: React.PropTypes.func.isRequired,
    deleteItem: React.PropTypes.func.isRequired,
}

export default CategoryList;