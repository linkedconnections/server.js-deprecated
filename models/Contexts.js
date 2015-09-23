module.exports = function (db, type, callback) {
  var models = {
    "stops" : "./StopsModel",
    "connections" : "./ConnectionsModel"
  };
  
  if (models[type]) {
    var Model = require(models[type]);
    var model = new Model(db);
    model.context(callback);
  } else {
    callback(null);
  }
};
