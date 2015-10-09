var MongoClient = require('mongodb').MongoClient,
    MongoDBFixStream = require('./MongoDBFixStream');
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
  if (typeof this._db !== 'undefined') {
    cb();
  } else {
    var self = this;
    MongoClient.connect(dbstring, function(err, db) {
      if (err) {
        cb('Error connecting to the db: ' + err);
      }
      self._db = db;
      cb();
    });
  }
};

MongoDBConnector.context = function (callback) {
  callback({"@context" : { "lc" : "http://semweb.mmlab.be/ns/linkedconnections#", "gtfs" : "http://vocab.gtfs.org/terms#", "Connection" : "http://semweb.mmlab.be/ns/linkedconnections#Connection", "dct" : "http://purl.org/dc/terms/", "date" : "dct:date", "arrivalTime" : "lc:arrivalTime", "departureTime" : "lc:departureTime", "arrivalStop" : { "@type" : "@id", "@id" : "http://semweb.mmlab.be/ns/linkedconnections#arrivalStop" }, "departureStop" : { "@type" : "@id", "@id" : "http://semweb.mmlab.be/ns/linkedconnections#departureStop" }, "trip" : { "@type" : "@id", "@id" : "gtfs:trip" }, "route" : { "@type" : "@id", "@id" : "gtfs:route" }, "headsign" : "gtfs:headsign" }});
};

/**
 * @param page is an object describing the page of the resource
 */
MongoDBConnector._getMongoConnectionsStream = function (page, cb) {
  var connectionsStream = this._db.collection(this.collections['connections'])
      .find({'departureTime': {'$gte': page.getInterval().start, '$lt': page.getInterval().end}})
      .sort({'departureTime': 1})
      .stream().pipe(new MongoDBFixStream());
  cb(null, connectionsStream);
};

MongoDBConnector.getConnectionsPage = function (page, cb) {
  var stream = this._getMongoConnectionsStream(page, function (error, connectionsStream) {
    if (error) {
      cb (error);
    } else {
      cb(null, connectionsStream);
    }
  });
};

MongoDBConnector.getStops = function (cb) {
  this._db.collection(this.collections['stations']).find().toArray(cb);
};

module.exports = MongoDBConnector;
