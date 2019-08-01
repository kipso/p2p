// 'use strict';

// Declare app level module which depends on views, and core components
angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.version',
  'myApp.login',  // login html controller
  'myApp.register', // 
  'myApp.users',  // 
  'myApp.chat'  //
])
.factory('HostService', function(){
  return {
    api: "http://localhost:3000/v1/",
    ws: "ws://localhost:3000"
  };
})
.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  
  // $locationProvider.html5Mode(true);
  $locationProvider.hashPrefix('');
  // $resourceProvider.defaults.stripTrailingSlashes = false;
  // $routeProvider.otherwise({redirectTo: '/'});
}]);
