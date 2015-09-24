var app = angular.module("greenfeels", ["greenfeels.services, greenfeels.home, greenfeels.journal, greenfeels.graph, ui.router"]);

app.config(["$stateProvider, $urlRouteProvider", function($stateProvider, $urlRouteProvider) {

  $stateProvider
    .state("home", {
      // Parent state of home; load home.html, set controller, use initial state (first prompt)
    })
    .state("home.selected", {
      // Selected state of home; load second prompt, display text input and submit button
    })
    .state("journal", {

    })
    .state("graph", {

    })
    .state("signin", {

    })
    .state("signout", {

    });


}]);