function NetworkWarningController($scope, $mdToast, $mdDialog, message) {
  $scope.message = message;

  $scope.closeToast = function () {
    $mdToast.hide();
  };

}

angular
  .module('phoneApplication')
  .controller('NetworkWarningController', NetworkWarningController);
