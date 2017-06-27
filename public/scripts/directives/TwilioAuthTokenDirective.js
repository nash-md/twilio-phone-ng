function twilioAuthToken() {
  var pattern = /^[a-zA-Z0-9]{32}$/;

  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, element, attrs, ctrl) {

      ctrl.$validators.twilioAuthToken = function (ngModelValue) {
        if (pattern.test(ngModelValue)) {
          ctrl.$setValidity('invalid', true);
          return ngModelValue;
        }

        ctrl.$setValidity('invalid', false);
        return ngModelValue;
      };

    },
  };

}

angular
  .module('phoneApplication')
  .directive('twilioAuthToken', twilioAuthToken);
