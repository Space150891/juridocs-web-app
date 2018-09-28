import React, { Component } from 'react';
import autoBind from 'react-autobind';
import strings from '../services/strings';

import './SearchBar.scss';

class SearchBar extends Component {

    state = {
        searchTerm: '',
    }

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentDidMount() {
        this.setState({ searchTerm: this.props.searchTerm });
    }

    handleSubmit(e) {
        e.preventDefault();
    }

    handleChange(e) {
        let searchTerm = e.target.value;
        this.setState({
            searchTerm: searchTerm
        })

        // optimize API Requests
        setTimeout(() => {
            if (searchTerm == this.state.searchTerm) {
                this.props.setSearchTerm(searchTerm);
                this.props.fetchItems(true);
            }
        }, 500)
    }

    render() {
        return (
            <div className="navbar-search SearchBar">
                <form className="search" onSubmit={ this.handleSubmit }>
                    <fieldset>
                        <i className="ion-ios-search-strong"></i>
                        <input type="text" name="" placeholder={ this.props.placeholder } value={ this.state.searchTerm } onChange={ this.handleChange } />
                    </fieldset>
                </form>
            </div>
        );
    }

}

SearchBar.propTypes = {
    placeholder: React.PropTypes.string,
    searchTerm: React.PropTypes.string.isRequired,
    fetchItems: React.PropTypes.func.isRequired,
    setSearchTerm: React.PropTypes.func.isRequired,
}

export default SearchBar;