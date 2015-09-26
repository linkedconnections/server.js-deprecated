var StopsModel = require("../models/StopsModel"),
    JSONLDView = require('../views/JSONLDView');

exports.list = function (request, response, next) {
  //1. Check whether this page is good: if it isn't, do a redirect
  //check if an offset is set, otherwise, redirect with offset 0
  if (!request.query.offset) {
    response.redirect(302, '?offset=' + '0');
  } else if (request.locals.stopsPage.getCorrectPageId(request.query.offset) !== request.query.offset){
    response.redirect(301, '?offset=' + request.locals.stopsPage.getCorrectPageId(request.query.offset));
  } else {
    // Return all stops with offset and limit
    //2. It is a good page, then we can start streaming out the response and a HTTP 200 OK should be returned.
    // → We will now have to create a model for the data we want to retrieve from the db
    var stops = new StopsModel(request.db);
    var view = new JSONLDView({
      "@context" : request.locals.config.baseUri + "/stops/context.json",
      "@id" : request.locals.stopsPage.getCurrentPage(),
      "hydra:nextPage" : request.locals.stopsPage.getNextPage(),
      "hydra:previousPage" : request.locals.stopsPage.getPreviousPage()
    });
    
    //3. Stream output when the graph is being generated
    stops.getPage(request.locals.stopsPage, function (error, stopsStream) {
      if (error) {
        next(error);
      } else {
        //Create output
        response.status(200);
        response.type("application/ld+json");
        stopsStream
          .pipe(view)
          .pipe(response)
          .on('end', next);
      }
    });
  }
};

exports.single = function (request, response, next) {
  var stopId = request.params.stopId;

  var stops = new StopsModel(request.db);
  var view = new JSONLDView({
    "@context" : request.locals.config.baseUri + "/stops/context.json",
    "@id" : request.locals.stopsPage.getBase() + '/stops/' + stopId
  });

  stops.get(stopId, function (error, stopStream) {
    if (error) {
      next(error);
    } else {
      //Create output
      response.status(200);
      response.type("application/ld+json");
      stopStream
        .pipe(view)
        .pipe(response)
        .on('end', next);
    }
  });
};