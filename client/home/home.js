var home = angular.module('greenfeels.home', []);

home.controller('HomeController', ['$scope', '$state', 'Prompts', 'Entries',
  function($scope, $state, Prompts, Entries) {
    $state.transitionTo('home.initial');
    // Upon load, initialize first prompt. Display of this prompt will depend on the state.
    // Cache the initial prompt in case we want to return to this state.
    // var initPrompt = Prompts.getFirstPrompt();
    var initPrompt = 'How are you feeling today?';
    $scope.initialPrompt = initPrompt;

    // Initialize a blank model for the entry.
    $scope.entry = {};

    // Handler for clicking on an emoji on the spectrum. Transitions state, changes to new prompt,
    // and captures the code of the selected emotion on the tentative entry model.
    $scope.selectHandler = function($event) {
      $state.transitionTo('home.selected');
      var secondPrompt = 'Why are you feeling that way?';
      $scope.secondPrompt = secondPrompt;
      // $scope.prompt = Prompts.getSecondPrompt();
      $scope.entry.emotion = $event.target.attributes['data-emotion-id'].value;
      console.log('emotion', $scope.entry.emotion);
      console.log('prompt', $scope.secondPrompt);
    };

    $scope.submit = function() {
      // TODO: Use submit service to submit the entry to the server
      Entries.addEntry(JSON.stringify($scope.entry));
      $scope.entry = {};
      $state.transitionTo('home');
    };

  }]);
