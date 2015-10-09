var moment = require('moment');

//This is a paginator for the connections stream
module.exports = function (req, res, next) {  
  //new page each 10 minutes - we can also get smarter when a profile is given which should be followed (TODO)
  if (!req.locals) {
    req.locals = {};
  }
  req.locals.connectionsPage = {};
  req.locals.connectionsPage.getInterval = function () {
    var dt = new Date(req.query.departureTime);
    return {
      start : dt,
      end : new Date(dt.getTime() + 10 * 60000)
    };
  };
  this._base = req.locals.config.baseUri;
  if (req.port) {
    this._base += ':' + req.port;
  }
  var self = this;
  req.locals.connectionsPage.getCorrectPageId = function (dt) {
    if (!dt) {
      dt = moment(req.query.departureTime);
    } else {
      dt = moment(dt);
    }

    // Round minutes down with modulus of 10
    var minutes = dt.minutes();
    minutes %= 10;
    dt.subtract(minutes, 'minutes');
    return dt.format("YYYY-MM-DDTHH:mm");
  };

  req.locals.connectionsPage.getNextPage = function () {
    var dt = moment(req.query.departureTime);
    return self._base + "/connections/?departureTime=" + encodeURIComponent(dt.add(10, "minutes").format("YYYY-MM-DDTHH:mm"));
  }
  
  req.locals.connectionsPage.getPreviousPage = function () {
    var dt = moment(req.query.departureTime);
    return self._base + "/connections/?departureTime=" +  encodeURIComponent(dt.subtract(10, "minutes").format("YYYY-MM-DDTHH:mm"));
  }

  req.locals.connectionsPage.getCurrentPage = function () {
    var dt = moment(req.query.departureTime);
    return self._base + "/connections/?departureTime=" + encodeURIComponent(dt.format("YYYY-MM-DDTHH:mm"));
  }
  
  next();
}
