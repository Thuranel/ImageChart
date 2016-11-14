'use strict';

/**
 * @ngdoc function
 * @name imageChartApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the imageChartApp
 */
angular.module('imageChartApp')
    .controller('MainCtrl', function ($scope) {

        $scope.init = function() {

            //Initialize variables
            var config = {
                avatar_size : 50,
                patchVersion : "6.20.1",
                chart_dimension : {
                    width : 960,
                    height : 500
                },
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 30,
                    left: 40
                },
                domain_margin : 2,
                max_zoom : 10
            };

            //Set base chart
            var margin = config.margin,
                width = config.chart_dimension.width - margin.left - margin.right,
                height = config.chart_dimension.height - margin.top - margin.bottom;

            var svg = d3.select("#chart").append("svg")
                .attr("viewBox", "0 0 " + (config.chart_dimension.width) + " " + (config.chart_dimension.height))
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            //appends a rectangle to the svg to make the zoom work
            var rect = svg.append("svg:rect")
                .attr("width", width)
                .attr("height", height)
                .style("fill", "none")
                .style("pointer-events", "all");

            //appends a clip to the svg to make sure the points are restricted to the chart rectangle and not the svg
            var clip = svg.append("defs").append("svg:clipPath")
                .attr("id", "clip")
                .append("svg:rect")
                .attr("id", "clip-rect")
                .attr("x", "0")
                .attr("y", "0")
                .attr('width', width)
                .attr('height', height);

            //Load data
            d3.json("data.json", function (error, data) {
                if (error) throw error;

                var xMin = d3.min(data, function (d) {
                    return d.general.winPercent;
                });

                var xMax = d3.max(data, function (d) {
                    return d.general.winPercent;
                });

                var yMin = d3.min(data, function (d) {
                    return d.general.playPercent;
                });

                var yMax = d3.max(data, function (d) {
                    return d.general.playPercent;
                });

                var x = d3.scale.linear()
                    .range([0, width])
                    .domain([ xMin - config.domain_margin, xMax + config.domain_margin]);

                var y = d3.scale.linear()
                    .range([height, 0])
                    .domain([ yMin - config.domain_margin, yMax + config.domain_margin]);

                //Set Axis
                var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom")
                    .ticks(20)
                    .innerTickSize(-height)
                    .outerTickSize(0)
                    .tickPadding(10);

                var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left")
                    .ticks(15)
                    .innerTickSize(-width)
                    .outerTickSize(0)
                    .tickPadding(10);

                //Load axis
                loadXaxis(svg, xAxis, height, width);

                loadYaxis(svg, yAxis);

                svg.call(tip);

                loadImagePatterns(svg, data, config);

                // setup stroke color
                var color = d3.scale.category10();

                //Place Data
                svg.append("g").attr("clip-path", "url(#clip)")
                    .selectAll(".dot")
                    .data(data)
                    .enter().append("circle")
                    .attr("id", "chartPoint")
                    .attr("r", config.avatar_size/2)
                    .attr("transform", transform)
                    .style("fill", function (d) {
                        return "url(#champ_avatar_" + d.key + d.role + ")";
                    })
                    .style("stroke", function(d){
                        return color(d.role);
                    })
                    .style("stroke-width", "2.5")
                    .attr("class", function(d){
                        return d.role;
                    })
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide);

                changeBoxColor(color);


                var zoom = d3.behavior.zoom()
                    .x(x)
                    .y(y)
                    .scaleExtent([1, config.max_zoom])
                    .on("zoom", zoomed);

                svg.call(zoom);

                function zoomed() {
                    var trans = zoom.translate(),
                        scale = zoom.scale();

                    //limit drag
                    var tx = Math.min(0, Math.max(width * (1 - scale), trans[0]));
                    var ty = Math.min(0, Math.max(height * (1 - scale), trans[1]));

                    zoom.translate([tx, ty]);

                    svg.select(".x.axis").call(xAxis);
                    svg.select(".y.axis").call(yAxis);
                    svg.selectAll("#chartPoint")
                        .attr("transform", transform);
                }

                function transform(d) {
                    return "translate(" + x(d.general.winPercent) +"," + y(d.general.playPercent)+")";
                }

            });
        };

        $scope.changeVisibility = function(className){
            $('.' + className).toggle();
        };

        var loadXaxis = function(svg, xAxis, height, width){
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                .append("text")
                .attr("class", "label")
                .attr("x", width)
                .attr("y", -6)
                .style("text-anchor", "end")
                .text("Win (%)");
        };

        var loadYaxis = function(svg, yAxis){
            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("class", "label")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Play (%)");
        };

        //load tip
        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function (d) {
                return "<strong> " + d.key + " " + d.role + " </strong>" +
                    "<br>" +
                    "<strong>Win %:</strong> <span>" + d.general.winPercent + "</span> " +
                    "<br>" +
                    "<strong>Play %:</strong> <span>" + d.general.playPercent + "</span> ";
            });

        var changeBoxColor = function(color){
            d3.selectAll(".roleBox")
                .data(color.domain())
                .style("color", color);
        };

        //Load images into patterns to use later in circle data
        var loadImagePatterns = function(svg, data, config){
            var defs = svg.append("defs").attr("id", "imgdefs");

            data.forEach(function (d) {
                var champPattern = defs.append("pattern")
                    .attr("id", "champ_avatar_" + d.key + d.role)
                    .attr("height", 1)
                    .attr("width", 1)
                    .attr("x", "0")
                    .attr("y", "0");

                champPattern.append("image")
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("height", config.avatar_size)
                    .attr("width", config.avatar_size)
                    .attr("xlink:href", "//ddragon.leagueoflegends.com/cdn/" + config.patchVersion + "/img/champion/" + d.key + ".png");
            });
        };
    });
