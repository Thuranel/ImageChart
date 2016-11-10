'use strict';

/**
 * @ngdoc function
 * @name imageChartApp.controller:IndexCtrl
 * @description
 * # IndexCtrl
 * Controller of the imageChartApp
 */
angular.module('imageChartApp')
  .controller('IndexCtrl', function ($scope, $location) {
      $scope.isActive = function (viewLocation) {
          return viewLocation === $location.path();
      };
  });
