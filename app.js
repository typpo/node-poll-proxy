var express = require('express')
    , app = express.createServer()
    , io = require('socket.io').listen(app)
    , url = require('url')
    , http = require('http')
    , dnode = require('dnode')

app.listen(8080);

// Static directory setup
app.configure('development', function(){
  app.use(express.static(__dirname + '/client'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

// Dnode setup
var server = dnode(function(client){
  console.log(client);
  this.get = function(data, cb) {
    cb(true, client.test());
    return;
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
  } // end dnode.get
}).listen(app); // end server dnode creation


/*
io.sockets.on('connection', function(socket) {
  // data:
  // - url: url to request
  // - channel: event to trigger on client
  // fn: predicate that says whether or not we want to pass on poll response
  socket.on('get', function(data) {

    console.log('X');
    console.log(data);
    console.log(data());
    console.log('X');
    return;

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
          socket.emit(data.event, false);
          return;
        }
        console.log(data.fn);
        if (data.fn(obj)) {
          //socket.emit(data.event, true, obj);
          console.log('write on ' + data.event);
        }
      });
    }).on('error', function(e){
      console.log("Got error: " + e.message);
    })
  });
});

// For testing
app.get('/*', function(req, res) {
  u = url.parse(req.params[0]);
  var options = {
    host: u.host,
    port: 80,
    path: u.pathname,
  };
  http.get(options, function(resp){
    var chunks = [];
    resp.on('data', function(chunk){
      // TODO translate relative paths?
      chunks.push(chunk);
    }).on('end', function() {
      res.send(chunks.join(''), {'Content-Type': 'text/html'}, 200);
    });
  }).on('error', function(e){
    console.log("Got error: " + e.message);
  })
});

*/
