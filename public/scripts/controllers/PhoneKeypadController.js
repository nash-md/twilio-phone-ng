function PhoneKeypadController($scope, $rootScope, $log) {
  $scope.phoneNumber = '';

  $scope.call = function () {

    $rootScope.$broadcast('call', {
      phoneNumber: '+' + $scope.phoneNumber,
    });

  };

  $scope.remove = function () {
    if ($scope.phoneNumber.length > 0) {
      $scope.phoneNumber = $scope.phoneNumber.substr(0, ($scope.phoneNumber.length - 1));
    }
  };

  $scope.add = function (digit) {
    $scope.phoneNumber += digit;
  };

  $scope.$on('select-keypad', function (event, parameters) {
    $scope.phoneNumber = parameters.phoneNumber.substr(1);
  });

  $scope.paste = function (e) {
    event.preventDefault();

    if (e.clipboardData) {
      let raw = e.clipboardData.getData('text/plain');
      let text = raw.replace(/[^0-9]/gm, '');

      document.execCommand('insertText', false, text);
    } else {
      $log.error('clipboard data not found');
    }

  };

}

angular
  .module('phoneApplication')
  .controller('PhoneKeypadController', PhoneKeypadController);
