'use strict';

/**
 * @ngdoc function
 * @name imageChartApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the imageChartApp
 */
angular.module('imageChartApp')
  .controller('AboutCtrl', function ($scope, $location, $anchorScroll) {
    $scope.scrollTo = function(id) {
      $location.hash(id);
      $anchorScroll();
    }
  });
