var ContextView = require('../views/ContextView'),
    getContext = require('../models/Contexts');

module.exports = function (request, response, carryOn) {
  var context = {
    "@context" : "http://www.w3.org/ns/hydra/context.jsonld"
  };
  getContext(request.db, request.params.type, function (modelContext) {
    context["@context"] = [context["@context"], modelContext["@context"]];
    var view = new ContextView(context);
    response.status(200);
    response.type("application/ld+json");
    response.end(view.view());
    carryOn();
  });
};
