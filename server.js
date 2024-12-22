import express from 'express'
import cors from 'cors'
import path from 'path'

import http from 'http'
import { Server } from 'socket.io'
const app=express()

app.use(cors())
const server=http.createServer(app)

const io = new Server(server, {
    cors: {
      origin: "*" ,
      methods: ["GET", "POST"],
 

    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    socket.on('message',(data)=>{
        console.log(data)
    })
    socket.on('send_message',data=>{
        io.emit('send_message',data)
    })
    socket.emit('test_from_server_to_client', {message:'hello world im server'})

  
  
    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });
const port=process.env.PORT || 3000
server.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});