angular.module('phoneApplication')
  .service('phoneCallHistoryService', ['$http', function ($http) {
    var query = { start: 0, timestamp: null };
    var calls = [];

    this.get = function (more) {

      return new Promise(function (resolve, reject) {

        $http({
          url: '/api/phone/call-history',
          method: 'GET',
          params: { start: query.start, timestamp: query.timestamp },
        }).then(function onSuccess(response) {
          let total = query.start + response.data.calls.length;

          if (total === calls.length && response.data.query.refresh === false) {
            resolve({ more: response.data.query.more, calls: calls });
          }

          if (response.data.query.refresh === true) {
            calls = response.data.calls;
          } else {
            calls = calls.concat(response.data.calls);
          }

          query.start = calls.length;
          query.timestamp = response.data.query.timestamp;

          resolve({ more: response.data.query.more, calls: calls });
        }).catch(function (error) {
          reject(error);
        });

      });

    };

  }]);
