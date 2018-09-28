import React, {Component} from 'react';
import autoBind from 'react-autobind';
import config from '../../../config';
import strings from '../../../services/strings';

import Switch from '../../Switch';
import './LanguageForm.scss'

class LanguageForm extends Component {
    state = {
        name : "",
        iso2 : "",
        status: false,
    };

    handleInputChange(e) {
        let obj = {};
        obj[e.target.name] = e.target.value;
        this.setState(obj);
    }

    handleSwitchChange(status) {
        this.setState({status});
    }

    constructor(props) {
        super(props);
        autoBind(this);
    }

    render() {
        return (
            <div className="language-content">
                <label htmlFor="name">{strings.get('App.settings.addLanguage.name')}</label>
                <input className="form-control language-input" id="name" type="text" name="name" onChange={ this.handleInputChange }/>
                <label htmlFor="iso2">Iso2</label>
                <input className="form-control language-input" id="iso2" type="text" name="iso2" onChange={ this.handleInputChange }/>
                <Switch
                    enabled={ this.state.status }
                    onChange={ (enabled) => this.handleSwitchChange(enabled) }
                /><br/>
                <button className="btn btn-primary language-submit" onClick={ ()=>{this.props.handleSubmit(this.state);} }>{strings.get('App.settings.addLanguage.submit')}</button>
            </div>
        );
    }
}

export default LanguageForm;