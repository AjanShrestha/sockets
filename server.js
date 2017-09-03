var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

// Sends current users to provided socket
function sendCurrentUsers(socket) {
    var info = clientInfo[socket.id];
    var users = [];

    if (typeof info === 'undefined') {
        return users;
    }

    Object.keys(clientInfo).forEach((socketId) => {
        var userInfo = clientInfo[socketId];

        if (info.room === userInfo.room) {
            users.push(userInfo.name);
        }
    });
    
    socket.emit('message', {
        name: 'System',
        text: 'Current users: ' + users.join(', '),
        timestamp: moment().valueOf()
    })
}

io.on('connection', (socket) => {
    console.log('User connected via socket.io');

    socket.on('disconnect', () => {
        var userData = clientInfo[socket.id];
        if (typeof userData !== 'undefined') {
            socket.leave(userData.room);
            io.to(userData.room).emit('message', {
                name: 'System',
                text: userData.name + ' has left!',
                timestamp: moment().valueOf()
            });
        }
        delete clientInfo[socket.id];
    });

    socket.on('joinRoom', (req) => {
        clientInfo[socket.id] = req;
        socket.join(req.room);
        socket.broadcast.to(req.room).emit('message', {
            name: 'System',
            text: req.name + ' has joined!',
            timestamp: moment().valueOf()
        });
    });

    socket.on('message', (message) => {
        console.log('Message received: ' + message.text);

        if (message.text === '@currentUsers') {
            sendCurrentUsers(socket);
        } else {
            message.timestamp = moment().valueOf();
            // io.emit everyone including sender
            io.to(clientInfo[socket.id].room).emit('message', message); // everyone except sender
        }
    });

    // timestamp property - JS timestamp (milliseconds)
    
    socket.emit('message', {
        name: 'System',
        text: 'Welcome to chat application!',
        timestamp: moment().valueOf()
    });
})

http.listen(PORT, () => {
    console.log('Server started');
})