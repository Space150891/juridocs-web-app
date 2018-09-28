import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import strings from '../../services/strings';
import Topbar from "../../components/Topbar";
import PartnerForm from "../../components/partner/PartnerForm";

import '../Page.scss';

import * as partnersActions from '../../store/partners/actions';
import * as partnersSelectors from '../../store/partners/selectors';

class PartnersEditPage extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillMount() {
        this.props.fetchPartner(this.props.params.id);
        this.props.setCurrentPartnerId(this.props.params.id);
    }

    componentWillUnmount() {
        this.props.unsetCurrentPartnerId();
        this.props.clearExceptions();
    }

    savePartner(data) {
        this.props.updatePartner(this.props.params.id, data.form);
        if (data.file) {
            this.props.uploadPartnerLogo(this.props.params.id, data.file);
        }
    }

    render() {
        return (
            <div className="PartnersEditPage">
                <Topbar currentLanguage={this.props.currentLanguage} handleLangChange={this.props.handleLangChange}>
                    <div className="title">
                        <Link to="/partners">{strings.get('App.partnerPages.edit.title')}</Link>
                        <span className="xs-hidden">
                            <span className="divider">/</span>
                            <Link to={`/partners/${this.props.params.id}`}>{strings.get('App.partnerPages.edit.edit')}</Link>
                        </span>
                    </div>
                </Topbar>

                <div className="content">
                    <PartnerForm
                        exceptions={ this.props.exceptions }
                        partners={ this.props.partners }
                        currentItem={ this.props.currentPartner }
                        saveItem={ this.savePartner }
                    />
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        currentPartner: partnersSelectors.getCurrentItem(state),
        partners: partnersSelectors.getItems(state),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchAllPartners: (deleteCache) => {
            dispatch(partnersActions.fetchAllItems(deleteCache))
        },
        fetchPartner: (id) => {
            dispatch(partnersActions.fetchItem(id))
        },
        setCurrentPartnerId: (id) => {
            dispatch(partnersActions.setCurrentItemId(id))
        },
        unsetCurrentPartnerId: () => {
            dispatch(partnersActions.unsetCurrentItemId())
        },
        updatePartner: (id, data) => {
            dispatch(partnersActions.updateItem(id, data))
        },
        uploadPartnerLogo: (id, file) => {
            dispatch(partnersActions.uploadItemLogo(id, file))
        },
        createPartner: (data) => {
            dispatch(partnersActions.createItem(data))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PartnersEditPage);