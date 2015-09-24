var home = angular.module("greenfeels.home");

home.controller("HomeController", ["$scope", "Prompts", function($scope, Prompts) {
  $scope.prompt = Prompts.getFirstPrompt();
}]);