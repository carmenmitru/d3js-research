var myApp = angular.module("myApp", []);

myApp.controller("ChartController", function($scope, $http) {
  $scope.data = [];
  $http.get("http://localhost:5000/user").then(function(response) {
    console.log(response.data);
  });
});
var dataset = [80, 100, 56, 120, 180, 30, 40, 120, 160];

var svgWidth = 500;
var svgHeight = 300;
var barPadding = 5;
var barWidth = svgWidth / dataset.length;

var svg = d3
  .select("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var barChart = svg
  .selectAll("rect")
  .data(dataset)
  .enter()
  .append("rect")
  .attr("y", function(d) {
    console.log(d + " ");
    console.log(svgHeight - d);
    return svgHeight - d;
  })
  .attr("height", function(d) {
    return d;
  })
  .attr("width", barWidth - barPadding)
  .attr("transform", function(d, i) {
    var translate = [barWidth * i, 0];
    console.log(translate);
    return "translate(" + translate + ")";
  });