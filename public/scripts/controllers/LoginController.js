function LoginController($scope, $window, loginService) {
  $scope.user = { friendlyName: '', password: '' };

  $scope.login = function () {

    loginService.login($scope.user)
      .then(function (result) {
        $window.location.href = '/home';
      }).catch(function onError(result) {
        $scope.loginForm.password.$setValidity('invalid', false);
        $scope.$apply();
      });

  };

}

angular
  .module('phoneApplication')
  .controller('LoginController', LoginController);
