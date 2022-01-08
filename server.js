const mongoose = require('mongoose')
require('dotenv').config()
const Msg = require('./models/messages')
const io = require('socket.io')(3000, {
    cors:{origin: "*",},
})

//baza danych
mongoose.connect("mongodb+srv://"+ process.env.DB_USER +":"+ process.env.DB_PASS +"@chat-app.x3tfc.mongodb.net/"+ process.env.DB_NAME +"?retryWrites=true&w=majority");
mongoose.connection.on("error", (err) => {
    console.log("Mongoose connection ERROR: " + err.message)
}) 
mongoose.connection.once('open', () =>{
    console.log("MongoDB connected")
})

io.on('connection', (socket) => {
    Msg.find().then(result =>{
        socket.emit('output-messages', result)
    })
    console.log('a user connected');
    socket.emit('message', 'Hello world')
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
    socket.on('chatmessage', msg=> {
        const message = new Msg({msg:msg})
        message.save().then(()=>{
            io.emit('message', msg)
        })
    })
  });