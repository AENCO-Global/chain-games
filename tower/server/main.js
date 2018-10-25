var http = require('http'),
    fs = require('fs');
//    env = require('config.js');

//===============================================================================================
//  HTTP Web landing page
//
//-----------------------------------------------------------------------------------------------
var app = http.createServer(function (request, response) {
    //----------------------------------------------------------------------------
    //  HTTP Web landing page
    var filePath = '.' + request.url;
    if (filePath == './') {
        filePath = './client.html';
    }
    fs.readFile(filePath,  (err, content) =>  {
    if (err) {
        if (err.code === 'ENOENT') {
            console.error('myfile does not exist',err);
            response.writeHead(404);
            response.end();
            return;
        }
        throw err;
    }
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end(content.toString(), 'utf-8');
    });  /*  */
    //  End HTTP Web landing page
    //-----------------------------------------------------------------------------
}).listen(8001);
//-----------------------------------------------------------------------------------------------
//  END of Server set up
//===============================================================================================

//===============================================================================================
//  Connection handler for all income socket connetions
//
//-----------------------------------------------------------------------------------------------
var io = require('socket.io').listen(app),
    playerMin = 2, /* Minimum players needed to start a game */
    playerMax = 3; /* Maximum players that can join a game, any more will be spectator */
var lastMessages = [];

io.on('connection', function(socket) {
    socket.join(socket.handshake.query.roomId);  //join the room defined by the client
    gameStatus(socket, "connect");
    // then send the current play state if there is one to the connecting player.
    //  socket.emit('message', lastMessages); // Connecting player only
 
    socket.on('client', function(data) {
        console.log("Data : ", data, socket.handshake.query.roomId);
        // Seperate the move types here. if move, if synch, if winner
        socket.broadcast.to(socket.handshake.query.roomId).emit('server', data );       // broadcast to all but the sender.
    });

    socket.on('disconnect', function() {     
        console.log("Socket disconnected.");
        gameStatus(socket,"disconnect");
    });
});

function gameStatus(socket,type){
    var roomCount = io.sockets.adapter.rooms[socket.handshake.query.roomId].length;
    console.log("Users connected are : ", roomCount);
    if (roomCount < playerMin){ // Wait mode for all players
        message = {"type":type,"status":"Waiting","count":roomCount};
        console.log("Sending : ", message);
        io.in(socket.handshake.query.roomId).emit('server', message); // All players
    } else if (roomCount > playerMax) { // Spectate mode for the connecting player
        message = {"type":type,"status":"spectate","count":roomCount};
        console.log("Sending : ", message);
        socket.emit('server', message); // Connecting player only
    } else {  // Start mode for all players
        message = {"type":type,"status":"start","count":roomCount};
        console.log("Sending : ", message);
        io.in(socket.handshake.query.roomId).emit('server', message); // All players
    }   
};

//-----------------------------------------------------------------------------------------------
// END  Connection handler for all income socket connetions
//===============================================================================================

//================================================
//  Usefull notes for node js and this script.
// -----------------------------------------------
// sending to sender-client only
// socket.emit('message', "this is a test");

 // sending to all clients, include sender
// io.emit('message', "this is a test");

 // sending to all clients except sender
 //socket.broadcast.emit('message', "this is a test");

 // sending to all clients in 'game' room(channel) except sender
 //socket.broadcast.to('game').emit('message', 'nice game');

 // sending to all clients in 'game' room(channel), include sender
 //io.in('game').emit('message', 'cool game');

 // sending to sender client, only if they are in 'game' room(channel)
 //socket.to('game').emit('message', 'enjoy the game');

 // sending to all clients in namespace 'myNamespace', include sender
// io.of('myNamespace').emit('message', 'gg');

 // sending to individual socketid
// socket.broadcast.to(socketid).emit('message', 'for your eyes only');

//================================================
//  END Usefull notes for node js and this script.
// -----------------------------------------------
