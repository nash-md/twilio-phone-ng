function PhoneCallHistoryController($scope, $rootScope, phoneCallHistoryService) {
  $scope.more = false;
  $scope.calls = [];

  $scope.select = function (call) {
    var phoneNumber;

    if (call.direction === 'outbound') {
      phoneNumber = call.to;
    } else {
      phoneNumber = call.from;
    }

    if ($rootScope.state === 'idle') {
      $rootScope.$broadcast('select-keypad', {
        phoneNumber: phoneNumber,
      });
    }

  };

  $scope.fetch = function () {

    phoneCallHistoryService.get().then(function (data) {
      $scope.calls = data.calls;
      $scope.more = data.more;
      $scope.$apply();
    }).catch(function (error) {
      console.log(error);
    });

  };

  $scope.$on('call-history', function (event, parameters) {
    $scope.fetch();
  });

}

angular
  .module('phoneApplication')
  .controller('PhoneCallHistoryController', PhoneCallHistoryController);
