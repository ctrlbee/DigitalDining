/*jshint camelcase: false */
angular.module('dd-checkInCtrl', [])

.controller('CheckInCtrl', ['$scope', '$state', '$window', '$ionicPopup', 'HomeFactory', 'CheckInFactory', function ($scope, $state, $window, $ionicPopup, HomeFactory, CheckInFactory) {
  $scope.noAccount = false;
  $scope.partyInfo = {};

  $scope.getCheckInStatus = function () {
    return $scope.isCheckedIn;
  };

  $scope.getFocusedRestaurant = function () {
    HomeFactory.getFocusedRestaurant()
      .then(function (rest) {
        $scope.focusedRestaurant = rest;
        $scope.partyInfo.restaurant_id = rest.id;
        $scope.partyInfo.party_size = '';
        if ($window.localStorage.getItem('partyInfo')) {
          $scope.isCheckedIn = true;
        } else {
          $scope.isCheckedIn = false;
        }
        if (Object.keys($scope.focusedRestaurant).length > 0) {
          $scope.hasRestaurant = true;
        } else {
          $scope.hasRestaurant = false;
        }
      });
  };

  $scope.doCheckIn = function () {
    CheckInFactory.doCheckIn($scope.partyInfo).then( function () {
      $state.go('nav.restaurantMenu');
      $scope.isCheckedIn = true;
    })
    .catch(function (err) {
      if (err.status === 401) {
        $scope.noAccount = true;
        setTimeout(function () {
          $state.go('nav.account');
        }, 1500);
        console.log('not a valid person ', err);
      }
    });
  };

  $scope.getUsers = function () {
    CheckInFactory.getUsers()
      .then(function (users) {
        $scope.users = users;
      });
  };

  $scope.setSelectedUser = function (user) {
    $scope.selectedUser = JSON.parse(user);
  };

  $scope.addUsersToParty = function () {
    CheckInFactory.addUsersToParty($scope.selectedUser.id);
    $ionicPopup.alert({
     title: 'Reservation Updated',
     template: $scope.selectedUser.attributes.username + ' has been added to your party.'
   });
  };

  $scope.getFocusedRestaurant();
  $scope.getUsers();

}]);
