import React, {Component} from 'react';
import autoBind from 'react-autobind';
import {connect} from 'react-redux';
import strings from '../services/strings';
import language from '../services/language';
import {Link} from 'react-router';

import * as categoriesActions from '../store/categories/actions';
import * as documentsActions from '../store/documents/actions';
import * as glossariesActions from '../store/glossaries/actions';
import * as genderStringsActions from '../store/genderStrings/actions';
import * as stepsActions from '../store/steps/actions';
import * as settingsActions from '../store/settings/actions';
import * as articleCategoriesActions from '../store/articleCategories/actions';
import * as articlesActions from '../store/articles/actions';

import * as languagesActions from '../store/languages/actions';
import * as languagesSelectors from '../store/languages/selectors';
import _ from 'lodash';

import ReactFlagsSelect from 'react-flags-select';
import 'react-flags-select/scss/react-flags-select.scss';
import './LanguageSelector.scss';

class LanguageSelector extends Component {

    state = {
        language: {id: language.get(), iso2: language.getIso2()},
        languagesLoaded: false,
    };

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillMount() {
        this.props.fetchAllLanguages();
    }

    componentDidUpdate() {
        this.tryLoadCurrentItem();
    }

    handleChange(e) {
        let lang = this.state.languages[e];
        language.set({id: lang.id, iso2: lang.iso2});
        strings.setLanguage(e).then(() => {
            this.props.handleLangChange();
        });

        this.props.fetchCategories(true);
        this.props.fetchArticleCategories();
        this.props.fetchDocuments(true);
        this.props.fetchArticles();
        this.props.fetchGlossaries(true);
        this.props.fetchGenderStrings(true);
        this.props.fetchSteps(true);
        this.props.fetchAllSettings(true);

        let obj = _.extend({}, this.state);
        obj.language = {id: lang.id, iso2: lang.iso2};
        this.setState(obj);
    }

    tryLoadCurrentItem() {
        if (!this.state.languagesLoaded && _.size(this.props.languages)) {
            let languages = {};
            _.map(this.props.languages, (item) => {
                languages[item.iso2] = item;
            });
            this.setState({languages: languages, languagesLoaded: true}, () => {
                strings.setLanguage(language.getIso2()).then(() => {
                    this.props.handleLangChange();
                });
            });
        }
    }

    render() {
        let obj = {};
        let flags = [];
        _.map(this.state.languages, (lang) => {
            obj[lang.iso2] = strings.get(`Languages.${lang.iso2}`);
            flags.push(lang.iso2);
        });
        let defaultLang = this.state.language ? this.state.language.iso2 : null;
        if (flags.length && defaultLang && _.size(obj)) {
            return (
                <span className="LanguageSelector">
                    <div className="form-group">
                        <ReactFlagsSelect
                            className="form-control"
                            countries={flags}
                            defaultCountry={defaultLang}
                            customLabels={ obj }
                            onSelect={this.handleChange}
                        />
                    </div>
                </span>
            );
        } else {
            return (
                <span className="LanguageSelector">
                    <div className="form-group">
                    </div>
                </span>
            );
        }
    }

}

function mapStateToProps(state) {
    return {
        languages: languagesSelectors.getItems(state),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchAllLanguages: () => {
            dispatch(languagesActions.fetchAllItems())
        },
        fetchCategories: (deleteCache) => {
            dispatch(categoriesActions.fetchItems(deleteCache))
        },
        fetchDocuments: (deleteCache) => {
            dispatch(documentsActions.fetchItems(deleteCache))
        },
        fetchGlossaries: (deleteCache) => {
            dispatch(glossariesActions.fetchItems(deleteCache))
        },
        fetchGenderStrings: (deleteCache) => {
            dispatch(genderStringsActions.fetchItems(deleteCache))
        },
        fetchSteps: (deleteCache) => {
            dispatch(stepsActions.fetchAllItems())
        },
        fetchAllSettings: () => {
            dispatch(settingsActions.fetchAllItems())
        },
        fetchArticleCategories: (deleteCache) => {
            dispatch(articleCategoriesActions.fetchItems(deleteCache))
        },
        fetchArticles: (deleteCache) => {
            dispatch(articlesActions.fetchItems(deleteCache))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LanguageSelector);