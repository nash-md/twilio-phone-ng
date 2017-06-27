angular.module('phoneApplication', ['ngMaterial', 'ngMessages'])
  .config(function ($mdThemingProvider, $mdAriaProvider) {
    $mdAriaProvider.disableWarnings();
    $mdThemingProvider.theme('default')
      .primaryPalette('blue')
      .accentPalette('pink');
  });

