#!/usr/bin/node

var express = require('express');
var app = express(),
	server = require('http').createServer(app);

app
.get('/', function(req, res) {
	res.sendfile(__dirname + '/templates/index.html');
})
.get('/edit', function(req, res) {
	res.sendfile(__dirname + '/templates/edit.html');
})
.use('/static/css', express.static(__dirname + '/static/css'))
.use('/static/img', express.static(__dirname + '/static/img'))
.use('/static/js', express.static(__dirname + '/static/js'))
.use('/static/node', express.static(__dirname + '/src'));

var args = process.argv.slice(2);
server.listen(args.length == 0 ? 8080 : parseInt(args[0]));

