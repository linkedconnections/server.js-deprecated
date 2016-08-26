var ConnectionsModel = require("../models/ConnectionsModel"),
    JSONLDView = require('../views/JSONLDView');

module.exports = function (request, response, next) {
  
  var view = new JSONLDView({
    "@context" : {
      hydra: "http://www.w3.org/ns/hydra/core#",
      mdi: "https://w3id.org/multidimensional-interface/ontology#",
      xsd: "http://www.w3.org/2001/XMLSchema#",
      lc: "http://semweb.mmlab.be/ns/linkedconnections#"
    }
  });
  
  //3. Stream output when the graph is being generated
  
  //Create output
  response.status(200);
  var rangeGate = request.locals.config.baseUri + "/index";
  response.type("application/ld+json");
  view.write({
    "@id": rangeGate,
    "@type": "mdi:RangeGate",
    "rdfs:label": "DepartureTime index",
    "rdfs:comment": "This range gate specifies ranges of connections with ordered by departureTime"
  });

  //implementing an index with 2 stages: first select day, then select the right fragment itself
  if (!request.params.date) {
    //generate for the entire year range fragments
    view.write({
      "@id": rangeGate + "/2016-08-26",
      "@type" : ["mdi:RangeFragment","mdi:RangeGate"],
      "mdi:hasRangeGate": {
        "@id" : rangeGate
      },
      "mdi:initial" : {
        "@value" : "2016-08-26T00:00+02:00",
        "@type" : "xsd:dateTime"
      },
      "mdi:final" : {
        "@value" : "2016-08-27T00:00+02:00",
        "@type" : "xsd:dateTime"
      }
    });
  } else {
    var mdiInitial = new Date(request.params.date);
    var mdiFinal = new Date(mdiInitial.getTime() + 24*3600*1000);
    view.write({
      "@id": rangeGate + "/" + mdiInitial.toISOString().substr(0,10),
      "@type" : "mdi:RangeGate",
      "mdi:hasRangeGate": {
        "@id" : rangeGate
      },
      "mdi:initial" : {
        "@value" : mdiInitial.toISOString(),
        "@type" : "xsd:dateTime"
      },
      "mdi:final" : {
        "@value" : mdiFinal,
        "@type" : "xsd:dateTime"
      }
    });
    
  }
  view.end();
  
  view.pipe(response)
      .on('end', next);
  
};
