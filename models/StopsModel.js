var fs = require('fs');

var StopsModel = function (db) {
  this._db = db;
};

StopsModel.prototype.context = function (cb) {
  //this._db.stopsContext(cb);
  var context = require('../public/stopsContext.json');
  cb(context);
};

StopsModel.prototype.get = function (stopid, cb) {
  this._db.getStop(stopid, cb);
};

StopsModel.prototype.getPage = function (page, cb) {
  this._db.getStopsPage(page, cb);
};

StopsModel.prototype.create = function (stop, cb) {
  this._db.addStop(stop, cb);
};

module.exports = StopsModel;
