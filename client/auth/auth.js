angular.module('greenfeels.auth', [])

.controller('AuthController', ['$scope', '$window', '$location', 'Auth',
  function($scope, $window, $location, Auth) {
    $scope.user = {};

    $scope.signin = function() {
      Auth.signin($scope.user)
      .then(function() {

      })
      .catch(function(error) {
        console.error(error);
      });
    };

    $scope.signup = function() {
      Auth.signup($scope.user)
      .then(function() {

      })
      .catch(function(error) {
        console.error(error);
      });
    };

    $scope.signout = function() {
    // create logout function here - use Auth controller with nav view
      // Auth.signout

    };
}]);

