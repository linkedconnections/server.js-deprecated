var Transform = require('stream').Transform,
    util = require('util');

util.inherits(JSONLDStream, Transform);

function JSONLDStream(context) {
 	Transform.call(this, {objectMode : true});
 	this._hasWritten = false;

	context = JSON.stringify(context);
	context = context.substring(0, context.length - 1); // Chop of } so @graph can be added
	this.push(context);
	this.push(', "@graph" : ');
}

JSONLDStream.prototype._transform = function (connection, encoding, done) {
    if (!this._hasWritten) {
        this._hasWritten = true;
        this.push('[' + JSON.stringify(connection));

    } else {
        this.push(',' + JSON.stringify(connection));
    }

	done();
}

JSONLDStream.prototype._flush = function (callback) {
    if(this._hasWritten) {
        this.push(']}');
    } else {
        this.push('[]}'); // no connections
    } 
    callback();
};

module.exports = JSONLDStream;