#!/usr/bin/node

var express = require('express');
var app = express(),
	server = require('http').createServer(app);

app
.get('/', function(req, res) {
	res.sendfile(__dirname + '/templates/index.html');
})
.use('/static/node', express.static(__dirname + '/src'));

var args = process.argv.slice(2);
server.listen(args.length == 0 ? 8080 : parseInt(args[0]));

