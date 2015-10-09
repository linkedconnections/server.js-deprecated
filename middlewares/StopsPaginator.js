//This is a paginator for the stops stream
module.exports = function (req, res, next) {  
  //new page every x stops (needs to be checked)
  this._LIMIT = 100;

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
    } else if (offset%self._LIMIT != 0) {
      // Round offset down with modulus of limit
      rest = offset % self._LIMIT;
      offset -= rest;
    }

    return offset;
  };

  req.locals.stopsPage.getBase = function() {
    return self._base;
  }

  req.locals.stopsPage.getOffset = function() {
    return req.query.offset;
  }

  req.locals.stopsPage.getLimit = function() {
    return self._LIMIT;
  }

  req.locals.stopsPage.getNextPage = function () {
    return self._base + "/stops/?offset=" + (parseInt(req.query.offset) + parseInt(self._LIMIT));
  }
  
  req.locals.stopsPage.getPreviousPage = function () {
    if (req.query.offset > 0) {
      return self._base + "/stops/?offset=" + (req.query.offset - self._LIMIT);
    } else {
          return self._base + "/stops/?offset=" + "0";
    }
  }

  req.locals.stopsPage.getCurrentPage = function () {
    return self._base + "/stops/?offset=" + req.query.offset;
  }
  
  next();
}
