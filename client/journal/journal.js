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

    $scope.getEntries = function() {

      // First, create spinner with this method from the service.
      var spinner = Spinner.create();
      // Then, call `.spin` from the spinner instance and pass in
      // the element you want the spinner to appear in
      spinner.spin(document.querySelector('.journal-spinner'));

      Entries.getAll()
        .then(function(resp) {
          // Stop the spinner and make it disappear with `.stop()`
          spinner.stop();
          // Grab the entries off the response.
          $scope.journal.entries = resp;
          // The entries' data isn't yet in a beautiful format for
          // the user's eyes. We use a map to mutate each entry in place.
          // (A forEach would probably do here, since it's using side effects anyway.)
          $scope.journal.entries.map(function(entry) {
            entry.displayDate = moment(entry.createdAt).format('h:mm a dddd MMMM Do YYYY')
            return entry;
          });
          // Cache the timestamp of the lastmost entry, for when we load
          // more responses later.
          lastSeen = resp[resp.length - 1].createdAt;
        })
        .catch(function(err) {
          console.log('Error getting entries: ', err);
        });
    };

    $scope.getMoreEntries = function() {
      // Spinner again
      var spinner = Spinner.create();
      spinner.spin(document.querySelector('.journal-spinner'));

      // Here, we can pass in the cached `lastSeen` to tell
      // the server to filter the entries it sends back to ones
      // older than that timestamp. See `server/routes.js:114`
      Entries.getAll(lastSeen)
        .then(function(resp) {
          // Same as above
          spinner.stop();
          var entries = resp;
          entries = entries.map(function(entry) {
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
