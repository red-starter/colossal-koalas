var journal = angular.module('greenfeels.journal', []);

journal.controller('JournalController', ['$scope', 'Entries', 'Twemoji', 'Spinner',
  function ($scope, Entries, Twemoji, Spinner) {
    // Variable for infinite scrolling; tracks the timestamp of the
    // oldest entry that's been loaded
    var lastSeen;
    // Expose twemoji helper in scope
    $scope.getTwemojiSrc = Twemoji.getTwemojiSrc;
    
    // Create journal model
    $scope.journal = {};

    var emojiByInteger = ['😄', '😊', '😌', '😐', '😕', '😒', '😞', '😣'];

    $scope.getEntries = function() {

      var spinner = Spinner.create();
      spinner.spin(document.querySelector('.journal-spinner'));

      Entries.getAll()
        .then(function(resp) {
          spinner.stop();
          $scope.journal.entries = resp;
          $scope.journal.entries.map(function(entry) {
            entry.emoji = emojiByInteger[entry.emotion];
            entry.displayDate = moment(entry.createdAt).format('h:mm a dddd MMMM Do YYYY')
            return entry;
          });
          lastSeen = resp[resp.length - 1].createdAt;
        })
        .catch(function(err) {
          console.log('Error getting entries: ', err);
        });
    };

    $scope.getMoreEntries = function() {
      var spinner = Spinner.create();
      spinner.spin(document.querySelector('.journal-spinner'));

      Entries.getAll(lastSeen)
        .then(function(resp) {
          spinner.stop();
          var entries = resp;
          entries = entries.map(function(entry) {
                      entry.emoji = emojiByInteger[entry.emotion];
                      entry.displayDate = moment(entry.createdAt).format('h:mm a dddd MMMM Do YYYY')
                      return entry;
                    });
          $scope.journal.entries = $scope.journal.entries.concat(entries);
          lastSeen = resp[resp.length - 1].createdAt;
        })
        .catch(function(err) {
          console.log('Error getting entries: ', err);
        });
    }
    // Display all posts on page load
    $scope.getEntries();
  }
]);
