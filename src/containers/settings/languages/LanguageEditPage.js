import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../../../services/strings';
import { Link, browserHistory } from 'react-router';
import _ from 'lodash';
import '../../Page.scss';

import * as languagesActions from '../../../store/languages/actions';
import * as languagesSelectors from '../../../store/languages/selectors';
import Modal from 'boron/DropModal';

import Topbar from '../../../components/Topbar';
import SubTopbar from '../../../components/SubTopbar';
import SettingsTabs from '../../../components/settings/SettingsTabs';

class LanguageEditPage extends Component {

    state = {
        items : {},
    };

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillMount() {
        this.props.setCurrentLanguageId(this.props.params.id);
        strings.getJson(true).then((items) => {
            this.setState({items});
        });
    }

    componentWillUnmount() {
        this.props.unsetCurrentLanguageId();
    }

    count = 0;

    setDescendantProp(obj, desc, value) {
        let arr = desc.split('.');
        while (arr.length > 1) {
            obj = obj[arr.shift()];
        }
        obj[arr[0]] = value;
    }

    handleInputChange(e) {
        let items = _.extend({},this.state.items);
        this.setDescendantProp(items[this.props.currentLanguage.iso2], e.target.name, e.target.value);
        this.setState({items});
    }

    handleSaveClick(e) {
        e.preventDefault();
        this.props.updateCurrentStrings(this.state.items[this.props.currentLanguage.iso2], this.props.currentLanguage.id);
        this.refs.saveModal.show();
        _.delay(() => {
            this.refs.saveModal.hide();
            _.delay(() => {
                browserHistory.push('/settings/languages');
            },650);
        },1350);
    }

    handleCancelClick(e) {
        e.preventDefault();
        browserHistory.push('/settings/languages');
    }

    handleCollapse(e) {
        e.preventDefault();
        e.target.nextSibling.style.display = "block";
        let className = e.target.className.split(' ');
        if(className.indexOf("collapsed") > -1){
            $(e.target.nextSibling).css("display","block");
            $(e.target).removeClass("collapsed");
        } else {
            $(e.target.nextSibling).css("display","none");
            $(e.target).addClass("collapsed");
        }
    }

    isObject(value, key, path = key) {
        let iso2 = this.props.currentLanguage ? this.props.currentLanguage.iso2 : '';
        let self = this;
        let name = key+'"]["';
        let propPath = path+".";
        if(typeof value === "object") {
            return _.map(value, (val,key) => {
                if(typeof val === "object") {
                    let tmpName = name + key;
                    let path = propPath + key;
                    self.count++;
                    return (
                        <li key={`item-${self.count}`}>
                            <span className="collapsible collapsed" onClick={this.handleCollapse}>{ key }</span>
                            <ul style={{display: "none"}}>
                                { this.isObject(val,tmpName, path) }
                            </ul>
                        </li>
                    );
                } else {
                    self.count++;
                    let tmpName = '["'+name+key+'"]';
                    let a = `self.state.items["${iso2}"]${tmpName}`;
                    tmpName = propPath+key;
                    return (
                        <li key={`item-${ self.count }`}>
                            <label htmlFor={`item-${ self.count }`}>{ key }</label>
                            <input
                                id={`item-${ self.count }`}
                                name={ tmpName }
                                value={ eval(a) }
                                style={{float: "right", width: "50%", border:"none", background: "transparent"}}
                                onChange={ this.handleInputChange }
                            />
                        </li>
                    );
                }
            });
        }
    }

    render() {
        let count = 0;
        let iso2 = this.props.currentLanguage ? this.props.currentLanguage.iso2 : '';
        let tree = _.map(this.state.items[iso2], (value, k) => {
            count++;
            return (
                <div key={`item-${count}`} >
                    <span className="collapsible collapsed" onClick={this.handleCollapse}>{k}</span>
                    <ul style={{display: "none"}}>
                        { this.isObject(value, k) }
                    </ul>
                </div>
            );
        });
        this.count = 0;
        return (
            <div className="LanguageAddPage">
                <Modal className="boron-modal no-body" ref="saveModal" onShow={ this.handleShowModal }>
                    <span>
                        <h2>{strings.get('App.settings.settingsSaved')}</h2>
                    </span>
                </Modal>
                <Topbar currentLanguage={this.props.currentLanguage} handleLangChange={this.props.handleLangChange}>
                    <div className="title">
                        <Link to="/settings/languages">{strings.get('App.settings.title')}</Link>
                    </div>
                </Topbar>
                <SubTopbar>
                    <SettingsTabs />
                </SubTopbar>
                <div className="content">
                    { tree }
                    <button style={{marginRight: ".4rem"}} className="btn btn-primary" onClick={ this.handleSaveClick }>{strings.get('App.settings.languages.save')}</button>
                    <button style={{marginLeft: ".4rem"}} className="btn btn-default" onClick={ this.handleCancelClick }>{strings.get('App.settings.languages.cancel')}</button>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        currentLanguage: languagesSelectors.getCurrentItem(state),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setCurrentLanguageId: (id) => {
            dispatch(languagesActions.setCurrentItemId(id))
        },
        unsetCurrentLanguageId: () => {
            dispatch(languagesActions.unsetCurrentItemId())
        },
        updateCurrentStrings: (data, id) => {
            dispatch(languagesActions.updateStrings(data, id))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LanguageEditPage);