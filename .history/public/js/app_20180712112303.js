var myApp = angular.module("myApp", []);

myApp.controller("ChartController", function($scope, $http) {
  $scope.data = [];
  $http.get("http://localhost:5000/user").then(function(response) {
    $scope.data = response.data.hits.hits;
  });
});