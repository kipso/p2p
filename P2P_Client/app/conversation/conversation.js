'use strict';

angular.module('myApp.chat', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/conversation/:id', {
    templateUrl: 'conversation/conversation.html',
    controller: 'ChatCtrl'
  });
}])

.controller('ChatCtrl', ['$scope', '$http', '$location','$routeParams','HostService', function($scope, $http, $location, $routeParams, HostService) {
    var token = localStorage.getItem('token');
    $scope.receiverId =  $routeParams.id;
    $scope.userId;
    var messages;

    var connection = new WebSocket("ws://localhost:3000/"+token);
    connection.onopen = function (e){
      connection.send('ping');
    };
    connection.addEventListener('message', function (m) { 
        console.log(m.data); 
        messages.push(JSON.parse(m.data));
        meregeMessage(messages);
    });

    connection.onerror = function(err){
      console.log("Socket Error ",err);
    }

    function getMessage() {
      $http.get(HostService.api + "/coversation/"+$scope.receiverId)
      .then(function successCallBack(response){
          if(response.data.length == 0)
              $scope.isNone = true;
          else{
                messages = response.data.items;
                
                $scope.userId = response.data.userId;
                console.log("messages :",messages)
                meregeMessage(messages);
          }
      }, function errorCallBack(response){
      })
  }
    if(token == undefined)
        $location.path('/#/login').replace();
    else {
        $http.defaults.headers.common.Authorization = token;
        getMessage();
    }
    $scope.submitChat = function(){
        console.log($scope.inputMsg);
        var message = {};
        message.message = $scope.inputMsg;
        message.timestamp = new Date().toISOString();
        message.receiverId = $scope.receiverId;
        connection.send(message);
        postMessage(message);
        $scope.inputMsg = '';
    }

    function postMessage(messageObj){
        $http.post(HostService.api + "/send-message", messageObj)
        .then(function successCallBack(response){
            messageObj.userId = $scope.userId;
            messages.push(messageObj);
            meregeMessage(messages);
        }, function errorCallBack(response){
        })
    }
    function meregeMessage(){
        messages.sort(function(a, b){
            var keyA = new Date(a.timestamp),
                keyB = new Date(b.timestamp);
            // Compare the 2 dates
            if(keyA < keyB) return -1;
            if(keyA > keyB) return 1;
            return 0;
        });
        $scope.$applyAsync(function(){
            $scope.allMessages = messages
        });
    }
}]);