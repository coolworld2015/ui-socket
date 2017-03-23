var express = require("express");
var app = express();
 
app.get('/', function(req, res){
    res.sendFile(__dirname + '/chat.html');
});

app.use(express.static(__dirname + '/'));

var http = require('http').createServer(app);
var io = require('socket.io').listen(http);

http.listen(process.env.PORT || 3000, function () {
    console.log('Server is running on 3000');
});

io.sockets.on('connection', function (socket) {
    socket.emit('message', { message: 'Welcome to the chat' });
    socket.on('send', function (data) {
        io.sockets.emit('message', data);
    });
});