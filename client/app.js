var app = angular.module('greenfeels',
  ['greenfeels.services, greenfeels.home, greenfeels.journal, greenfeels.graph, greenfeels.nav, ui.router']);

app.config(['$stateProvider, $urlRouteProvider', 
  function($stateProvider, $urlRouteProvider) {

    $stateProvider
      .state('home', {
        // Parent state of home; load home.html, set controller, use initial state
        views: {

          nav: {
            templateUrl: './nav/nav.html'
          },

          page: {
            templateUrl: './home/home.html',
            controller: 'HomeController'
          }

        }
      })
      .state('home.initial', {
        // Initial nested state; display first prompt
        views: {

          initial: {
            templateUrl: './home/home.init.html'
          }

        }
      })
      .state('home.selected', {
        // Selected state of home; load second prompt, display text input and submit button
        views: {

          selected: {
            templateUrl: './home/home.selected.html'
          }
          
        }
      })
      .state('journal', {
        
        views: {
          
          nav: {
            templateUrl: './nav/nav.html'
          },

          page: {
            templateUrl: './journal/journal.html',
            controller: 'JournalController'
          }
        }

      })
      .state('graph', {
        
        views: {
          
          nav: {
            templateUrl: './nav/nav.html'
          },

          page: {
            // TODO
          }
        }

      })
      .state('signin', {
        
        views: {
        
          page: {
            templateUrl: './auth/signin.html',
            controller: 'AuthController'
          }
        }

      })
      .state('signup', {
        
        views: {
        
          page: {
            templateUrl: './auth/signup.html',
            controller: 'AuthController'
          }
        }

      });

}]);
