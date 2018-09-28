import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { SortableHandle } from 'react-sortable-hoc';
import './ActiveLabel.scss'

const SortableDragger = SortableHandle(() => {
    return ( 
        <i className="label-drag ion-android-more-vertical" />
    );
});

class ActiveLabel extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    handleItemClick() {
        if (this.props.onClick) {
            this.props.onClick(this.props.value);
        }
    }

    handleRemoveClick(e) {
        e.stopPropagation();
        this.props.onRemove(this.props.value);
    }

    render() {

        let labelClass = this.props.clickable ? 'label-content clickable' : 'label-content';

        let dragger = this.props.draggable ? ( <SortableDragger /> ) : null;

        return (
            <div className="ActiveLabel" onClick={ this.handleItemClick }>
                <div className={ labelClass }>
                    { dragger }
                    <span>{ this.props.name }</span>
                    <i className="label-close ion-close" onClick={ this.handleRemoveClick } />
                </div>
            </div>
        );
    }
}

ActiveLabel.propTypes = {
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.any,
    clickable: React.PropTypes.bool,
    draggable: React.PropTypes.bool,
    onRemove: React.PropTypes.func.isRequired,
    onClick: React.PropTypes.func,
};

export default ActiveLabel;