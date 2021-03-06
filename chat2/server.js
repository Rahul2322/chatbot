const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  getRoomUsers,
  userLeave

} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChatCord Bot';

//Run when client connects
io.on('connection',socket=>{
    socket.on('joinRoom',({username,room})=>{
        const user=userJoin(socket.id,username,room)
        socket.join(user.room)
     
         //to the single client/welcome current user
    socket.emit('message',formatMessage(botName,'welcome'))

    //Broadcast when a user connects .to everyone except the user/client who is just connecting
    socket.broadcast.to(user.room).emit('message',formatMessage(botName,` ${user.username} has joined the chat`))
     
    // Send rooms and users info 
    io.to(user.room).emit('roomUsers',{
        room:user.room,
        users:getRoomUsers(user.room)
    })
    
   })

    

   
    //Listen to the chat messages
    socket.on('chatMessage',msg=>{
        const user=getCurrentUser(socket.id)
        io.to(user.room).emit('message',formatMessage(user.username,msg))
    })

     //when a user disconnects
     socket.on('disconnect',()=>{
         const user = userLeave(socket.id)
         if(user){
            io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat`))
         }
         io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getRoomUsers(user.room)
        })
        
    })
})



const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));