import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import strings from '../../services/strings';

import '../Page.scss';
import Topbar from "../../components/Topbar";
import PartnerForm from "../../components/partner/PartnerForm";

import * as partnersActions from '../../store/partners/actions';
import * as partnersSelectors from '../../store/partners/selectors';

class PartnersAddPage extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillUnmount() {
        this.props.clearExceptions();
    }

    savePartner(data) {
        if (data.file) {
            this.props.createPartnerWithLogo(data.form, data.file);
        } else {
            this.props.createPartner(data.form);
        }
    }

    render() {
        return (
            <div className="PartnersAddPage">
                <Topbar currentLanguage={this.props.currentLanguage} handleLangChange={ this.props.handleLangChange } >
                    <div className="title">
                        <Link to="/partners">{strings.get('App.partnerPages.add.title')}</Link>
                        <span className="hidden-xs">
                            <span className="divider">/</span>
                            <Link to="/partners/add">{strings.get('App.partnerPages.add.add')}</Link>
                        </span>
                    </div>
                </Topbar>

                <div className="content">
                    <PartnerForm
                        exceptions = {this.props.exceptions}
                        saveItem={ this.savePartner }
                    />
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {

    }
}

function mapDispatchToProps(dispatch) {
    return {
        createPartner: (data) => {
            dispatch(partnersActions.createItem(data))
        },
        createPartnerWithLogo: (data, file) => {
            dispatch(partnersActions.createItemWithLogo(data, file))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PartnersAddPage);