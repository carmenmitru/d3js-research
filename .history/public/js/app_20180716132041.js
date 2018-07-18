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
    var margin = { top: 20, right: 20, bottom: 70, left: 40 },
      width = 600 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

    // set the ranges
    var x = d3.scale.ordinal().rangeRoundBands([0, width], 0.05);

    var y = d3.scale.linear().range([height, 0]);

    // define the axis
    var xAxis = d3.svg
      .axis()
      .scale(x)
      .orient("bottom");

    var yAxis = d3.svg
      .axis()
      .scale(y)
      .orient("left")
      .ticks(10);

    // add the SVG element
    var svg = d3
      .select("body")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.json("js/data.json", function(error, data) {
      data.forEach(function(d) {
        d.Letter = d.Letter;
        d.Freq = +d.Freq;
      });

      // scale the range of the data
      x.domain(
        data.map(function(d) {
          return d.Letter;
        })
      );
      y.domain([
        0,
        d3.max(data, function(d) {
          return d.Freq;
        })
      ]);

      // add axis
      svg
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)");

      svg
        .append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 5)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Frequency");

      // Add bar chart
      svg
        .selectAll("bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) {
          return x(d.Letter);
        })
        .attr("width", x.rangeBand())
        .attr("y", function(d) {
          return y(d.Freq);
        })
        .attr("height", function(d) {
          return height - y(d.Freq);
        });
    });
    // d3.tsv(
    //   "js/data.tsv",
    //   function(d) {
    //     console.log(d);
    //     d.frequency = +d.frequency; // + converts string to number
    //     return d;
    //   },
    //   function(error, data) {
    //     if (error) throw error;

    //     x.domain(
    //       data.map(function(d) {
    //         return d.letter;
    //       })
    //     );
    //     y.domain([
    //       0,
    //       d3.max(data, function(d) {
    //         return d.frequency;
    //       })
    //     ]);

    //     g.append("g")
    //       .attr("class", "axis axis--x")
    //       .attr("transform", "translate(0," + height + ")")
    //       .call(d3.axisBottom(x)); // text will be below the x axis

    //     g.append("g")
    //       .attr("class", "axis axis--y")
    //       .call(d3.axisLeft(y).ticks(10, "%"))
    //       .append("text")
    //       .attr("transform", "rotate(-90)")
    //       .attr("y", 6)
    //       .attr("dy", "0.71em")
    //       .attr("text-anchor", "end")
    //       .text("Frequency");

    //     g.selectAll(".bar")
    //       .data(data)
    //       .enter()
    //       .append("rect")
    //       .attr("class", "bar")
    //       .attr("x", function(d) {
    //         return x(d.letter);
    //       })
    //       .attr("y", function(d) {
    //         return y(d.frequency);
    //       })
    //       .attr("width", x.bandwidth())
    //       .attr("height", function(d) {
    //         return height - y(d.frequency);
    //       });
    //   }
    // );
  };
  //   $scope.draw = function(charData2017, charData2018) {
  //     var dataset = [];
  //     dataset.push(charData2017);
  //     dataset.push(charData2018);

  //     var svgWidth = 500;
  //     var svgHeight = 200;
  //     var barPadding = 5;
  //     var barWidth = svgWidth / dataset.length;

  //     var svg = d3
  //       .select("svg")
  //       .attr("width", svgWidth)
  //       .attr("height", svgHeight);

  //     var barChart = svg
  //       .selectAll("rect")
  //       .data(dataset)
  //       .enter()
  //       .append("rect")
  //       .attr("y", function(d) {
  //         return svgHeight - d;
  //       })
  //       .attr("height", function(d) {
  //         return d;
  //       })
  //       .attr("width", barWidth - barPadding)
  //       .attr("transform", function(d, i) {
  //         var translate = [barWidth * i, 0];

  //         return "translate(" + translate + ")";
  //       });
  //   };
});
