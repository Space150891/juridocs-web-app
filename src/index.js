import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, Redirect, browserHistory } from 'react-router';
import thunk from 'redux-thunk';

import App from './App';
import LoginPage from './containers/auth/LoginPage';

import DocumentListPage from './containers/documents/DocumentListPage';
import DocumentAddPage from './containers/documents/DocumentAddPage';
import DocumentEditPage from './containers/documents/DocumentEditPage';

import GlossaryListPage from './containers/glossaries/GlossaryListPage';
import GlossaryAddPage from './containers/glossaries/GlossaryAddPage';
import GlossaryEditPage from './containers/glossaries/GlossaryEditPage';

import StepListPage from './containers/steps/StepListPage';
import StepAddPage from './containers/steps/StepAddPage';
import StepEditPage from './containers/steps/StepEditPage';

import CategoryListPage from './containers/categories/CategoryListPage';
import CategoryAddPage from './containers/categories/CategoryAddPage';
import CategoryEditPage from './containers/categories/CategoryEditPage';

import CompanyCategoryListPage from './containers/companyCategories/CompanyCategoryListPage';
import CompanyCategoryAddPage from './containers/companyCategories/CompanyCategoryAddPage';
import CompanyCategoryEditPage from './containers/companyCategories/CompanyCategoryEditPage';

import CompanyListPage from './containers/companies/CompanyListPage';
import CompanyAddPage from './containers/companies/CompanyAddPage';
import CompanyEditPage from './containers/companies/CompanyEditPage';

import GenderStringListPage from './containers/grammar/genderStrings/GenderStringListPage';
import GenderStringAddPage from './containers/grammar/genderStrings/GenderStringAddPage';
import GenderStringEditPage from './containers/grammar/genderStrings/GenderStringEditPage';

import GroupListPage from './containers/groups/GroupListPage';
import GroupAddPage from './containers/groups/GroupAddPage';
import GroupEditPage from './containers/groups/GroupEditPage';

import LanguageEditPage from './containers/settings/languages/LanguageEditPage';
import LanguageAddPage from './containers/settings/languages/LanguageAddPage';
import LanguageListPage from './containers/settings/languages/LanguageListPage';
import EmailPage from './containers/settings/email/EmailPage';
import ShareEmailPage from './containers/settings/email/ShareEmailPage';
import SearchPlaceholderPage from './containers/settings/placeholder/SearchPlaceholderPage';

import UserListPage from './containers/users/UserListPage';
import UserEditPage from './containers/users/UserEditPage';
import UserAddPage from './containers/users/UserAddPage';

import BlockedUsersEditPage from './containers/blockedUsers/BlockedUsersEditPage';
import BlockedUsersListPage from './containers/blockedUsers/BlockedUsersListPage';

import BlockedGroupsListPage from './containers/blockedGroups/BlockedGroupsListPage';
import BlockedGroupsEditPage from './containers/blockedGroups/BlockedGroupsEditPage';

import PartnersListPage from './containers/partners/PartnersListPage';
import PartnersEditPage from './containers/partners/PartnersEditPage';
import PartnersAddPage from './containers/partners/PartnersAddPage';

import ArticlesListPage from './containers/articles/ArticlesListPage';
import ArticlesEditPage from './containers/articles/ArticlesEditPage';
import ArticlesAddPage from './containers/articles/ArticlesAddPage';

import ArticleCategoriesListPage from './containers/articleCategories/ArticleCategoriesListPage';
import ArticleCategoriesEditPage from './containers/articleCategories/ArticleCategoriesEditPage';
import ArticleCategoriesAddPage from './containers/articleCategories/ArticleCategoriesAddPage';

import cacheManager from 'services/cacheManager';

import * as reducers from './store/reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
    combineReducers(reducers), 
    composeEnhancers(applyMiddleware(thunk))
);

cacheManager.setVersion("0.0.2");

ReactDOM.render(
    <Provider store={ store }>

        <Router history={ browserHistory }>
            <Route path='login' component={ LoginPage } />
            <Route component={ App }>

                <Route path='documents' component={ DocumentListPage } />
                <Route path='documents/add' component={ DocumentAddPage } />
                <Route path='documents/:id' component={ DocumentEditPage } />

                <Route path='glossaries/steps' component={ StepListPage } />
                <Route path='glossaries/steps/add' component={ StepAddPage } />
                <Route path='glossaries/steps/:id' component={ StepEditPage } />

                <Route path='glossaries' component={ GlossaryListPage } />
                <Route path='glossaries/add' component={ GlossaryAddPage } />
                <Route path='glossaries/:id' component={ GlossaryEditPage } />

                <Route path='categories' component={ CategoryListPage } />
                <Route path='categories/add' component={ CategoryAddPage } />
                <Route path='categories/:id' component={ CategoryEditPage } />

                <Route path='companies/categories' component={ CompanyCategoryListPage } />
                <Route path='companies/categories/add' component={ CompanyCategoryAddPage } />
                <Route path='companies/categories/:id' component={ CompanyCategoryEditPage } />

                <Route path='companies' component={ CompanyListPage } />
                <Route path='companies/add' component={ CompanyAddPage } />
                <Route path='companies/:id' component={ CompanyEditPage } />

                <Route path='grammar'>
                    <Route path='gender-strings' component={ GenderStringListPage } />
                    <Route path='gender-strings/add' component={ GenderStringAddPage } />
                    <Route path='gender-strings/:id' component={ GenderStringEditPage } />
                </Route>

                <Route path='users/groups/blockedGroups' component={ BlockedGroupsListPage } />
                <Route path='users/groups/blockedGroups/:id' component={ BlockedGroupsEditPage } />

                <Route path='users/groups' component={ GroupListPage } />
                <Route path='users/groups/add' component={ GroupAddPage } />
                <Route path='users/groups/:id' component={ GroupEditPage } />

                <Route path='partners' component={ PartnersListPage } />
                <Route path='partners/add' component={ PartnersAddPage } />
                <Route path='partners/:id' component={ PartnersEditPage } />

                <Route path='articleCategories' component={ ArticleCategoriesListPage } />
                <Route path='articleCategories/add' component={ ArticleCategoriesAddPage } />
                <Route path='articleCategories/:id' component={ ArticleCategoriesEditPage } />

                <Route path='articles' component={ ArticlesListPage } />
                <Route path='articles/add' component={ ArticlesAddPage } />
                <Route path='articles/:id' component={ ArticlesEditPage } />

               <Route path='settings'>
                    <Route path='languages/add' component={ LanguageAddPage } />
                    <Route path='languages/:id' component={ LanguageEditPage } />
                    <Route path='languages' component={ LanguageListPage } />
                    <Route path='email' component={ EmailPage } />
                    <Route path='shareEmail' component={ ShareEmailPage } />
                    <Route path='searchPlaceholder' component={ SearchPlaceholderPage } />
                </Route>

                <Route path='users/blockedUsers' component={ BlockedUsersListPage } />
                <Route path='users/blockedUsers/:id' component={ BlockedUsersEditPage } />

                <Route path='users' component={ UserListPage } />
                <Route path='users/add' component={ UserAddPage } />
                <Route path='users/:id' component={ UserEditPage } />


            </Route>
            <Redirect from='*' to='/documents'></Redirect>
        </Router>

    </Provider>,
    document.getElementById('root')
);
