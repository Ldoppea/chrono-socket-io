var teachMcApp = angular.module('ChronoApp', [])

teachMcApp.factory('socket', function ($rootScope) {
  var socket = io.connect('/')

  socket.on('connect', function () {
    socket.emit('room', 'browser')
  })

  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments
        $rootScope.$apply(function () {
          callback.apply(socket, args)
        })
      })
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args)
          }
        })
      })
    }
  }
})

teachMcApp.controller('TeachMcController', function ($scope, socket) {
  // data exposed to HTML
  $scope.chronoValue = 0
  $scope.entries = []
  $scope.isChronoStarted = false

  // methods exposed to HTML
  $scope.startChrono = function () {
    socket.emit('startchrono')
  }
  $scope.stopChrono = function () {
    socket.emit('stopchrono')
  }

  socket.on('chronovalue', function (value) {
    $scope.chronoValue = value
  })

  socket.on('addentry', function (value) {
    $scope.entries.push(value)
  })

  socket.on('chrono-started', function (value) {
    $scope.isChronoStarted = true
  })
  socket.on('chrono-stopped', function (value) {
    $scope.isChronoStarted = false
  })
})
