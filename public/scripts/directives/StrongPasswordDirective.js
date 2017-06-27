function strongPassword() {
  return {
    require: 'ngModel',
    link: function (scope, elm, attrs, ctrl) {

      ctrl.$parsers.unshift(function (password) {
        var hasUpperCase = /[A-Z]/.test(password);
        var hasLowerCase = /[a-z]/.test(password);
        var hasNumbers = /\d/.test(password);
        var hasNonalphas = /\W/.test(password);
        var characterGroupCount = hasUpperCase + hasLowerCase + hasNumbers + hasNonalphas;

        if (password.length >= 8) {
          ctrl.$setValidity('minlength', true);
        } else {
          ctrl.$setValidity('minlength', false);
        }

        if (password.length > 20) {
          ctrl.$setValidity('maxlength', false);
        } else {
          ctrl.$setValidity('maxlength', true);
        }

        if (characterGroupCount >= 3) {
          ctrl.$setValidity('complexity', true);
        } else {
          ctrl.$setValidity('complexity', false);
        }

        return password;
      });
    },

  };
}

angular
  .module('phoneApplication')
  .directive('strongPassword', strongPassword);
