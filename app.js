var app = require('express').createServer()
    , io = require('socket.io').listen(app)
    , url = require('url')
    , http = require('http')

app.listen(8080);

io.sockets.on('connection', function(socket) {
  // data:
  // - url: url to request
  // - channel: event to trigger on client
  // fn: predicate that says whether or not we want to pass on poll response
  socket.on('get', function(data, fn) {
    u = url.parse(data.url);
    //TODO these options:
//    interval: 500,
//    backoff: false,
//    max: 40,
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
        var obj = JSON.parse(chunks.join(''));
        if (fn(obj)) {
          socket.emit(data.event, true, obj);
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

