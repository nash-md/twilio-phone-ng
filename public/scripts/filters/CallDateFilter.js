function CallDate() {

  return function (value) {
    return moment(value).fromNow();
  };

}

angular
  .module('phoneApplication')
  .filter('CallDate', CallDate);
