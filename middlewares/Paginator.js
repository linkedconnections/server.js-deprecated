var moment = require('moment-timezone');

//This is a paginator for the connections stream
module.exports = function (req, res, next) {  
  //new page each 10 minutes - we can also get smarter when a profile is given which should be followed (TODO)
  if (!req.locals) {
    req.locals = {};
  }
  req.locals.page = {};
  req.locals.page.getInterval = function () {
    var dt = moment.tz(req.query.departureTime, req.locals.config["default-timezone"] || "Europe/Brussels");
    var end = moment(dt).add(10,'minutes');
    return {
      start : dt.toDate(),
      end : end.toDate()
    };
  };
  this._base = req.locals.config.baseUri;
  if (req.port) {
    this._base += ':' + req.port;
  }
  var self = this;
  req.locals.page.getCorrectPageId = function (dt) {
    if (!dt) {
      dt = moment.tz(req.query.departureTime, req.locals.config["default-timezone"] || "Europe/Brussels");
    } else {
      dt = moment.tz(dt, req.locals.config["default-timezone"] || "Europe/Brussels");
    }

    // Round minutes down with modulus of 10
    var minutes = dt.minutes();
    minutes %= 10;
    dt.subtract(minutes, 'minutes');
    return dt.format("YYYY-MM-DDTHH:mm");
  };

  req.locals.page.getNextPage = function () {
    var dt = moment.tz(req.query.departureTime, req.locals.config["default-timezone"] || "Europe/Brussels");
    return self._base + "/connections/?departureTime=" + encodeURIComponent(dt.add(10, "minutes").format("YYYY-MM-DDTHH:mm"));
  }
  
  req.locals.page.getPreviousPage = function () {
    var dt = moment.tz(req.query.departureTime, req.locals.config["default-timezone"] || "Europe/Brussels");
    return self._base + "/connections/?departureTime=" +  encodeURIComponent(dt.subtract(10, "minutes").format("YYYY-MM-DDTHH:mm"));
  }

  req.locals.page.getCurrentPage = function () {
    var dt = moment.tz(req.query.departureTime, req.locals.config["default-timezone"] || "Europe/Brussels");
    return self._base + "/connections/?departureTime=" + encodeURIComponent(dt.format("YYYY-MM-DDTHH:mm"));
  }
  
  next();
}
