var myApp = angular.module("myApp", ["ngLodash"]);
myApp.controller("ChartController", function($scope, $http, lodash) {
  console.log("ChartController");
  $scope.data = "test";
  $http.get("http://localhost:5000/user").then(function(response) {
    // $scope.data = response.data;
    console.log($response.data);
  });
});
