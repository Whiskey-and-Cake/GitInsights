var db = angular.module('FirebaseApp', ['firebase']);
// makes $firebaseObject, $firebaseArray, and $firebaseAuth available

//db.factory('favoritesList', ['$firebaseObject',
//  function($firebaseObject) {
//    return function(username) {
//      // need reference to user's data ?
//      var ref = new Firebase('https://gitinsights.firebaseio.com/');
//      return $firebaseObject(ref);
//    };
//  }
//]);

db.factory('FireFactory', function($scope, $firebaseAuth, $firebaseObject) {
  var ref = new Firebase('https://gitinsights.firebaseio.com');
  return {
    auth: $firebaseAuth(ref),
    favorites: $firebaseObject(ref)
  };
});

db.controller('FavoriteController', ['$scope', 'FireFactory', '$firebaseObject',
  function($scope, FireFactory) {
    //var ref = new Firebase('https://gitinsights.firebaseio.com/');
    var obj = FireFactory.favorites;

    obj.$loaded().then(function() {
      // accesses each record
      angular.forEach(obj, function(value, key) {
        console.log(key,value);
      })
    });

    // make object available to scope
    $scope.data = obj;

    // three-way binding
    obj.$bindTo($scope, 'data');

    function addFavorite(favorite) {
      obj.favorite = favorite;
      obj.user = authData.uid;
      obj.$save().then(function(ref) {
        obj.key() === obj.$id;
      }, function(error) {
        console.log('Error:', error);
      });
    }

  }
]);

db.controller('GitAuth', ['FireFactory', '$firebaseAuth', function($scope, FireFactory) {
  var auth = FireFactory.auth;
  auth.$authWithOAuthPopup('github', function(error, authData) {
    if (error) {
      console.log('Login failed:', error);
    } else {
      console.log('Authenticated successfully with payload:', authData);
    }
  });

}]);

