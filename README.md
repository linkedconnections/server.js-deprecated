# Linked Connections Proof of Concept Server

On today's Web, public transport datasets are disseminated in different ways, which include [GTFS zip files](http://gtfs.org) and route planning as a service APIs (such as [navitia.io](http://navitia.io/the-api.php), the [Dutch railways](http://www.ns.nl/api/home) and many others). In the first case, the dataset is to be downloaded entirely, and routes are intended to be computed locally. Both server as client need to do a considerable amount of work in order to update the data. In the second case, one server handles all possible questions from end-users, but it's hardly possible to combine different APIs to form intermodal routes taking into account all the end-user's requirements.

This proof of concept server offers a type of [**Linked Data Fragments**](http://linkeddatafragments.org/concept/), a term used to indicate the trade-offs between client and server responsibilities to be made when publishing data, which we will call __Linked Connections__. Each Linked Connections document consists of a linked list of pages identified by URLs. These pages offer:
* __[Connection](https://github.com/LinkedConnections/vocabulary)__ objects starting at a certain timestamp
 * __controls__ that lead to other fragments of this dataset (typically the previous and the next page of Connections)

This proof of concept shows that it is worthwhile restudying the trade-offs between server infrastructure and user agent responsibilities: other options are open to be discovered and have advantages and disadvantages of their own.

## Install the server

This server requires [Node.js](http://nodejs.org) 0.10 or higher and is tested on Linux. To install, execute:

```bash
git clone {this repo}
cd repo
npm install
```

## Use the server

### Configure the data sources

Copy config-example.json to config.json and fill out all the details.

### Start the server

```bash
nodejs server.js
```

## License

The Linked Data Fragments server is written by [Pieter Colpaert](http://pieter.pm).

The code is copyrighted by iMinds - Ghent University and released under the MIT license
