var MongoClient = require('mongodb').MongoClient;

var MongoDBConnector = function () {
  return function (req, res, next) {
    req.db = MongoDBConnector;
    next();
  }
}

/**
 * Connect to the mongodb if not yet connected.
 * @param dbstring defines the mongoclient string to connect to mongodb
 * @param collections is an object of 
 * @param cb is a callback that needs to be called without parameters when the connection was succesful, or with 1 parameter when an error was encountered
 */
MongoDBConnector.connect = function (dbstring, collections, cb) {
  this.collections = collections;
  //check if we already have a db connection
  if (typeof this._db !== "undefined") {
    cb();
  } else {
    var self = this;
    MongoClient.connect(dbstring, function(err, db) {
      if (err) {
        cb("Error connecting to the db: " + err);
      }
      self._db = db;
      cb();
    });
  }
};

/**
 * @param page is an object describing the page of the resource
 */
MongoDBConnector._getMongoConnectionsStream = function (page, cb) {
  this._db.collection(this.collections["connections"]).find({"st:departureTime": {"$gt" : page.start, "$lt" : page.end}}).sort({"st:departureTime":1}).toArray(cb);
};

MongoDBConnector.getConnectionsPage = function (page, cb) {
  var stream = this._getMongoConnectionsStream(page, function (error, connections) {
    if (error) {
      cb (error);
    } else {
      connections.forEach(function (connection) {
        connection["@id"] = connection["_id"];
        delete(connection["_id"]);
      });
      cb(null, connections);
    }
  });
};

MongoDBConnector.getStops = function (cb) {
  this._db.collection(this.collections["stations"]).find().toArray(cb);
};

module.exports = MongoDBConnector;
