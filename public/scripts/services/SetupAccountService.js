angular.module('phoneApplication')
  .service('setupAccountService', ['$http', '$q', function ($http, $q) {

    this.save = function (account) {

      return new Promise(function (resolve, reject) {

        var validateAccount = function () {
          var deferred = $q.defer();

          $http.post('/api/setup/validate-account', account)
            .then(function onSuccess(response) {
              deferred.resolve();
            }, function (response) {
              deferred.reject('verification-failed');
            });

          return deferred.promise;

        };

        var saveAccount = function () {
          var deferred = $q.defer();

          $http.post('/api/setup/account', account)
            .then(function onSuccess(response) {
              deferred.resolve(response);
            }, function (response) {
              deferred.reject('save-invalid');
            });

          return deferred.promise;

        };

        validateAccount().then(saveAccount).then(function (response) {
          resolve(response);
        }).catch(function (error) {
          console.log(error);
          reject(error);
        });

      });

    };

  }]);
