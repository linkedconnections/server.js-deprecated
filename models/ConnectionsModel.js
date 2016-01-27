var ConnectionsModel = function (db) {
  this._db = db;
};

ConnectionsModel.prototype.context = function (cb) {
  this._db.context(cb);
};

ConnectionsModel.prototype.get = function (connectionid, cb) {
  this._db.getConnection(connectionid);
};

ConnectionsModel.prototype.getPage = function (page, request, cb) {
  this._db.getConnectionsPage(page, request, cb);
};

ConnectionsModel.prototype.getRoute = function (routeid, dateParam, request, cb) {
  this._db.getRoute(routeid, dateParam, request, cb);
};

ConnectionsModel.prototype.create = function (connection, cb) {
  this._db.add(connection);
};

module.exports = ConnectionsModel;
