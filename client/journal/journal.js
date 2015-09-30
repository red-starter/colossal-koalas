var journal = angular.module('greenfeels.journal', []);

journal.controller('JournalController', ['$scope', 'Entries',
  function ($scope, Entries) {
    // Create journal model
    $scope.journal = {};

    var emojiByInteger = ['😄', '😊', '😌', '😐', '😕', '😒', '😞', '😣'];

    $scope.getEntries = function() {
      Entries.getAll()
        .then(function(resp) {
          $scope.journal.entries = resp;
          $scope.journal.entries.map(function(entry) {
            entry.emoji = emojiByInteger[entry.emotion];
            return entry;
          });
        })
        .catch(function(err) {
          console.log('Error getting entries: ', err);
        });
    };
    // Display all posts on page load
    $scope.getEntries();
  }
]);
