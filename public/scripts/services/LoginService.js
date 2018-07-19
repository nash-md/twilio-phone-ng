angular.module('phoneApplication')
  .service('loginService', ['$http', function ($http) {

    this.login = function (user) {

      return new Promise(function (resolve, reject) {

        $http.post('https://phone-upgrade.herokuapp.com/api/login', JSON.stringify({ user: user }))
          .then(function onSuccess(response) {
            resolve();
          }).catch(function onError(response) {
            console.log(response); // @todo, switch status
            reject();
          });

      });

    };

  }]);
