var myApp = angular.module("myApp", ["ngLodash"]);
myApp.controller("ChartController", function($scope, $http, lodash) {
  console.log("ChartController");

  $http.get("http://localhost:5000/user").then(function(response) {
    // $scope.data = response.data;
    // console.log(response.data.hits.hits);
    $scope.data = response.data.hits.hits;
  });

  lodash.forEach($scope.data, function(element) {
    console.log(element);
  });
});
