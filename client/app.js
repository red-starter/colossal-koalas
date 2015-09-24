var app = angular.module("greenfeels", ["greenfeels.services, greenfeels.home, greenfeels.journal, greenfeels.graph, ui.router"]);

app.config(["$stateProvider, $urlRouteProvider", function($stateProvider, $urlRouteProvider) {

  $stateProvider
    .state("home", {

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