/**
 * Created by kate on 3/26/15.
 */

(function() {
  'use strict';

  db.factory('Auth', ['$firebaseAuth',
    function ($firebaseAuth) {
      var ref = new Firebase('https://gitinsights.firebaseio.com');
      return $firebaseAuth(ref);
    }
  ]);

  db.controller('AuthController', ['$scope', 'Auth',
    function ($scope, Auth) {
      $scope.createUser = function () {
        $scope.message = null;
        $scope.error = null;

        Auth.$createUser({
          email: $scope.email,
          password: $scope.password
        }).then(function (userData) {
          $scope.message = 'User created with uid:' + userData.uid;
          // logs in the newly created user
          return Auth.$authWithPassword({
            email: $scope.email,
            password: $scope.password
          });
        }).then(function (authData) {
          console.log('Logged in as:' + authData.uid);
        }).catch(function (error) {
          $scope.error = error;
        });
      };

      $scope.removeUser = function () {
        $scope.message = null;
        $scope.error = null;

        Auth.$removeUser({
          email: $scope.email,
          password: $scope.password
        }).then(function () {
          $scope.message = 'User removed.';
        }).catch(function (error) {
          $scope.error = error;
        });
      }
    }
  ]);

})();