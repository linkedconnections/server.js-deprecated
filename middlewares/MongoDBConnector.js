var MongoClient = require('mongodb').MongoClient,
    JSONLDStream = require('../streams/JSONLDStream.js');

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

/**
 * @param page is an object describing the page of the resource
 */
MongoDBConnector._getMongoConnectionsStream = function (page, cb) {
  var self = this;

  // Get context
  this._db.collection(this.collections['connections']).find({ '@context' : { '$exists' : true} }, { _id: 0}).toArray(function(err, context) {
    var metadata = {
      "@id" : page.getCurrentPage(),
      "hydra:nextPage" : page.getNextPage(),
      "hydra:previousPage" : page.getPreviousPage()
    };

    var resultContext = {};
    resultContext['@context'] = {};

    // Add metadata
    for(var key in metadata) resultContext['@context'][key]=metadata[key];

    // Add rest of context
    for(var key in context[0]['@context']) resultContext['@context'][key]=context[0]['@context'][key];

    var jsonldStream = new JSONLDStream(resultContext);

    var connectionsStream = self._db.collection(self.collections['connections']).find({'departureTime': {'$gt' : page.getInterval().start, '$lt' : page.getInterval().end}}).sort({'departureTime':1}).stream({
      transform: function(connection) {
        return connection;
      }
    });

    cb(null, connectionsStream.pipe(jsonldStream));
  });
};

MongoDBConnector.getConnectionsPage = function (page, cb) {
  var stream = this._getMongoConnectionsStream(page, function (error, jsonldStream) {
    if (error) {
      cb (error);
    } else {    
      cb(null, jsonldStream);
    }
  });
};

MongoDBConnector.getStops = function (cb) {
  this._db.collection(this.collections['stations']).find().toArray(cb);
};

module.exports = MongoDBConnector;
