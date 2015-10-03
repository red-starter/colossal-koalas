var journal = angular.module('greenfeels.journal', []);

journal.controller('JournalController', ['$scope', 'Entries', 'Twemoji', 'Spinner',
  function ($scope, Entries, Twemoji, Spinner) {
    // Expose twemoji helper in scope
    $scope.getTwemojiSrc = Twemoji.getTwemojiSrc;
    
    // Create journal model
    $scope.journal = {};

    var emojiByInteger = ['😄', '😊', '😌', '😐', '😕', '😒', '😞', '😣'];

    $scope.getEntries = function() {

      var spinner = Spinner.create();
      spinner.spin(document.querySelector('.journal-entries'));

      Entries.getAll()
        .then(function(resp) {
          spinner.stop();
          $scope.journal.entries = resp;
          $scope.journal.entries.map(function(entry) {
            entry.emoji = emojiByInteger[entry.emotion];
            entry.displayDate = moment(entry.createdAt).format('h:mm a dddd MMMM Do YYYY')
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
