var ConnectionsModel = function (db) {
  this._db = db;
};

ConnectionsModel.prototype.get = function (connectionid, cb) {
  this._db.getConnection(connectionid);
};

ConnectionsModel.prototype.getPage = function (page, request, cb) {
  var interval = page.getInterval();
  this._db.getConnectionsPage(interval, request, cb);
};

ConnectionsModel.prototype.create = function (connection, cb) {
  this._db.add(connection);
};

module.exports = ConnectionsModel;
