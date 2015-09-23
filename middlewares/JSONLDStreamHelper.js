/**
 * A transform class that takes an @context on creation, and pushes this together with all the data that it is piped with.
 */

var Transform = require('stream').Transform,
    util = require('util');

util.inherits(JSONLDStreamHelper, Transform);

function JSONLDStreamHelper(context) {
  Transform.call(this, {objectMode : true});
  this.push(context);
}

JSONLDStreamHelper.prototype._transform = function (object, encoding, done) {
  done(null, object);
}

module.exports = JSONLDStreamHelper;
