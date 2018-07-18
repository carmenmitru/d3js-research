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

    d3.json("js/ex1.json", function(error, data) {
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
    var margin = { top: 10, right: 40, bottom: 30, left: 40 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    var x0 = d3.scale.ordinal().rangeRoundBands([0, width], 0.1);

    var x1 = d3.scale.ordinal();

    var y = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg
      .axis()
      .scale(x0)
      .tickSize(0)
      .orient("bottom");

    var yAxis = d3.svg
      .axis()
      .scale(y)
      .orient("left");

    var color = d3.scale.ordinal().range(["#92c5de", "#92c5de", "#0571b0"]);

    var svg = d3
      .select("body")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.json("js/ex1.json", function(error, data) {
      var categoriesNames = data.map(function(d) {
        return d.categorie;
      });

      var rateNames = data[0].values.map(function(d) {
        return d.state;
      });

      x0.domain(categoriesNames);
      x1.domain(rateNames).rangeRoundBands([0, x0.rangeBand()]);
      y.domain([
        0,
        d3.max(data, function(categorie) {
          return d3.max(categorie.values, function(d) {
            return d.value;
          });
        })
      ]);

      svg
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      svg
        .append("g")
        .attr("class", "y axis")
        .style("opacity", "0")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .style("font-weight", "bold")
        .text("Exams");

      svg
        .select(".y")
        .transition()
        .duration(500)
        .delay(1300)
        .style("opacity", "1");

      var slice = svg
        .selectAll(".slice")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "g")
        .attr("transform", function(d) {
          return "translate(" + x0(d.categorie) + ",0)";
        });

      slice
        .selectAll("rect")
        .data(function(d) {
          return d.values;
        })
        .enter()
        .append("rect")
        .attr("width", x1.rangeBand())
        .attr("x", function(d) {
          return x1(d.state);
        })
        .style("fill", function(d) {
          return color(d.state);
        })
        .attr("y", function(d) {
          return y(0);
        })
        .attr("height", function(d) {
          return height - y(0);
        })
        .on("mouseover", function(d) {
          d3.select(this).style("fill", d3.rgb(color(d.state)).darker(2));
        })
        .on("mouseout", function(d) {
          d3.select(this).style("fill", color(d.state));
        });

      slice
        .selectAll("rect")
        .transition()
        .delay(function(d) {
          return Math.random() * 1000;
        })
        .duration(1000)
        .attr("y", function(d) {
          return y(d.value);
        })
        .attr("height", function(d) {
          return height - y(d.value);
        });

      //Legend
      var legend = svg
        .selectAll(".legend")
        .data(
          data[0].values
            .map(function(d) {
              return d.state;
            })
            .reverse()
        )
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) {
          return "translate(0," + i * 20 + ")";
        })
        .style("opacity", "0");

      legend
        .append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d) {
          return color(d);
        });

      legend
        .append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) {
          return d;
        });

      legend
        .transition()
        .duration(500)
        .delay(function(d, i) {
          return 1300 + 100 * i;
        })
        .style("opacity", "1");
    });
  };
});
