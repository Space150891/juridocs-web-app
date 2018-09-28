import React, { Component } from 'react';
import autoBind from 'react-autobind';
import strings from '../services/strings';
import { Link } from 'react-router';

import './Sidebar.scss';

class Sidebar extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    getLinkClassName(linkName) {
        let path = location.pathname.split('/');
        return (path[1] == linkName) ? 'active' : '';
    }

    handleItemClick() {
        this.props.toggleSidebar();
    }

    handleLogoutClick() {
        this.props.logout();
    }

    render() {
        return (
            <span>
                <div className="title">
                    <h1>Juridocs</h1>
                </div>
                <ul className="nav nav-sidebar">
                    <li className={ this.getLinkClassName('documents') } onClick={ this.handleItemClick }>
                        <Link to="/documents" href="#">{strings.get('Sidebar.documents')}</Link>
                    </li>
                    <li className={ this.getLinkClassName('glossaries') } onClick={ this.handleItemClick }>
                        <Link to="/glossaries" href="#">{strings.get('Sidebar.glossaries')}</Link>
                    </li>
                    <li className={ this.getLinkClassName('categories') } onClick={ this.handleItemClick }>
                        <Link to="/categories" href="#">{strings.get('Sidebar.categories')}</Link>
                    </li>
                    <li className={ this.getLinkClassName('companies') } onClick={ this.handleItemClick }>
                        <Link to="/companies" href="#">{strings.get('Sidebar.companies')}</Link>
                    </li>
                    <li className={ this.getLinkClassName('users') } onClick={ this.handleItemClick }>
                        <Link to="/users" href="#">{strings.get('Sidebar.users')}</Link>
                    </li>
                    <li className={ this.getLinkClassName('partners') } onClick={ this.handleItemClick }>
                        <Link to="/partners" href="#">{strings.get('Sidebar.partners')}</Link>
                    </li>
                    <li className={ this.getLinkClassName('articles') } onClick={ this.handleItemClick }>
                        <Link to="/articleCategories" href="#">{strings.get('Sidebar.articles')}</Link>
                    </li>
                    <li className={ this.getLinkClassName('settings') } onClick={ this.handleItemClick }>
                        <Link to="/settings/languages" href="#">{strings.get('Sidebar.settings')}</Link>
                    </li>
                    <li className="logout" onClick={ this.handleItemClick }>
                        <a href="#" onClick={ this.handleLogoutClick }>{strings.get('Sidebar.logout')}</a>
                    </li>
                </ul>
            </span>
        );
    }

}

Sidebar.propTypes = {
    toggleSidebar: React.PropTypes.func.isRequired,
}

export default Sidebar;