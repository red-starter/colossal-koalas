angular.module('greenfeels.services', [])

.factory('Prompts', ['$http', function($http) {
  var firstPrompts = [
    'Hi! How are you doing?',
    'Hey! How are you feeling?',
    'Hey! Wanna record how you\'re feeling?'
  ];
  // Get prompt #1 for intial state view of home page
  var getFirstPrompt = function() {
    return firstPrompts[Math.floor(Math.random() * firstPrompts.length)];
  };

  var secondPrompts = [
    [ // 😄
      'Awesome! Do you want to record any thoughts?',
      'That\'s great! Is there anything you want to write down?'
    ],
    [ // 😊
      'Good! Is there anything you\'d like to write down?',
      'Good! Want to write something about your mood?'
    ],
    [ // 😌
      'Would you like to record any of your thoughts?',
      'Is there anything you want to write down?',
      'Are there any details about your mood that you want to record?',
      'Would you like to write about how you\'re feeling?'
    ],
    [ // 😐
      'Would you like to record any of your thoughts?',
      'Is there anything you want to write down?',
      'Are there any details about your mood that you want to record?',
      'Would you like to write about how you\'re feeling?'
    ],
    [ // 😕
      'Would you like to record any of your thoughts?',
      'Is there anything you want to write down?',
      'Are there any details about your mood that you want to record?',
      'Would you like to write about how you\'re feeling?'
    ],
    [ // 😒
      'Is there anything you\'d like to write about how you\'re feeling?',
      'Are there any details about your mood that you want to record?'
    ],
    [ // 😞
      'Is there anything you\'d like to write about how you\'re feeling?',
      'Are there any details about your mood that you want to record?'
    ],
    [ // 😣
      'Is there anything you\'d like to write about how you\'re feeling?',
      'Are there any details about your mood that you want to record?'
    ] 
  ];

  // Get prompt #2 for selected state view of home page.
  // The `emotion` argument is the integer representing
  // the emoji that was selected.
  var getSecondPrompt = function(emotion) {
    var appropriatePrompts = secondPrompts[emotion];
    return appropriatePrompts[Math.floor(Math.random() * appropriatePrompts.length)];
  };

  return {
    getFirstPrompt: getFirstPrompt,
    getSecondPrompt: getSecondPrompt
  };
}])

.factory('Entries', ['$http', '$window', function($http, $window) {
  // Retrieves all of user's entries
  var getAll = function() {
    var username = $window.localStorage.getItem('moodlet.username');
    if (!username) {
      return;
    }

    return $http({
      method: 'GET',
      url: '/api/users/' + username + '/entries' // this might not be right - need to figure out how to write proper url
    })
    .then(function(resp) {
      return resp.data;
    });
  };

  // Adds user's entry
  var addEntry = function(post) {
    var username = $window.localStorage.getItem('moodlet.username');
    if (!username) {
      return;
    }
    
    return $http({
      method: 'POST',
      url: '/api/users/' + username + '/entries', // this might not be right - need to figure out how to write proper url
      data: post
    });
  };

  return {
    getAll: getAll,
    addEntry: addEntry
  };
}])

.factory('Auth', ['$http', '$window', function($http, $window) {

  var signin = function(user) {
    return $http({
      method: 'POST',
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

}])

  .factory('Twemoji', function() {
    // Shared CDN host
    var urlBase = 'http://twemoji.maxcdn.com/';
    // Index corresponds to emotion value
    var imgs = [
      '1f604.png',
      '1f60a.png',
      '1f60c.png',
      '1f610.png',
      '1f615.png',
      '1f612.png',
      '1f614.png',
      '1f62b.png'
    ];
    // Getter takes int(0 - 7) as emotion and
    // int(16, 36, or 72) as size of image in pixels.
    // Use this function to fill in the `src=""` attribute
    // of an <img> tag.
    var getTwemojiSrc = function(emotion, size) {
      return urlBase + size + 'x' + size + '/' + imgs[emotion];
    }

    return {
      getTwemojiSrc: getTwemojiSrc
    };

  });