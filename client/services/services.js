angular.module('greenfeels.services', [])

.factory('Prompts', ['$http', function($http) {
  // Get prompt #1 for intial state view of home page
  var getFirstPrompt = function() {
    return $http({
      method: 'GET',
      url: '/api/prompts'
    })
    .then(function(resp) {
      // Do something to select appropriate prompt
      return resp.data;
    });
  };

  // Get prompt #2 for selected state view of home page
  var getSecondPrompt = function(emoji) {
    return $http({
      method: 'GET',
      url: '/api/prompts'
    })
    .then(function(resp) {
      // Do something to select appropriate prompt
      return resp.data;
    });
  };

  return {
    getFirstPrompt: getFirstPrompt,
    getSecondPrompt: getSecondPrompt
  };
}])

.factory('Entries', ['$http', function($http) {
  // Retrieves all of user's entries
  var getAll = function() {
    return $http({
      method: 'GET',
      url: '/api/entries'
    })
    .then(function(resp) {
      return resp.data;
    });
  };

  // Adds user's entry
  var addEntry = function(post) {
    return $http({
      method: 'POST',
      url: '/api/entries',
      data: post
    });
  };

  return {
    getAll: getAll,
    addEntry: addEntry
  };
}])

.factory('Auth', ['$http', function($http) {

  var signin = function(user) {
    return $http({
      method: 'POST',
      // TODO: update URL to match back-end
      url: '/api/users/signin',
      data: user
    })
    .then(function(resp) {
      return resp.data.token;
    });
  };

  var signup = function(user) {
    return $http({
      method: 'POST',
      url: '/api/users',
      data: user
    })
    .then(function(resp) {
      return resp.data.token;
    });
  };

  var isAuth = function() {
    return !!$window.localStorage.getItem('moodlet');
  };

  return {
    signin: signin,
    signup: signup,
    isAuth: isAuth,
  };

}]);
