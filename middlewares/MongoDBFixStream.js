var Transform = require('stream').Transform,
    util = require('util');

util.inherits(MongoDBFixStream, Transform);

function MongoDBFixStream () {
  Transform.call(this, {objectMode : true});
}

MongoDBFixStream.prototype._transform = function (object, encoding, done) {
  if (!object["@id"]) {
    object["@id"] = object["_id"];
  }
  if (!object["@type"]) {
    object["@type"] = "Connection";
  }
  delete(object["_id"]);
  done(null, object);
}

module.exports = MongoDBFixStream;
