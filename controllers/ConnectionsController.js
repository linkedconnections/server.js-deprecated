var ConnectionsModel = require("../models/ConnectionsModel");

module.exports = function (request, response, next) {
  //1. Check whether this page is good: if it isn't, do a redirect
  //check if a datetime is set, otherwise, redirect towards the correct pageId of now
  if (!request.query.departureTime) {
    response.redirect(302,'?departureTime=' + request.locals.page.getCorrectPageId(new Date));
  } else if (request.locals.page.getCorrectPageId(request.query.departureTime) !== request.query.departureTime){
    response.redirect(301, '?departureTime=' + request.locals.page.getCorrectPageId(request.query.departureTime));
  } else {
    //2. If it is a good page, then we can start streaming out the response and a HTTP 200 OK should be returned.
    // → We will now have to create a model for the data we want to retrieve from the db
    var connections = new ConnectionsModel(request.db);
    //3. Create output if a graph was created
    connections.getPage(request.locals.page, function (error, graph) {
      if (error) {
        next(error);
      } else {
        //Create output
        response.status(200);
        response.type("application/ld+json");
        var context = "http://localhost:8080/context.json";
        var metadata = {
          "@id" : "http://localhost:8080" + request.url +"",
          "hydra:nextPage" : request.locals.page.getNextPage(),
          "hydra:previousPage" : request.locals.page.getPreviousPage(),
        };
        var result = metadata;
        result["@context"] = context;
        result["@graph"] = graph;
        response.end(JSON.stringify(result));
        next();
      }
    });
  }
};
