angular.module('greenfeels.auth', [])

.controller('AuthController', ['$scope', '$window', '$state', 'Auth', 'Spinner',
  function($scope, $window, $state, Auth, Spinner) {

    $scope.user = {};
    $scope.name = $window.localStorage.getItem('moodlet.username');
    $scope.signin = function() {
      //starts spinner
      var spinner = Spinner.create();
      spinner.spin(document.querySelector('.spinner'));
      // calls sign in function from Auth factory to send POST request to api/users
      // receives token from server and stores in local storage
      // transitions state to home
      Auth.signin($scope.user)
        .then(function (token) {
          //stops spinner
          spinner.stop();
          // Store session token for access to secured endpoints
          $window.localStorage.setItem('moodlet', token);
          // Store plaintext username for use as a URL parameter in ajax requests
          $window.localStorage.setItem('moodlet.username', $scope.user.username);
          $state.transitionTo('home');
        })
        .catch(function(error) {
          spinner.stop();
          console.error(error);
          $scope.error = error.data;
        });
      };

    $scope.signup = function() {
      //starts spinner
      var spinner = Spinner.create();
      spinner.spin(document.querySelector('.spinner'));
      // calls sign up function from Auth factory to send POST request to api/users
      // receives token from server and stores in local storage
      // transitions state to home
      Auth.signup($scope.user)
        .then(function(token) {
          //stops spinner
            spinner.stop();
          // Same actions as signin
          $window.localStorage.setItem('moodlet', token);
          $window.localStorage.setItem('moodlet.username', $scope.user.username);
          $state.transitionTo('home');
        })
        .catch(function(error) {
          spinner.stop();
          console.error(error);
          $scope.error = error.data;
        });
    };

    $scope.signout = function() {
      // remove token from localStorage and redirect to sign in state
      $window.localStorage.removeItem('moodlet');
      // Clear cached username
      $window.localStorage.removeItem('moodlet.username');
      $state.transitionTo('signin');
    };

    $scope.changeState = function(toState) {
      $state.transitionTo(toState);
    };
}]);

