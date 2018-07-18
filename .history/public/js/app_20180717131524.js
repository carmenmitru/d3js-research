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
    // $scope.drawBarChart($scope.charData2017, $scope.charData2018);
    $scope.drawGroupedBarChart($scope.charData2017, $scope.charData2018);
  });
  $scope.drawBarChart = function(charData2017, charData2018) {
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

      var formatPercent = d3.format(".0%");
      g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .attr("fill", "#5D6971")
        .text("Frequency");

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
          return colours(d.frequency);
        })
        .on("mousemove", function(d) {
          tooltip
            .style("left", d3.event.pageX - 50 + "px")
            .style("top", d3.event.pageY - 70 + "px")
            .style("display", "inline-block")
            .html(d.letter);
        })
        .on("mouseout", function(d) {
          tooltip.style("display", "none");
        });
    });
    var keys = ["Created", "Executing", "Graded"];
    var z = d3.scaleOrdinal().range(["#98abc5", "#f1c40f", "#27ae60"]);
    var legend = g
      .append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
      .selectAll("g")
      .data(keys)
      .enter()
      .append("g")
      .attr("transform", function(d, i) {
        return "translate(0," + i * 20 + ")";
      });
    legend
      .append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);
    legend
      .append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) {
        return d;
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
  $scope.drawGroupedBarChart = function(charData2017, charData2018) {
    var svg = d3.select("svg"),
      margin = { top: 20, right: 20, bottom: 30, left: 40 },
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom,
      g = svg
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x0 = d3
      .scaleBand()
      .rangeRound([0, width])
      .paddingInner(0.1);

    var x1 = d3.scaleBand().padding(0.05);

    var y = d3.scaleLinear().rangeRound([height, 0]);

    var z = d3
      .scaleOrdinal()
      .range([
        "#98abc5",
        "#8a89a6",
        "#7b6888",
        "#6b486b",
        "#a05d56",
        "#d0743c",
        "#ff8c00"
      ]);

    d3.csv(
      "js/data.csv",
      function(d, i, columns) {
        for (var i = 1, n = columns.length; i < n; ++i)
          d[columns[i]] = +d[columns[i]];
        return d;
      },
      function(error, data) {
        if (error) throw error;

        var keys = data.columns.slice(1);

        x0.domain(
          data.map(function(d) {
            return d.State;
          })
        );
        x1.domain(keys).rangeRound([0, x0.bandwidth()]);
        y.domain([
          0,
          d3.max(data, function(d) {
            return d3.max(keys, function(key) {
              return d[key];
            });
          })
        ]).nice();

        g.append("g")
          .selectAll("g")
          .data(data)
          .enter()
          .append("g")
          .attr("transform", function(d) {
            return "translate(" + x0(d.State) + ",0)";
          })
          .selectAll("rect")
          .data(function(d) {
            return keys.map(function(key) {
              return { key: key, value: d[key] };
            });
          })
          .enter()
          .append("rect")
          .attr("x", function(d) {
            return x1(d.key);
          })
          .attr("y", function(d) {
            return y(d.value);
          })
          .attr("width", x1.bandwidth())
          .attr("height", function(d) {
            return height - y(d.value);
          })
          .attr("fill", function(d) {
            return z(d.key);
          });

        g.append("g")
          .attr("class", "axis")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x0));

        g.append("g")
          .attr("class", "axis")
          .call(d3.axisLeft(y).ticks(null, "s"))
          .append("text")
          .attr("x", 2)
          .attr("y", y(y.ticks().pop()) + 0.5)
          .attr("dy", "0.32em")
          .attr("fill", "#000")
          .attr("font-weight", "bold")
          .attr("text-anchor", "start")
          .text("Population");

        var legend = g
          .append("g")
          .attr("font-family", "sans-serif")
          .attr("font-size", 10)
          .attr("text-anchor", "end")
          .selectAll("g")
          .data(keys.slice().reverse())
          .enter()
          .append("g")
          .attr("transform", function(d, i) {
            return "translate(0," + i * 20 + ")";
          });

        legend
          .append("rect")
          .attr("x", width - 19)
          .attr("width", 19)
          .attr("height", 19)
          .attr("fill", z);

        legend
          .append("text")
          .attr("x", width - 24)
          .attr("y", 9.5)
          .attr("dy", "0.32em")
          .text(function(d) {
            return d;
          });
      }
    );
  };
});