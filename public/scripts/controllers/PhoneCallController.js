function PhoneCallController($scope, $rootScope, $interval, $timeout, $mdDialog, $mdToast) {
  $scope.phoneNumber = null;
  $scope.connection = null;
  $scope.duration = null;
  $scope.isMuted = false;
  $scope.mode = 'status';

  $scope.$on('incoming', function (event, parameters) {
    $scope.connection = parameters.connection;
    $scope.phoneNumber = parameters.connection.parameters.From;

    $scope.registerModal();
    $scope.registerMute();

    $timeout(function () {
      $rootScope.state = 'incoming';
    });

  });

  $scope.$on('cancel', function (event, parameters) {
    $scope.connection = null;

    $timeout(function () {
      $rootScope.state = 'idle';
    });

  });

  $scope.$on('disconnect', function (event, parameters) {
    $scope.connection = null;

    $scope.stopDurationCounter();

    $timeout(function () {
      $rootScope.state = 'idle';
    });

  });

  $scope.$on('outgoing', function (event, parameters) {
    $scope.connection = parameters.connection;
    $scope.phoneNumber = parameters.phoneNumber;
    $scope.registerModal();
    $scope.registerMute();

    $rootScope.state = 'busy';

    $scope.startDurationCounter();

  });

  $scope.hangUp = function () {
    $rootScope.state = 'idle';

    $scope.stopDurationCounter();

    $timeout(function () {
      Twilio.Device.disconnectAll();
    });

  };

  $scope.ignore = function () {
    $scope.connection.ignore();

    $rootScope.state = 'idle';
  };

  $scope.accept = function () {
    $scope.connection.accept();

    $rootScope.state = 'busy';

    $scope.startDurationCounter();
  };

  $scope.sendDigits = function (digit) {
    $scope.connection.sendDigits(digit);
  };

  $scope.toggleMute = function () {
    if ($scope.connection.isMuted() === false) {
      $scope.connection.mute(true);
      return;
    }

    $scope.connection.mute(false);
  };

  $scope.toggleKeypad = function () {
    if ($scope.mode === 'keypad') {
      $scope.mode = 'status';
      return;
    }

    $scope.mode = 'keypad';
  };

  $scope.openKeypad = function () {
    $scope.mode = 'keypad';
  };

  $scope.showNetworkWarning = function (name) {

    $mdToast.show({
      hideDelay: 8000,
      position: 'top',
      controller: 'NetworkWarningController',
      templateUrl: '/templates/network-warning.html',
      locals: { message: name },
    });

  };

  $scope.startDurationCounter = function () {
    $scope.duration = 0;

    $scope.counter = $interval(function () {
      $scope.duration += 1;
    }, 1000);

  };

  $scope.stopDurationCounter = function () {
    if (angular.isDefined($scope.counter)) {
      $interval.cancel($scope.counter);
      $scope.counter = undefined;
    }
  };

  $scope.registerMute = function () {
    $scope.isMuted = false;

    $scope.connection.mute(function (status, connection) {
      $scope.isMuted = status;
    });

  };

  $scope.registerModal = function () {

    $scope.connection.on('warning', function (name) {
      switch (name) {
        case 'high-jitter':
        case 'high-rtt':
        case 'high-packet-loss':
          $scope.showNetworkWarning(name);
          break;

        case 'constant-audio-input-level':
          break;

        default:
          break;
      }
    });

  };

}

angular
  .module('phoneApplication')
  .controller('PhoneCallController', PhoneCallController);
