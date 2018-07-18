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
        $scope.charData2017++;
      } else {
        $scope.charData2018++;
      }
    });
    console.log($scope.charData2017, $scope.charData2018);
    $scope.draw($scope.charData2017, $scope.charData2018);
  });
  $scope.draw = function(charData2017, charData2018) {
    var svg = d3.select("svg"),
      margin = { top: 20, right: 20, bottom: 30, left: 150 },
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom;

    var x = d3
        .scaleBand()
        .rangeRound([0, width])
        .padding(0.1),
      y = d3.scaleLinear().rangeRound([height, 0]);

    var g = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.tsv(
      "js/data.tsv",
      function(d) {
        d.frequency = +d.frequency;
        return d;
      },
      function(error, data) {
        if (error) throw error;

        x.domain(
          data.map(function(d) {
            return d.letter;
          })
        );
        y.domain([
          0,
          d3.max(data, function(d) {
            return d.frequency;
          })
        ]);

        g.append("g")
          .attr("class", "axis axis--x")
          .attr("transform", "translate(0," + height + ")")
          .style("font-size", "25px") //To change the font size of texts
          .call(d3.axisBottom(x));

        g.append("g")
          .attr("class", "axis axis--y")
          .style("font-size", "25px") //To change the font size of texts
          .call(d3.axisLeft(y).ticks(10, "%"))
          .append("text")
          .attr("transform", "rotate(-90)")

          .attr("y", 6)
          .attr("dy", "0.71em")
          .attr("text-anchor", "end")
          .text("Frequency");

        g.selectAll(".bar")
          .data(data)
          .enter()
          .append("rect")
          .attr("class", "bar")
          .attr("x", function(d) {
            return x(d.letter);
          })
          .attr("y", function(d) {
            return y(d.frequency);
          })
          .attr("width", x.bandwidth())
          .attr("height", function(d) {
            return height - y(d.frequency);
          });
      }
    );
  };
});
