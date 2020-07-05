var app = require('express')();
const express = require('express')
var server = require('http').Server(app);
var io = require('socket.io')(server);
app.use(express.static(__dirname + '/public'));
server.listen(process.env.PORT || 5000,() => { console.log("listening to port 3000") });
//server.listen(3000, () => { console.log("listening to port 3000") });



app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(socket) {
    socket.on('create', function(request) {
        request.gameId = getGame();
        // console.log(request);
        request.method = "create";
        socket.join(request.gameId);
        // console.dir(socket);
        // console.log(room + "create" + socket.id);
        // console.log(Object.keys(io.sockets.adapter.rooms))
        socket.emit("message", request);

    });

    socket.on('join', function(request) {
        // console.log(io.sockets.adapter.rooms);
        //console.log(request);

        //console.log("user joining the room" + numClients);
        // console.log(io.sockets.adapter.rooms[request.gameId].sockets[socket.id]);
        //console.log(io.sockets.adapter.rooms);
        if (io.sockets.adapter.rooms[request.gameId] != null) {
            numClients = io.sockets.adapter.rooms[request.gameId].length;
            if (io.sockets.adapter.rooms[request.gameId].sockets[socket.id]) {
                request.method = "full";
                request.message = "already exists";
                socket.emit('message', request);
                // console.log("already exists" + socket.id);

            } else if (numClients === 1) {
                socket.join(request.gameId);
                request.method = "joined";
                //console.log(request.method);
                socket.emit('message', request);
            } else {

            }
        } else {
            request.method = "full";
            request.message = "No game associated with gameId:\t" + request.gameId;
            socket.emit('message', request);
        }


    });
    socket.on("updateName", function(request) {
        request.method = "updateName";
        // console.log(request);
        socket.to(request.gameId).emit("message", request);
    });
    socket.on("play", function(request) {
        request.method = "playGame";
        socket.to(request.gameId).emit("message", request);
    });
    socket.on("updateSelect", function(request) {
        socket.to(request.gameId).emit("message", request);
    });
    socket.on("move", function(request) {
        socket.to(request.game.gameId).emit("message", request);
    });
    socket.on("kill", function(request) {
        socket.to(request.game.gameId).emit("message", request);
    });
    socket.on("win", function(request) {
        socket.to(request.game.gameId).emit("message", request);
    });
    socket.on("joined", function(request) {
        request.method = "join";
        // console.log(request);
        socket.to(request.gameId).emit("message", request);
    });
    socket.on('disconnect', function() {
        io.emit('user disconnected');
    });
});

function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

// then to call it, plus stitch in '4' in the third group
const getGame = () => (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
