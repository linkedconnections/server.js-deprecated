var ConnectionsModel = require("../models/ConnectionsModel"),
    JSONLDView = require('../views/JSONLDView');

module.exports = function (request, response, next) {
  //1. Check whether this page is good: if it isn't, do a redirect
  //check if a datetime is set, otherwise, redirect towards the correct pageId of now
  if (!request.query.departureTime) {
    response.redirect(302, request.locals.config.baseUri + '/trips/' + request.params.tripid + '/?departureTime=' + encodeURIComponent((new Date()).toISOString().substr(0,10)));
  } else {
    var dateParam = new Date(request.query.departureTime);
    if (!dateParam){
      response.redirect(302, request.locals.config.baseUri + '/trips/' + request.params.tripid + '/?departureTime=' + encodeURIComponent((new Date()).toISOString().substr(0,10)));
    } else {
      //2. If it is a good page, then we can start streaming out the response and a HTTP 200 OK should be returned.
      // → We will now have to create a model for the data we want to retrieve from the db
      var connections = new ConnectionsModel(request.db);
      var view = new JSONLDView({
        "@context" : request.locals.config.baseUri + "/trips/context.json",
        "@id" : request.locals.config.baseUri + "/trips/" + request.params.tripid + '/?departureTime=' + request.query.departureTime,
        "@type" : "Collection",
        "search" : {
          "@type" : "IriTemplate",
          "template" : request.locals.config.baseUri + "/trips/{?departureTime}",
          "variableRepresentation" : "BasicRepresentation",
          "mapping" : {
            "@type" : "IriTemplateMapping",
            "variable" : "departureTime",
            "required" : true,
            "property" : "http://semweb.mmlab.be/ns/linkedconnections#departureTimeQuery"
          }
        }
      });
      
      //3. Stream output when the graph is being generated
      connections.getTrip(request.params.tripid, dateParam, function (error, connectionsStream) {
        if (error) {
          next(error);
        } else {
          //Create output
          response.status(200);
          response.type("application/ld+json");
          connectionsStream
            .pipe(view)
            .pipe(response)
            .on('end', next);
        }
      });
    }
  }
};
