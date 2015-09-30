angular.module('greenfeels.auth', [])

.controller('AuthController', ['$scope', '$window', '$state', 'Auth',
  function($scope, $window, $state, Auth) {
    $scope.user = {};

    $scope.signin = function() {
      // calls sign in function from Auth factory to send POST request to api/users
      // receives token from server and stores in local storage
      // transitions state to home
      Auth.signin($scope.user)
      .then(function (token) {
        $window.localStorage.setItem('moodlet', token);
        $state.transitionTo('home');
      })
      .catch(function(error) {
        console.error(error);
      });
    };

    $scope.signup = function() {
      // calls sign up function from Auth factory to send POST request to api/users
      // receives token from server and stores in local storage
      // transitions state to home
      Auth.signup($scope.user)
      .then(function(token) {
        $window.localStorage.setItem('moodlet', token);
        $state.transitionTo('home');
      })
      .catch(function(error) {
        console.error(error);
      });
    };

    $scope.signout = function() {
    // remove token from localStorage and redirect to sign in state
      $window.localStorage.removeItem('moodlet');
      $state.transitionTo('signin');
    };

    $scope.changeState = function(toState) {
      $state.transitionTo(toState);
    };
}]);

