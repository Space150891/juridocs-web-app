import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import strings from '../../services/strings';
import Topbar from "../../components/Topbar";
import PartnerList from "../../components/partner/PartnerList";
import Pagination from "../../components/Pagination";

import '../Page.scss';

import * as partnersActions from '../../store/partners/actions';
import * as partnersSelectors from '../../store/partners/selectors';

class PartnersListPage extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillMount() {
        this.props.fetchPartners();
    }

    componentWillUnmount() {
        this.props.unsetCurrentPartnerId();
        this.props.clearExceptions();
    }

    render() {
        return (
            <div className="PartnerListPage">
                <Topbar currentLanguage={this.props.currentLanguage} handleLangChange={this.props.handleLangChange}>
                    <div className="title">
                        <Link to="/partners">{strings.get('Sidebar.partners')}</Link>
                    </div>
                    <div className="main-btns">
                        <Link to="/partners/add" className="btn btn-primary">{strings.get('App.partnerPages.listPage.addPartner')}</Link>
                    </div>
                </Topbar>

                <div className="content">
                    <PartnerList
                        items={ this.props.partners }
                        currentItem={ this.props.currentPartner }
                        fetchItems={ this.props.fetchPartners }
                        setCurrentItemId={ this.props.setCurrentPartnerId }
                        unsetCurrentItemId={ this.props.unsetCurrentPartnerId }
                        deleteItem={ this.props.deletePartner }
                    />

                    <Pagination
                        pagination={ this.props.pagination }
                        setCurrentPage={ this.props.setCurrentPage }
                        fetchItems={ this.props.fetchPartners }
                    />
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        partners: partnersSelectors.getItemsByPage(state, (partnersSelectors.getPagination(state)).currentPage),
        pagination: partnersSelectors.getPagination(state),
        currentPartner: partnersSelectors.getCurrentItem(state),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchPartners: (deleteCache) => {
            dispatch(partnersActions.fetchItems(deleteCache))
        },
        setCurrentPage: (page) => {
            dispatch(partnersActions.setCurrentPage(page))
        },
        setCurrentPartnerId: (id) => {
            dispatch(partnersActions.setCurrentItemId(id))
        },
        unsetCurrentPartnerId: () => {
            dispatch(partnersActions.unsetCurrentItemId())
        },
        deletePartner: (id) => {
            dispatch(partnersActions.deleteItem(id))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PartnersListPage);