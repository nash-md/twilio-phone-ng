angular.module('phoneApplication')
  .service('registerService', ['$http', function ($http) {

    this.register = function (user) {

      return new Promise(function (resolve, reject) {

        $http.post('/api/register', JSON.stringify({ user: user }))
          .then(function onSuccess(response) {
            resolve();
          }).catch(function onError(response) {
            reject(response.status);
          });

      });

    };

  }]);
