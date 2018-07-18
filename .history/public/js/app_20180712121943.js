var myApp = angular.module("myApp", ["ngLodash"]);
myApp.controller("ChartController", function($scope, $http, lodash) {
  console.log("ChartController");
  $scope.data = [];
  $http.get("http://localhost:5000/user").then(function(response) {
    $scope.data = response.data;
    console.log($scope.data);
  });
});
