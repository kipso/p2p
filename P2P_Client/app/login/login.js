'use strict';

angular.module('myApp.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'login/login.html',
    controller: 'LoginCtrl'
  });
}])

.controller('LoginCtrl', ['$scope', '$http', '$location', 'HostService', function($scope, $http, $location, HostService) {
    console.log("Hitting login controller")
    $scope.isFormError = false;
    $scope.submit = function() {
        $scope.isFormError = false;
        $scope.formErrorText = "";
        $http.post(HostService.api + "login", $scope.loginForm)
        .then(function successCallBack(response){
            localStorage.setItem('token', response.data.token);
            $location.path('/').replace();
        }, function errorCallBack(response){
            $scope.isFormError = true;
            $scope.formErrorText = response.data.message;
        })      
    }
}]);