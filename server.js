var express = require('express')
var http = require('http')
var io = require('socket.io')
var moment = require('moment')

var app = express()
app.use(express.static('./webpages'))
app.use('/angular', express.static('./node_modules/angular'))

var server = http.createServer(app).listen(8080)

io = io.listen(server)

let chronoStartTime = new Date()
let chronoValue = 0
let chronoStarted = false

console.log(chronoStartTime)
let time = setInterval(function () {
  if (chronoStarted === true) {
    const currDate = new Date()
    chronoValue = currDate - chronoStartTime
    
    var formatteddatestr = moment(chronoValue).format('mm:ss:SSS')
    io.sockets.emit('chronovalue', formatteddatestr)
  }
  // io.broadcast.emit('chronovalue', chronoValue)
}, 16)
// clearInterval(time);

io.sockets.on('connection', function (socket) {
  var messageToClient = {
    data: 'Connection with the server established'
  }

  socket.send(JSON.stringify(messageToClient))
  console.log('Socket.io Connection with the client established')

  socket.on('message', function (data) {
    data = JSON.parse(data)

    console.log(data)

    var ackToClient = {
      data: 'Server Received the message'
    }
    socket.send(JSON.stringify(ackToClient))
  })

  socket.on('startchrono', function (data) {
    chronoStartTime = new Date()
    chronoValue = 0
    chronoStarted = true
    io.sockets.emit('chrono-started')
  })

  socket.on('stopchrono', function (data) {
    chronoStarted = false

    var formatteddatestr = moment(chronoValue).format('mm:ss:SSS')
    io.sockets.emit('addentry', formatteddatestr)
    io.sockets.emit('chrono-stopped')
  })
})
