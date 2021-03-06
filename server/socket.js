var controllers = require('./db/controllers')


module.exports = function(app, PORT, express, routes){
  var io = require('socket.io').listen(app.listen(PORT));

  //socket stuff (to be abstracted)
  io.on('connection', function (socket) {
    routes(app, express, socket, io)
    socket.emit('playerDetails', {'videoId': 'TRrL5j3MIvo',
               'startSeconds': 5,
               'endSeconds': 60,
               'suggestedQuality': 'large'});

    socket.on('createRoom', function(data) {
      //maybe usefull for public rooms
      //joining room
      socket.join(data.room);
    })

    //hack to get room info on disconnect
    socket.onclose = function(reason){
      //emit to rooms here
      //acceess socket.adapter.sids[socket.id] to get all rooms for the socket
      var originId;
      var roomsToMessage = []
      for(var room in socket.adapter.sids[socket.id]){
        if(!isNaN(Number(room))){
          originId = Number(room)
        } else if(room[0] === "$"){
          roomsToMessage.push(room)
        }
      }

      //gives me all of the remaining rooms, get friends if key of friend Id send message of status offline
      var activeRoomsObj = socket.adapter.rooms

        controllers.getFriends(originId, function (err, response){
        if(err){
          serverLog.log("Error getting friends in router", err)
        } else {
          for(var i = 0; i < response.length; i++){
            roomsToMessage.push(response[i].id)          
          }
         
          for(var i = 0; i < roomsToMessage.length; i++){
            var targetRoom = roomsToMessage[i]
            if(activeRoomsObj[targetRoom]){
              io.to(targetRoom).emit('viewerDisconnect', originId)
              
            }
          }
        }
      })


      Object.getPrototypeOf(this).onclose.call(this,reason);
    }

    socket.on('leaveRoom', function(data){
      socket.to(data.roomId).emit('leavingRoom', data.originId)
      socket.leave(data.room)
    })

    socket.on('currentVideo', function(data){
      io.to(data.roomId).emit('currentVideo', data)
    })

    socket.on('joinRoom', function(data) {
      if(!(data.room in socket.adapter.sids[socket.id])){
        socket.join(data.room);
        socket.broadcast.to(data.room).emit('newViewer', data.userData);
      }
    });

    socket.on('getStatus', function(data){
      io.to(data.targetId).emit('getStatus', {originId: data.originId, currentStatus: data.currentStatus})
    })

    socket.on('sendingStatus', function(data){
      io.to(data.targetId).emit('sendingStatus', {
        currentStatus: data.currentStatus,
        originId: data.originId
      })
    })

    socket.on('newVideo', function (data){
      io.to(data.room).emit('newVideo', data.video)      
    })

    socket.on('removeVideo', function(data){
      io.to(data.room).emit('removeVideo',data.index)
    })

    socket.on('playVideoFromQueue', function(data){
      io.to(data.room).emit('playVideoFromQueue',data)
    })

    socket.on('newMessage', function (data) {
      io.to(data.room).emit('newMessage', data);
    });

    socket.on('newStreamMessage', function (data) {
      socket.broadcast.to(data.room).emit('newStreamMessage', data)
    });

    socket.on("currentRoomSubscribers", function (data){
      io.to(data.room).emit("currentRoomSubscribers", data)
    })

    socket.on('getPlayerState', function(data){
      socket.broadcast.to(data).emit('getPlayerState')
    })

    socket.on('clientPlayerStateChange', function(data) {
      socket.broadcast.to(data.room).emit('serverStateChange', data.stateChange);
    });

    //on hearing this event the server return sync data to all viewers
    socket.on('hostPlayerState', function (data) {
      socket.broadcast.to(data.room).emit('hostPlayerSync', data);
    });

  });
}