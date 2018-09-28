import React, { Component } from 'react';
import autoBind from 'react-autobind';
import strings from '../../services/strings';
import { browserHistory } from 'react-router';
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';
import _ from 'lodash';
import './StepList.scss';

import Modal from 'boron/DropModal';

let componentInstance = null;

const SortableDragger = SortableHandle(() => {
    return ( 
        <div className="item-logo default-logo ion-checkmark"></div>
    );
});

const SortableItem = SortableElement(({ value }) => {
    return (
        <tr>
            <td>
                <SortableDragger />
            </td>
            <td>
                <div className="details">
                    <div className="name">{ value.name }</div>
                </div>
            </td>
            <td><i onClick={() => componentInstance.handleEditClick(value.id)} className="btn btn-default edit-btn ion-edit"></i></td>
            <td><i onClick={() => componentInstance.handleDeleteClick(value.id)} className="btn btn-default delete-btn ion-trash-b"></i></td>
        </tr>
    );
});

const SortableList = SortableContainer(({items}) => {
    let rows = _.map(items, (value, index) => {
        return (
            <SortableItem key={`item-${index}`} index={ index } value={ value } />
        );
    });


    return (
        <tbody>
            { rows }
        </tbody>
    );
});

class StepList extends Component {

    state = {
        items: [],
    };

    componentDidMount() {
        this.tryLoadSteps();
    }

    componentDidUpdate() {
        this.tryLoadSteps();
    }

    constructor(props) {
        super(props);
        autoBind(this);
        componentInstance = this;
    }

    tryLoadSteps() {
        let reload = false;

        // Reload items if size is different
        if (_.size(this.props.items) != _.size(this.state.items)) {
            reload = true;
        }

        // Reload items if any step is different
        if (!reload) {
            _.each(this.props.items, (item) => {
                if (!_.find(this.state.items, {'name': item.name})) {
                    reload = true;
                }
            });
        }

        if (reload) {
            let items = [];
            _.each(this.props.items, (item) => {
                items.push(item);
            });
            this.setState({
                items: items,
            });
        }
    }

    showDeleteModal() {
        this.refs.deleteModal.show();
    }
      
    hideDeleteModal() {
        this.refs.deleteModal.hide();
    }

    handleSortEnd({ oldIndex, newIndex }) {
        let items = arrayMove(this.state.items, oldIndex, newIndex);
        this.props.orderItems(items);
        this.setState({ items });
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
        browserHistory.push(`/glossaries/steps/${id}`);
    }

    buildLabel(Items, item) {
        let data = [];
        let _glossaries = this.props.glossaries;
        Items.forEach(function(Item){
            let _label = Item.name;
        // separate out all selectors and loop through
        let result = strings.getFromBetween.get(_label, "[[", "]]");
        result.forEach((e) => {
          const reg = new RegExp(e);
          // if there's a translation - use it
          const _value = localStorage[e + '_translation'] || localStorage[e];
          if (_value !== '' && !!_value) {
            _label = _label.replace(reg, _value).replace(/\[\[|\]\]/g, '');
          } else {
            // work out pattern [[*.*_*]] for selects
            if (e.indexOf('.') > -1) {
              const field = e.split('.')[0];
              const values = e.split('.')[1].split('_');
              const selected = localStorage[field];
              if (!!selected) {
                const _keys = ['field', 'selector', 'if'];
                _keys.forEach((e) => {
                  if (this.paths[e] && this.paths[e][field]) {
                    const path = this.paths[e][field];
                    const rule = path[Object.keys(path)[0]].node;
    
                    let i = 0;
                    for (var item in rule.options) {
                      if (item === selected)
                        break;
                      i++;
                    }
                    _label = _label.replace(reg, values[i]).replace(/\[\[|\]\]/g, '');
                  }
                })
              }
            } else {
                // if there's no placeholder there, grab all glossaries
                // then concat everything and loop through to find what we're looking for
                let _value = _.map(_glossaries, (element) => {
                  return JSON.parse(element.value);
                });
                if (_value !== []) {
                  let _merged = [];
                  _value.forEach((element) => {
                    _merged = _merged.concat(element['fields'], element['clauses'], element['selectors']);
                  });
                  let replacement = _.find(_merged, (element) => {
                    return element.name === e
                  });
                  if (!!replacement) {
                    _label = _label.replace(reg, replacement.placeholderField).replace(/\[\[|\]\]/g, '');
                  }
                }
              
            }
          }
        })
        data.push({
            id : Item.id,
            name: _label,
        });
    });
        return data;
    }

    render() {
        let deleteModalContent = this.props.currentItem ? (
            <span>
                <h2>{ strings.get('App.deleteModal.message', {itemName: this.props.currentItem.name}) }</h2>
                <p>{strings.get('App.steps.unavailableFields')}</p>
                <div className="form-actions">
                    <button className="btn btn-lg btn-danger" onClick={ this.handleConfirmDeleteClick }>{ strings.get('App.deleteModal.delete') }</button>
                    <button className="btn btn-lg btn-default" onClick={ this.handleCancelDeleteClick }>{ strings.get('App.deleteModal.cancel') }</button>
                </div>
            </span>
        ) : null;

        return (
            <span className="StepList">
                <Modal className="boron-modal" ref="deleteModal">
                    { deleteModalContent }
                </Modal>
                <table className="table">
                    <SortableList 
                        items={ this.buildLabel(this.state.items) } 
                        onSortEnd={ this.handleSortEnd }
                        lockAxis="y"
                        useDragHandle={ true }
                        lockToContainerEdges={ true }
                        helperClass="SortableItem"
                    />
                </table>
            </span>
        );
    }
}

StepList.propTypes = {
    items: React.PropTypes.object.isRequired,
    fetchItems: React.PropTypes.func.isRequired,
    orderItems: React.PropTypes.func.isRequired,
    setCurrentItemId: React.PropTypes.func.isRequired,
    unsetCurrentItemId: React.PropTypes.func.isRequired,
    deleteItem: React.PropTypes.func.isRequired,
}

export default StepList;