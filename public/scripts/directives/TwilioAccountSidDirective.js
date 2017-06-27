function twilioAccountSid() {
  var pattern = /^AC[a-zA-Z0-9]{32}$/;

  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, element, attrs, ctrl) {

      ctrl.$validators.twilioAccountSid = function (ngModelValue) {

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
  .directive('twilioAccountSid', twilioAccountSid);
