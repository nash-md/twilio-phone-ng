angular.module('phoneApplication')
  .service('setupPhoneService', ['$http', function ($http) {

    this.save = function (phone) {

      return new Promise(function (resolve, reject) {

        $http.post('/api/setup/phone', { phone: phone }).then(function onSuccess(response) {
          resolve(response);
        }, function onError(response) {
          reject(response);
        });

      });

    };

    this.getCallerIds = function () {

      return new Promise(function (resolve, reject) {

        $http.get('/api/setup/callerids', null).then(function onSuccess(response) {
          resolve(response);
        }, function onError(error) {
          reject(error);
        });

      });

    };

  }]);
