var express = require('express');
var server = express.createServer();
var url = require('url');
var http = require('http');

var nowjs = require("now");
var everyone = nowjs.initialize(server);

everyone.now.logStuff = function(msg){
    console.log(msg);
}

everyone.now.get = function(data, poll_status_check, cb) {
  var u = url.parse(data.url);
  //TODO add these options:
  //    interval: 500,
  //    backoff: false,
  //    max: 40,
  var options = {
    host: u.host,
    port: 80,
    path: u.pathname + u.search,
  };
  console.log('get ' + u.host);
  console.log(options.path);

  var repeat = true;
  while (repeat) {
    http.get(options, function(resp){
      var chunks = [];
      resp.on('data', function(chunk){
        chunks.push(chunk);
      }).on('end', function() {
        var obj;
        try {
          obj = JSON.parse(chunks.join(''));
        }
        catch (e) {
          console.log('Failed parsing json');
          cb(false);
          return;
        }

        poll_status_check(obj, function(status) {
          if (status) {
            // polling is complete
            repeat = false;
            console.log('poll results complete');
            cb(true, obj);
          }
        });
      });
    }).on('error', function(e){
      console.log("Got error: " + e.message);
    }); // end http get
  }
} // end everyone.now.get

server.use(express.static(__dirname + '/client'));
server.listen(8080);
