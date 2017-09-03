var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
    console.log('User connected via socket.io');

    socket.on('message', (message) => {
        console.log('Message received: ' + message.text);

        // io.emit everyone including sender
        socket.broadcast.emit('message', message); // everyone except sender
    });

    socket.emit('message', {
        text: 'Welcome to chat application!'
    });
})

http.listen(PORT, () => {
    console.log('Server started');
})