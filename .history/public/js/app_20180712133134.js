var myApp = angular.module("myApp", ["ngLodash"]);
myApp.controller("ChartController", function($scope, $http, lodash) {
  console.log("ChartController");

  $http.get("http://localhost:5000/user").then(function(response) {
    // $scope.data = response.data;
    // console.log(response.data.hits.hits);
    $scope.data = response.data.hits.hits;
    $scope.charData2017 = 0;
    $scope.charData2018 = 0;
    lodash.forEach($scope.data, function(element) {
      var date = new Date(element._source.startTime);
      if (date.getFullYear() == 2017) {
        console.log("++");
        $scope.charData2017++;
      } else {
        $scope.charData2018++;
      }
    });
    $scope.draw();
  });

  $scope.draw = function() {
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
        return svgHeight - d;
      })
      .attr("height", function(d) {
        return d;
      })
      .attr("width", barWidth - barPadding)
      .attr("transform", function(d, i) {
        var translate = [barWidth * i, 0];

        return "translate(" + translate + ")";
      });
  };
});
