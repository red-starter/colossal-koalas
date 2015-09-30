var app = angular.module('greenfeels',
  ['greenfeels.services', 'greenfeels.home', 'greenfeels.journal', 'greenfeels.auth','greenfeels.graph','ui.router']); // need to add greenfeels.graph when ready

app.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('home', {
        // Parent state of home; load home.html, set controller, use initial state
        views: {
          url: '/',

          nav: {
            templateUrl: './nav/nav.html',
            controller: 'AuthController'
          },

          page: {
            templateUrl: './home/home.html',
            controller: 'HomeController',
          }

        }
      })
      .state('home.initial', {
        // Initial nested state; display first prompt
        url: '/',

        views: {

          initial: {
            templateUrl: './home/home.init.html'
          }

        }
      })
      .state('home.selected', {
        // Selected state of home; load second prompt, display text input and submit button
        url: '/',

        views: {

          selected: {
            templateUrl: './home/home.selected.html'
          }

        }
      })
      .state('journal', {
        // url: '/journal', // optional
        
        views: {
          
          nav: {
            templateUrl: './nav/nav.html',
            controller: 'AuthController'
          },

          page: {
            templateUrl: './journal/journal.html',
            controller: 'JournalController'
          }
        }

      })
      .state('graph', {
        // url: '/graph', // optional
        
        views: {
          
          nav: {
            templateUrl: './nav/nav.html',
            controller: 'AuthController'
          },

          page: {
            templateUrl: './graph/graph.html',
            controller: 'GraphController'
          }
        }

      })
      .state('signin', {
        url: '/signin',
        
        views: {
        
          page: {
            templateUrl: './auth/signin.html',
            controller: 'AuthController'
          }
        }

      })
      .state('signup', {
        url: '/signup',
        
        views: {
        
          page: {
            templateUrl: './auth/signup.html',
            controller: 'AuthController'
          }
        }
      });

      $urlRouterProvider.otherwise('/');

  }])
.factory('AttachTokens', function ($window) {
  //this factory stops all outgoing requests, then looks in local storage
  //for the user's JWT and adds the token to the request header
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('moodlet');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})
.run(function ($rootScope, $location, $state, Auth) {
  //this function listens for when angular changes states
  //when the state is change, local storage is checked for the JWT
  //and the token is sent back to the server to check if the user is valid
  $rootScope.$on('$stateChangeStart', function (evt, next, current) {
    // need to modify for UI router and states
    if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
      $state.transitionTo('signin');
    }
  });
});
