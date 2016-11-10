'use strict';

/**
 * @ngdoc overview
 * @name imageChartApp
 * @description
 * # imageChartApp
 *
 * Main module of the application.
 */
var app = angular.module('imageChartApp', ["ngRoute"]);
app.config(function($routeProvider) {

    $routeProvider
        .when("/", {
            templateUrl : "views/main.html"
        })
        .when("/about", {
            templateUrl : "views/about.html"
        })
        .when("/contact", {
            templateUrl : "views/contact.html"
        });

});
