function ElapsedTime() {

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

    let format;

    if (hours > 0) {
      format = 'hh:mm:ss';
    } else {
      format = 'mm:ss';
    }

    hours = addLeadingZero(hours);
    minutes = addLeadingZero(minutes);
    seconds = addLeadingZero(seconds);

    return format.replace(/hh/, hours).replace(/mm/, minutes).replace(/ss/, seconds);
  };

}

angular
  .module('phoneApplication')
  .filter('ElapsedTime', ElapsedTime);
