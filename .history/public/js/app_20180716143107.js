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
    //D3 js Margin
    var svg = d3.select("svg"),
      margin = { top: 20, right: 20, bottom: 30, left: 150 },
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom;

    //Create a tooltip
    var tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "toolTip");

    var x = d3
        .scaleBand()
        .rangeRound([0, width])
        .padding(0.1),
      y = d3.scaleLinear().rangeRound([height, 0]);

    var g = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Import data and set value for X and y AXIS

    d3.json("js/data.json", function(error, data) {
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
      var colours = d3.scaleOrdinal().range(["#6F257F", "#CA0D59"]); // Range Colors
      g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      g.append("g")
        .attr("class", "axis axis--y")
        .call(
          d3
            .axisLeft(y)
            .ticks(5)
            .tickFormat(function(d) {
              return parseInt(d / 1000) + "K";
            })
            .tickSizeInner([-width])
        )
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .attr("fill", "#5D6971")
        .text("Average House Price - (£)");

      g.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function(d) {
          return x(d.letter);
        })
        .attr("y", function(d) {
          return y(d.frequency);
        })
        .attr("width", x.bandwidth())
        .attr("height", function(d) {
          return height - y(d.frequency);
        })
        .attr("fill", function(d) {
          return colours(d.area);
        })
        .on("mousemove", function(d) {
          tooltip
            .style("left", d3.event.pageX - 50 + "px")
            .style("top", d3.event.pageY - 70 + "px")
            .style("display", "inline-block")
            .html(d.area + "<br>" + "£" + d.value);
        })
        .on("mouseout", function(d) {
          tooltip.style("display", "none");
        });
    });
    // d3.tsv(
    //   "js/data.tsv",
    //   function(d) {
    //     d.frequency = +d.frequency;
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
    //     var colours = d3.scaleOrdinal().range(["#6F257F", "#CA0D59"]); // Range Colors

    //     g.append("g")
    //       .attr("class", "axis axis--x")
    //       .attr("transform", "translate(0," + height + ")")
    //       .style("font-size", "25px") //To change the font size of texts
    //       .call(d3.axisBottom(x));

    //     g.append("g")
    //       .attr("class", "axis axis--y")
    //       .style("font-size", "15px") //To change the font size of texts
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
    //       .attr("fill", function(d) {
    //         return colours(d.letter);
    //       })
    //       .on("mousemove", function(d) {
    //         tooltip
    //           .style("left", d3.event.pageX - 50 + "px")
    //           .style("top", d3.event.pageY - 70 + "px")
    //           .style("display", "inline-block")
    //           .html(d.letter);
    //       })
    //       .on("mouseout", function(d) {
    //         tooltip.style("display", "none");
    //       })
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
});
