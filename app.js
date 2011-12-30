var express = require('express');
var server = express.createServer();
var dnode = require('dnode');

server.use(express.static(__dirname));

dnode(function (client) {
    this.cat = function (cb) {
        client.test(function(s){
          cb('meow' + s);
        });
    };
    this.get = function(data, cb) {
      cb(true, client.test());

      u = url.parse(data.url);
      //TODO these options:
      //    interval: 500,
      //    backoff: false,
      //    max: 40,
      var options = {
        host: u.host,
        port: 80,
        path: u.pathname + u.search,
      };
      console.log('get ' + u.host);
      console.log(u.pathname);

      http.get(options, function(resp){
        var chunks = [];
        resp.on('data', function(chunk){
          // TODO translate relative paths?
          chunks.push(chunk);
        }).on('end', function() {
          var obj;
          try {
            obj  = JSON.parse(chunks.join(''));
          }
          catch (e) {
            console.log('Failed parsing json');
            cb(false);
            return;
          }

          // Test if polling is complete
          console.log(client.request_complete_predicate.toString());
          if (client.request_complete_predicate(obj)) {
            console.log('write on ' + data.event);
            cb(true, obj);
          }
          else {
            console.log('suppressing response due to no predicate match');
          }
        });
      }).on('error', function(e){
        console.log("Got error: " + e.message);
      }); // end http get
    }; // end dnode.get
}).listen(server);

server.listen(6857);
console.log('http://localhost:6857/');
