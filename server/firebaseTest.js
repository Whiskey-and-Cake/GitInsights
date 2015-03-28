var db = angular.module('FirebaseApp', ['firebase']);
// makes $firebaselistect, $firebaseArray, and $firebaseAuth available

db.factory('FireFactory', function($firebaseAuth, $firebaseArray) {
  var ref = new Firebase('https://gitinsights.firebaseio.com/');
  var faves = ref.child('favorites');
  return {
    ref: ref,
    auth: $firebaseAuth(ref),
    favorites: $firebaseArray(faves)
  };
});

db.factory('FavoriteFactory', function($firebaseArray) {
  var ref = new Firebase('https://gitinsights.firebaseio.com/favorites');
  var faves = $firebaseArray(ref);

  return function addFavorite(favorite, user) {
    console.log('GOT HERE');
    faves.$add({
      fave: favorite,
      user: user
    }).then(function (ref) {
      var id = ref.key();
      console.log('added record with id ' + id);
      faves.$indexFor(id);
    });
  }
});

db.controller('FavoriteController', FavoriteController);

FavoriteController.$inject = ['$scope', 'FireFactory', 'FavoriteFactory'];
function FavoriteController ($scope, FireFactory, FavoriteFactory) {
  //var ref = new Firebase('https://gitinsights.firebaseio.com/');
  var list = FireFactory.favorites;
  var ref = FireFactory.ref;
  var auth = FireFactory.auth;
  var user = auth.uid;

  //list.$loaded().then(function() {
  //  // accesses each record
  //  angular.forEach(list, function(value, key) {
  //    console.log(key,value);
  //  })
  //});

  // make list available to scope
  $scope.data = list;

  // three-way binding
  //list.$bindTo($scope, 'list');
  //FavoriteFactory(favorite, user);
  $scope.addFactory = FavoriteFactory;
  //function addFavorite(favorite) {
  //  var user = authData.uid;
  //  list.$add({
  //    fave: favorite,
  //    user: user
  //  }).then(function(ref) {
  //    var id = ref.key();
  //    console.log('added record with id ' + id);
  //    list.$indexFor(id);
  //  });
    //list.$save();
  //}
}

// dependency injections should mirror function parameters
db.controller('GitAuth', GitAuth);

GitAuth.$inject = ['$scope', 'FireFactory'];
function GitAuth ($scope, FireFactory) {
  var auth = FireFactory.auth;

  $scope.authData = authData;
  auth.$authWithOAuthPopup('github', function(error, authData) {
    if (error) {
      console.log('Login failed:', error);
    } else {
      console.log('Authenticated successfully with payload:', authData);
    }
  });
}