const io = require('socket.io-client')

let socket = io.connect('http://localhost:8124', {reconnect: true, query:'foo=bar'})

let chronoValue = 0

socket.on('connect', function () {
})

socket.on('chronovalue', function (value) {
  chronoValue = value
  console.log(chronoValue)
})

