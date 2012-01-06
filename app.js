var express = require('express');
var server = express.createServer();
var url = require('url');
var http = require('http');
var everyone = require('now').initialize(server);

everyone.now.get = function(data, poll_status_check, cb) {
  var u = url.parse(data.url);
  var options = {
    host: u.host,
    port: 80,
    path: u.pathname + u.search,
    interval: data.interval || 500,
    backoff: data.backoff || false,
    max: data.max || 40,
  };

  console.log('get ' + u.host + options.path);
  var repeat = true;
  var interval = options.interval;
  var count = 0;
  (function poll() {
    count++;
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
          if (count >= options.max) {
            cb(false);
            return;
          }
          if (repeat) {
            console.log('polling...');
            if (options.backoff) {
              interval *= interval;
            }
            setTimeout(function() { poll(); }, interval);
          }
        }); // end poll_status_check
      }); // end http.get on end
    }).on('error', function(e){
      console.log("Got error: " + e.message);
    }); // end http get
  })() // end poll
} // end everyone.now.get

server.use(express.static(__dirname + '/client'));
server.listen(8080);
