# Linked Connections Server

The Linked Connections Server enables anyone maintaining public transit data to publish this data for the purpose of route planning. The Linked Connections Server is written in nodejs/express.

## Install the server

This server requires [Node.js](http://nodejs.org) 0.10 or higher and is tested on Linux. To install, execute:

```bash
git clone {this repo}
cd repo
npm install
```

## Use the server

### Configure the data sources

Copy config-example.json to config.json and fill out all the details. If you have a proxy, such as with varnish, cloudflare, apache or nginx in place, do fill out the proxy details. If you just want to run it on localhost as a test, your can remove the proxy object.

### Load connections in MongoDB

First, make sure that you have [MongoDB](https://www.mongodb.org/) installed.

Now you have two options:

### You already have a [jsonldstream](https://github.com/pietercolpaert/jsonld-stream) of [connections](https://github.com/linkedconnections/vocabulary) generated yourself

```bash
mongoimport --db lc --collection connections --file connections.jsonldstream
#convert the times to ISO8601 for mongo
mongo lc --eval 'db.connections.find().forEach(function(conn){conn["arrivalTime"] = new ISODate(conn["arrivalTime"]);conn["departureTime"] = new ISODate(conn["departureTime"]);db.connections.save(conn)});'
```

Now, fill out your config.json with the right collections and mongodb connection string.

### From a GTFS file

 1. Use [gtfs2arrdep](https://github.com/brechtvdv/gtfs2arrdep) script to transform a GTFS file into arrivals/departures.
 2. Use [arrdep2connections](https://github.com/linkedconnections/arrdep2connections) to convert arrivals/departures into connections and stream directly into MongoDB by using ```--mongodb``` width [the command](https://github.com/linkedconnections/arrdep2connections).
 3. Fill out config.json accordingly

### Start the server

```bash
nodejs server.js
```

## Background

On today's Web, public transport datasets are disseminated in different ways, which include [GTFS zip files](http://gtfs.org) and route planning as a service APIs (such as [navitia.io](http://navitia.io/the-api.php), the [Dutch railways](http://www.ns.nl/api/home) and many others). In the first case, the dataset is to be downloaded entirely, and routes are intended to be computed locally. Both server as client need to do a considerable amount of work in order to update the data. In the second case, one server handles all possible questions from end-users, but it's hardly possible to combine different APIs to form intermodal routes taking into account all the end-user's requirements.

This proof of concept server offers a type of [**Linked Data Fragments**](http://linkeddatafragments.org/concept/), a term used to indicate the trade-offs between client and server responsibilities to be made when publishing data, which we will call __Linked Connections__. Each Linked Connections document consists of a linked list of pages identified by URLs. These pages offer:
 * __[Connection](https://github.com/LinkedConnections/vocabulary)__ objects starting at a certain timestamp
 * __controls__ that lead to other fragments of this dataset (typically the previous and the next page of Connections)

This proof of concept shows that it is worthwhile restudying the trade-offs between server infrastructure and user agent responsibilities: other options are open to be discovered and have advantages and disadvantages of their own.

## License

The Linked Data Fragments server is written by [Pieter Colpaert](http://pieter.pm).

The code is copyrighted by iMinds - Ghent University and released under the MIT license
