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
