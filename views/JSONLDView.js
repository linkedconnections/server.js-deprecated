var Transform = require('stream').Transform,
    util = require('util');

util.inherits(JSONLDView, Transform);

function JSONLDView (metadata) {
  Transform.call(this, {objectMode : true});
  this._metadata =  metadata;
  this.push(JSON.stringify(this._metadata).replace(/}$/,'') + ',"@graph":[');
  this._first = true;
}

JSONLDView.prototype._transform = function (object, encoding, done) {
  if (this._first) {
    this._first = false;
    done(null, JSON.stringify(object));
  } else {
    done(null, "," + JSON.stringify(object));
  }
}

JSONLDView.prototype._flush = function (done) {
  this.push(']}');
  done();
};

module.exports = JSONLDView;
