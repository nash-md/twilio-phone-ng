function RegisterController($scope, $window, $timeout, registerService) {

  $scope.reset = function () {
    $scope.registerForm.friendlyName.$setValidity('unique', true);
    $scope.registerForm.friendlyName.$setValidity('server', true);
  };

  $scope.register = function () {

    registerService.register($scope.user)
      .then(function (result) {
        $window.location.href = '/home';
      }).catch(function onError(result) {
        switch (result) {
          case 409:
            $scope.registerForm.friendlyName.$setValidity('unique', false);
            break;

          default:
            $scope.registerForm.friendlyName.$setValidity('server', false);
        }

        $scope.$apply();
      });

  };

}

angular
  .module('phoneApplication')
  .controller('RegisterController', RegisterController);
