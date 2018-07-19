angular.module('phoneApplication')
  .service('tokenService', ['$http', function ($http) {

    this.fetch = function (user) {

      return new Promise(function (resolve, reject) {

        $http.post('/api/phone/token', null)
          .then(function onSuccess(response) {
            resolve(response.data.token);
          }).catch(function onError(response) {
            reject(response.status);
          });

      });

    };

  }]);
