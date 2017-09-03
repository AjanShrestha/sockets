var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
    console.log('User connected via socket.io');

    socket.on('message', (message) => {
        console.log('Message received: ' + message.text);

        message.timestamp = moment().valueOf();
        // io.emit everyone including sender
        io.emit('message', message); // everyone except sender
    });

    // timestamp property - JS timestamp (milliseconds)
    
    socket.emit('message', {
        text: 'Welcome to chat application!',
        timestamp: moment().valueOf()
    });
})

http.listen(PORT, () => {
    console.log('Server started');
})