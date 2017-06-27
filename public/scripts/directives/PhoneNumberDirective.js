function phoneNumber() {
  var pattern = /^[0-9]{8,20}$/;
  return {
    require: 'ngModel',
    link: function (scope, element, attrs, ctrl) {

      ctrl.$validators.phoneNumber = function (ngModelValue) {
        if (!ngModelValue) {
          ctrl.$setValidity('invalidPhone', true);
          return ngModelValue;
        }

        if (pattern.test(ngModelValue) === false) {
          ctrl.$setValidity('invalidPhone', false);
          return ngModelValue;
        }

        ctrl.$setValidity('invalidPhone', true);

        return ngModelValue;
      };

    },
  };

}

angular
  .module('phoneApplication')
  .directive('phoneNumber', phoneNumber);
