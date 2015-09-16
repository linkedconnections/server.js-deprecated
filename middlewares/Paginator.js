var moment = require('moment');

//This is a paginator for the connections stream
module.exports = function (req, res, next) {  
  //new page each 10 minutes - we can also get smarter when a profile is given which should be followed (TODO)
  if (!req.locals) {
    req.locals = {};
  }
  req.locals.page = {};
  req.locals.page.getInterval = function () {
    var dt = new Date(req.query.departureTime);
    return {
      start : dt,
      end : new Date(dt.getTime() + 10 * 60000)
    };
  };
  
  req.locals.page.getCorrectPageId = function (dt) {
    if (!dt) {
      dt = moment(req.query.departureTime);
    } else {
      dt = moment(dt);
    }

    // Round minutes down with modulus of 10
    var minutes = dt.minutes();
    minutes %= 10;
    dt.subtract(minutes, 'minutes');

    //for now, just accept everything
    return dt.format("YYYY-MM-DDTHH:mm");
  };

  req.locals.page.getNextPage = function () {
    var dt = moment(req.query.departureTime);
    return "http://localhost:8080/connections/?departureTime=" + dt.add(10, "minutes").format("YYYY-MM-DDTHH:mm");
  }
  
  req.locals.page.getPreviousPage = function () {
    var dt = moment(req.query.departureTime);
    return "http://localhost:8080/connections/?departureTime=" + dt.subtract(10, "minutes").format("YYYY-MM-DDTHH:mm");
  }

  req.locals.page.getCurrentPage = function () {
    var dt = moment(req.query.departureTime);
    return "http://localhost:8080/connections/?departureTime=" + dt.format("YYYY-MM-DDTHH:mm");
  }
  
  next();
}
