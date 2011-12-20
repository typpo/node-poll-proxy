var app = require('express').createServer()
    , io = require('socket.io').listen(app)
    , url = require('url')
    , http = require('http')

app.listen(8080);

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

io.sockets.on('connection', function(socket) {
  socket.on('get', function(data) {


  });
});
