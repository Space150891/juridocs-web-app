import React, { Component } from 'react';
import autoBind from 'react-autobind';
import strings from '../services/strings';
import _ from 'lodash';

class SorterArrow extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    handleClick() {
        this.props.toggleSorter(this.props.column);
        this.props.fetchItems();
    }

    render() {
        let arrows = [];
        if (this.props.column == this.props.sorter.column) {
            if (this.props.sorter.ascending) {
                arrows.push(<i key="arrow-up" className="icon-uc-arrow-up selected"></i>);
                arrows.push(<i key="arrow-down" className="icon-uc-arrow-down"></i>);
            } else {
                arrows.push(<i key="arrow-up" className="icon-uc-arrow-up"></i>);
                arrows.push(<i key="arrow-down" className="icon-uc-arrow-down selected"></i>);
            }
        } else {
            arrows.push(<i key="arrow-up" className="icon-uc-arrow-up"></i>);
            arrows.push(<i key="arrow-down" className="icon-uc-arrow-down"></i>);
        }

        return (
            <span className="order-btns" onClick={ this.handleClick }>
                { arrows }
            </span>
        )
    }
}

SorterArrow.propTypes = {
    sorter: React.PropTypes.object.isRequired,
    column: React.PropTypes.string.isRequired,
    fetchItems: React.PropTypes.func.isRequired,
    toggleSorter: React.PropTypes.func.isRequired
}

export default SorterArrow;