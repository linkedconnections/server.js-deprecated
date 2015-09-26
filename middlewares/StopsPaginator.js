//This is a paginator for the stops stream
module.exports = function (req, res, next) {  
  //new page every x stops (needs to be checked)
  this._limit = 100;

  if (!req.locals) {
    req.locals = {};
  }
  req.locals.stopsPage = {};
  
  this._base = req.locals.config.baseUri;
  if (req.port) {
    this._base += ':' + req.port;
  }

  var self = this;
  req.locals.stopsPage.getCorrectPageId = function (offset) {
    // Offset can only be a positive integer
    if (!offset || offset < 0 || offset != parseInt(offset, 10)) {
      offset = 0;
    } else if (offset%self._limit != 0) {
      // Round offset down with modulus of limit
      offset %= self._limit;
    }

    return offset;
  };

  req.locals.stopsPage.getOffset = function() {
    return req.query.offset;
  }

  req.locals.stopsPage.getLimit = function() {
    return self._limit;
  }

  req.locals.stopsPage.getNextPage = function () {
    return self._base + "/stops/?offset=" + (parseInt(req.query.offset) + parseInt(self._limit));
  }
  
  req.locals.stopsPage.getPreviousPage = function () {
    if (req.query.offset > 0) {
      return self._base + "/stops/?offset=" + (req.query.offset - self._limit);
    } else {
          return self._base + "/stops/?offset=" + "0";
    }
  }

  req.locals.stopsPage.getCurrentPage = function () {
    return self._base + "/stops/?offset=" + req.query.offset;
  }
  
  next();
}
