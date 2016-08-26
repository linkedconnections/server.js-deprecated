#!/usr/bin/node

var express = require('express'),
    program = require('commander'),
    path = require('path'),
    logger = require('morgan'),
    dbconnector = require('../middlewares/MongoDBConnector'), //TODO: check type
    Paginator = require('../middlewares/Paginator'),
    ConnectionsController = require('../controllers/ConnectionsController'),
    IndexController = require('../controllers/IndexController'),
    ErrorHandler = require('../middlewares/ErrorHandler'),
    compress = require('compression'),
    fs = require('fs');

program
  .option('-c --config [config]', 'specify config file')
  .parse(process.argv);

var configFile = program.config || path.join(__dirname, '../config-example.json');
var config = JSON.parse(fs.readFileSync(configFile, { encoding: 'utf8' }));

config.baseUri = "http://localhost:" + config.port
if (config.proxy) {
  config.baseUri = config.proxy.protocol + "://" + config.proxy.hostname;
  if (config.proxy.port != "80") {
    config.baseUri += ":" + config.proxy.port;
  }
}

var port = config.port;

var server = express();

//enable the data middleware
server.use(dbconnector());
//enable compression
server.use(compress());

//Router flow
//0. Enable cors and make config available to the rest of the middlewares
server.use(function (req, res, next) {
  if (!req.locals) {
    req.locals = {};
  }
  req.locals.config = config;
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods','GET');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});
//1. Log the request on any occasion to std out
server.use(logger('combined'));
//2. If we encounter a static file (such as a favicon, css files, images...), return it immediately
server.use(express.static(__dirname + '../public'));
//3. Add the paginator middleware
server.use(Paginator);
//4. Output json-ld: send metadata about the request as the data itself
server.get('/connections/', ConnectionsController);

server.get('/index/:date?', IndexController);
//Or redirect when we're on the homepage
server.get('/', function (req, res, next) {
  if (req.query.departureTime) {
    res.redirect(302, req.locals.config.baseUri + '/connections/?departureTime=' + encodeURIComponent(req.locals.page.getCorrectPageId(req.query.departureTime))); 
  } else {
    res.redirect(302, req.locals.config.baseUri + '/connections/');
  }
  next();
});

//5. If an error occured somewhere in the flow, handle it here
server.use(ErrorHandler);

//Connect to the DB and start the server!
dbconnector.connect(config.source.string, config.source.collections, function (error) {
  if (!error) {
    server.listen(port, function () {
      console.log('Server with pid %d running on http://localhost:%d/.', process.pid, port);
    });
  } else {
    console.error(error);
  }
});
