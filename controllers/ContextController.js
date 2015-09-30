var ContextView = require('../views/ContextView'),
    getContext = require('../models/Contexts');

module.exports = function (request, response, carryOn) {
  getContext(request.db, request.params.type, function (context) {
    context['@context'].hydra = 'http://www.w3.org/ns/hydra/core#';
    var view = new ContextView(context);
    response.status(200);
    response.type("application/ld+json");
    response.end(view.view());
    carryOn();
  });
};
