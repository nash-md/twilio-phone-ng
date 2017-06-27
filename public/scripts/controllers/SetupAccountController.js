function SetupAccountController($scope, $rootScope, $timeout, $window, setupAccountService) {
  $scope.account = $window.account;
  $scope.user = { };

  $rootScope.state = 'account-unchecked';

  $scope.$watch('account', function (value) {
    $rootScope.state = 'account-unchecked';
  }, true);

  $scope.$watch('this.accountForm', function (form) {
    if (!form) {
      return;
    }

    if ($scope.account.accountSid || $scope.account.authToken) {
      var listener = $scope.$watch('accountForm.$valid', function (newValue, oldValue) {
        if (newValue === true) {
          $scope.save();
        }

        console.log('validity: ' + $scope.accountForm.$valid);

        listener();
      });

      $timeout(function () {

        angular.forEach(form, function (value, key) {
          if (typeof value === 'object' && value.hasOwnProperty('$modelValue')) {
            value.$setDirty();
            value.$setTouched();
          }
        });

      }, 1000);

    }

  });

  $scope.save = function () {
    $rootScope.state = 'account-validation-in-progress';

    setupAccountService.save($scope.account).then(function (response) {
      $rootScope.state = 'account-valid';
      $scope.$apply();
    }).catch(function (error) {
      console.log(error);
      $rootScope.state = 'account-invalid';
      $scope.$apply();
    });

  };

  $scope.openHome = function () {
    $window.location.href = '/home';
  };

}

angular
  .module('phoneApplication')
  .controller('SetupAccountController', SetupAccountController);
