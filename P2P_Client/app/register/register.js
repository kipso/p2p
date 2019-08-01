// 'use strict';
angular.module('myApp.register', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/signup', {
    templateUrl: 'register/register.html',
    controller: 'RegisterCtrl'
  });
}])

.controller('RegisterCtrl', ['$scope', '$http', '$location', 'HostService', function($scope, $http, $location, HostService) {
    $scope.isFormError = false;

    function validateForm(formObj) {
        // isValidPassword
        var passwordRegex = /^[a-zA-Z0-9!@#\$%\^&]+$/
        if(formObj.password != formObj.confirmPassword ){
            return {
                isValidPassword : false,
                errorMessage : "Passwords does not match. Please retry again"
            };
        }
        else if((formObj.password.length < 6 || formObj.password.length > 128) || !passwordRegex.test(String(formObj.password))){
            return {
                isValidPassword : false,
                errorMessage : "Password length shoud be in the range 6-128 and password can contain only number, alphabets, special characters"

            };
        }
        // var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        // isValidEmail = re.test(String(formObj.userName).toLowerCase());
        return {
            isValidPassword: true,
            errorMessage: ""
        } 
    }
    $scope.submit = function () {
        $scope.isFormError = false;
        $scope.formErrorText = "";
        var validationObj = validateForm($scope.registerForm);
        if (validationObj.isValidPassword){
            $http.post(HostService.api + "registration", $scope.registerForm)
            .then(function successCallBack(response) {
                localStorage.setItem('token', response.data.token);
                $location.path('/').replace();
            }, function errorCallBack(response){
                $scope.isFormError = true;
                $scope.formErrorText = response.data.error.message;
            })
        }
        else {
            $scope.formErrorText = validationObj.errorMessage;
            $scope.isFormError = true;
        }
    }
}]);