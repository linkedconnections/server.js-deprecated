var ConnectionsModel = function (db) {
  this._db = db;
};

ConnectionsModel.prototype.context = function (cb) {
  this._db.connectionsContext(cb);
};

ConnectionsModel.prototype.get = function (connectionid, cb) {
  this._db.getConnection(connectionid);
};

ConnectionsModel.prototype.getPage = function (page, cb) {
  this._db.getConnectionsPage(page, cb);
};

ConnectionsModel.prototype.create = function (connection, cb) {
  this._db.addConnection(connection);
};

module.exports = ConnectionsModel;
