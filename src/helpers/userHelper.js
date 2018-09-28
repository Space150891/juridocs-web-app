import strings from '../services/strings';


export default class UserHelper {

  static getUserRoleByData(userData) {
    if(userData) {
      if (_.find(userData.scopes, (scope) => {
              return scope.name == 'admin';
          })) {
          return strings.get('App.users.scopes.admin');
      }
      return strings.get('App.users.scopes.user');
    }
    return '';
  }

}