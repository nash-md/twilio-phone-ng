function SetupPhoneController($scope, $rootScope, $window, $timeout, setupPhoneService) {
  $scope.phone = $window.phone;
  $scope.user = $window.user;

  $scope.phoneNumbers = [];
  $scope.message = null;

  $scope.save = function () {
    $rootScope.state = 'phone-validation-in-progress';

    setupPhoneService.save($scope.phone).then(function (response) {

      $timeout(function () {
        $rootScope.state = 'phone-valid';
      }, 0);

    }, function onError(response) {

      $timeout(function () {
        $rootScope.state = 'phone-invalid';
        $scope.message = JSON.stringify(response);
      }, 0);

    });

  };

  $rootScope.$watch('state', function (form) {
    console.log('state: ' + form);
    if (form === 'account-valid') {

      setupPhoneService.getCallerIds().then(function (response) {
        console.log(response);

        $scope.phoneNumbers = response.data;
        $scope.$apply();

        $scope.$watch('phone', function (phone) {

          console.log('validate phone');
          $scope.verifyPhoneConfiguration(phone, function (error) {
            console.log(error);
            if (error) {

              $timeout(function () {
                $scope.message = error.message;
                $rootScope.state = 'phone-invalid';
              }, 0);

            } else {

              $timeout(function () {
                $scope.message = null;
                $rootScope.state = 'phone-valid';
              }, 0);

            }

          });

        }, true);

      }).catch(function (error) {
        console.log(error);
      });

    }

  });

  $scope.verifyPhoneConfiguration = function (phone, callback) {
    if (!phone.inbound.isActive && !phone.outbound.isActive) {
      callback(new Error('either outbound or inbound has to be active'));
      return;
    }

    // validate outbound
    if (phone.outbound.isActive) {

      if (!phone.outbound.mode) {
        callback(new Error('please select mode via caller id or number'));
        return;
      }

      // check if user has phone numbers or caller ids
      if (phone.outbound.mode === 'internal-caller-id' && $scope.phoneNumbers.incomingPhoneNumbers.length === 0) {
        callback(new Error('you dont have any twilio number for outbound'));
        return;
      }

      if (phone.outbound.mode === 'internal-caller-id' && !phone.outbound.phoneNumber) {
        callback(new Error('please select a phoneNumber for outbound'));
        return;
      }

      if (phone.outbound.mode === 'external-caller-id' && $scope.phoneNumbers.outgoingCallerIds.length === 0) {
        callback(new Error('you dont have any verified caller id for outbound'));
        return;
      }

      if (phone.outbound.mode === 'external-caller-id' && !phone.outbound.callerId) {
        callback(new Error('please select a callierid'));
        return;
      }

    }

    // validate outbound
    if (phone.inbound.isActive) {
      // check if user has phone numbers or caller ids
      if ($scope.phoneNumbers.incomingPhoneNumbers.length === 0) {
        callback(new Error('you dont have any twilio number for inbound'));
        return;
      }

      if (!phone.inbound.phoneNumber) {
        callback(new Error('please select a phoneNumber for inbound'));
        return;
      }

      if (!phone.inbound.phoneNumber) {
        callback(new Error('please select a phoneNumber for inbound'));
        return;
      }

    }

    callback(null);
  };

}

angular
  .module('phoneApplication')
  .controller('SetupPhoneController', SetupPhoneController);
