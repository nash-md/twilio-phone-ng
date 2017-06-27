function twilioApiKey() {
  var pattern = /^SK[a-z0-9]{32}$/;

  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, element, attrs, ctrl) {

      ctrl.$validators.twilioApiKey = function (ngModelValue) {

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
  .directive('twilioApiKey', twilioApiKey);
