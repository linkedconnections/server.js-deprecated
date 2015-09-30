var fs = require('fs');

var StopsModel = function (db) {
  this._db = db;
};

StopsModel.prototype.context = function (cb) {
  //this._db.stopsContext(cb);
  var context = require('../public/stopsContext.json');
  cb(context);
};

StopsModel.prototype.getStopById = function (stopId, cb) {
  this._db.getStopById(stopId, cb);
};

StopsModel.prototype.getStopsByName = function (stopName, cb) {
  this._db.getStopsByName(stopName, cb);
};

StopsModel.prototype.getStopsByLatLng = function (lat, lon, distance, cb) {
  this._db.getStopsByLatLng(lat, lon, distance, cb);
}

StopsModel.prototype.getStopsByBBox = function (swlon, swlat, nelon, nelat, cb) {
  this._db.getStopsByBBox(swlon, swlat, nelon, nelat, cb);
}

StopsModel.prototype.getPage = function (page, cb) {
  this._db.getStopsPage(page, cb);
};

StopsModel.prototype.create = function (stop, cb) {
  this._db.addStop(stop, cb);
};

module.exports = StopsModel;
