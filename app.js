var express = require('express');
var server = express.createServer();

var nowjs = require("now");
var everyone = nowjs.initialize(server);

everyone.now.logStuff = function(msg){
    console.log(msg);
}

server.use(express.static(__dirname + '/client'));

server.listen(8080);
