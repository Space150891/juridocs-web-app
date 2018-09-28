import api from './api';
import _ from 'lodash';
class StringsService {

	// Component where strings service instance has been initialised
	componentName;

	// Default language
	language  = {id : '2',iso2:'NL'};
	languages = {};

	// Strings map
	strings = new Map();

  async getJson(flag = false) {
		let data = await api.get('/strings');
        _.map(data, (value, key) => {
            this.languages[key] = value;
        });
        this.strings = new Map();
        let strings = this.languages[this.language] || this.languages[this.language.iso2];
        this.loadStrings(strings);
		if(flag)
            return this.languages;
	}

  constructor() {
		this.languages = {};
		this.getJson();
	}

	get(string, params = {}) {
		let value = this.strings.get(string);
		return this.replaceParams(value, params);
	}

	getLanguage() {
		return this.language;
	}

	async setLanguage(language) {
		this.language = language;
       	await this.getJson();
    }

	setComponentName(name) {
		this.componentName = name;
	}

	setComponent(component) {
		this.setComponentName(component.constructor.name);
	}

	loadStrings(strings, prefix = '') {
		for (let key in strings) {
			let nextPrefix = (prefix == '') ? key : prefix + '.' + key;

			if (typeof strings[key] == 'object') {
				this.loadStrings(strings[key], nextPrefix);
			} else {
				this.strings.set(nextPrefix, strings[key]);
			}
		}
	}

	replaceParams(string, params) {
		let result = string;
		for (let key in params) {
			result = result.replace('{' + key + '}', params[key]);
		}
		return result;
	}

	getFromBetween = {
		results:[],
		string:"",

		getFromBetween: function (sub1,sub2) {

			if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
			var SP = this.string.indexOf(sub1)+sub1.length;
			var string1 = this.string.substr(0,SP);
			var string2 = this.string.substr(SP);
			var TP = string1.length + string2.indexOf(sub2);
			return this.string.substring(SP,TP);
		},
		removeFromBetween: function(sub1,sub2) {
			if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
			var removal = sub1+this.getFromBetween(sub1,sub2)+sub2;
			this.string = this.string.replace(removal,"");
		},
		getAllResults: function(sub1,sub2) {
			// first check to see if we do have both substrings
			if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return;
	
			// find one result
			var result = this.getFromBetween(sub1,sub2);
			// push it to the results array
			this.results.push(result);
			// remove the most recently found one from the string
			this.removeFromBetween(sub1,sub2);
			// if there's more substrings
			if(this.string.indexOf(sub1) > -1 && this.string.indexOf(sub2) > -1) {
				this.getAllResults(sub1,sub2);
			}
			else return;
		},
		get: function(string,sub1,sub2) {
			this.results = [];
			this.string = string;
			this.getAllResults(sub1,sub2);
			return this.results;
		}
	};
}

export default new StringsService();