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
                "avatar_size": 50,
                "patchVersion": "6.19.1"
            };

            //Set base chart
            var margin = {top: 20, right: 20, bottom: 30, left: 40},
                width = 960 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom;

            var svg = d3.select("#chart").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var container = svg.append("g");

            //Load data
            d3.json("data.json", function (error, data) {
                if (error) throw error;

                var x = d3.scale.linear()
                    .range([0, width])
                    .domain([d3.min(data, function (d) {
                        return d.general.winPercent - 1.5;
                    }),
                        d3.max(data, function (d) {
                            return d.general.winPercent + 0.5;
                        })]);

                var y = d3.scale.linear()
                    .range([height, 0])
                    .domain([d3.min(data, function (d) {
                        return d.general.playPercent - 1.5;
                    }),
                        d3.max(data, function (d) {
                            return d.general.playPercent + 0.5;
                        })]);

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
                container.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis)
                    .append("text")
                    .attr("class", "label")
                    .attr("x", width)
                    .attr("y", -6)
                    .style("text-anchor", "end")
                    .text("Win (%)");

                container.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .append("text")
                    .attr("class", "label")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("Play (%)");

                //Load tip
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

                container.call(tip);

                var defs = svg.append("defs").attr("id", "imgdefs");

                data.forEach(function (d) {
                    var champPattern = defs.append("pattern")
                        .attr("id", "champ_avatar_" + d.key + d.role)
                        .attr("height", 1)
                        .attr("width", 1)
                        .attr("x", "0")
                        .attr("y", "0")
                        .attr("class", d.role);

                    champPattern.append("image")
                        .attr("x", 0)
                        .attr("y", 0)
                        .attr("height", config.avatar_size)
                        .attr("width", config.avatar_size)
                        .attr("xlink:href", "//ddragon.leagueoflegends.com/cdn/" + config.patchVersion + "/img/champion/" + d.key + ".png");
                });

                //Place Data
                svg.selectAll(".dot")
                    .data(data)
                    .enter().append("circle")
                    .attr("r", config.avatar_size / 2)
                    .attr("cx", function (d) {
                        return x(d.general.winPercent);
                    })
                    .attr("cy", function (d) {
                        return y(d.general.playPercent);
                    })
                    .style("fill", function (d) {
                        return "url(#champ_avatar_" + d.key + d.role + ")";
                    })
                    .style("stroke", "red")
                    .attr("class", function(d){
                        return d.role;
                    })
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide);


                //Load zoom
                var zoom = d3.behavior.zoom()
                    .scaleExtent([1, 20])
                    .on("zoom", zoomed);

                function zoomed() {
                    //container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
                    //d3.selectAll("circle").attr("r", 5);
                    //d3.selectAll("image")
                    //    .attr("height", 10)
                    //    .attr("width", 10);
                }

                svg.call(zoom);

            });
        };

        $scope.changeVisibility = function(className){
            $('.' + className).toggle();
        }
    });
