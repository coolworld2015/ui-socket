'use strict';

const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

var app = express();

app.use(express.static(__dirname + '/'));

const server = express()
	.use((req, res) => res.sendFile(INDEX) )
	.listen(PORT, () => console.log(`Listening on ${ PORT }`));

const webSocketServer = new SocketServer({ server });
var clients = {};

webSocketServer.on('connection', (ws) => {
	var id = +new Date();
	clients[id] = ws;
	console.log('new connection ' + id);
	
	var id = setInterval(function() {
		ws.send('still alive', function() {  })
	}, 30000)

	ws.on('close', function() {
		console.log('connection closed ' + id);
		delete clients[id];
	});

	ws.on('message', function(message) {
		console.log('message received ' + message);
		for (var key in clients) {
			clients[key].send(message);
		}
	});  
  
});
 