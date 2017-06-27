function CallDuration() {

  var addLeadingZero = function (value) {
    if (value < 10) {
      return '0' + value;
    }

    return value;
  };

  return function (value) {
    var hours = Math.floor(value / 3600);
    var minutes = Math.floor((value - (hours * 3600)) / 60);
    var seconds = value - (hours * 3600) - (minutes * 60);

    var duration = null;

    // call was less then a minute
    if (hours === 0 && minutes === 0) {
      duration = seconds + ' seconds';
    }

    // call was less then an hour
    if (hours === 0 && minutes !== 0) {
      duration = addLeadingZero(minutes) + ':' + addLeadingZero(seconds) + ' minutes';
    }

    if (hours === 1) {
      duration = hours + ' hour ' + minutes + ' minute(s)';
    }

    if (hours > 1) {
      duration = hours + ' hours ' + minutes + ' minute(s)';
    }

    return duration;
  };

}

angular
  .module('phoneApplication')
  .filter('CallDuration', CallDuration);
