var ContextView = require('../views/ContextView'),
    getContext = require('../models/Contexts');

module.exports = function (request, response, carryOn) {
  var context = {
    "@context" : {
      hydra: "http://www.w3.org/ns/hydra/core#",
      rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
      rdfs: "http://www.w3.org/2000/01/rdf-schema#",
      xsd: "http://www.w3.org/2001/XMLSchema#",
      dc: "http://purl.org/dc/terms/",
      property: {
        "@id": "hydra:property",
        "@type": "@vocab"
      },
      required: "hydra:required",
      Collection: "hydra:Collection",
      member: {
        "@id": "hydra:member",
        "@type": "@id"
      },
      search: "hydra:search",
      PagedCollection: "hydra:PagedCollection",
      firstPage: {
        "@id": "hydra:firstPage",
        "@type": "@id"
      },
      lastPage: {
        "@id": "hydra:lastPage",
        "@type": "@id"
      },
      nextPage: {
        "@id": "hydra:nextPage",
        "@type": "@id"
      },
      previousPage: {
        "@id": "hydra:previousPage",
        "@type": "@id"
      },
      TemplatedLink: "hydra:TemplatedLink",
      IriTemplate: "hydra:IriTemplate",
      template: "hydra:template",
      mapping: "hydra:mapping",
      IriTemplateMapping: "hydra:IriTemplateMapping",
      variable: "hydra:variable",
      comment: "rdfs:comment",
      label: "rdfs:label"
    }
  };
  getContext(request.db, request.params.type, function (modelContext) {
    var view = new ContextView(context);
    view.add(modelContext);
    response.status(200);
    response.type("application/ld+json");
    response.end(view.view());
    carryOn();
  });
};
