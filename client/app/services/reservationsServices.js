angular.module('digitalDining.reservationsServices', [])

.factory('Reservations', ['$http', '$window', function ($http, $window) {
  var getCheckedInParties = function () {
    return $http({
      method: 'GET',
      url: '/api/parties?rid=' + $window.localStorage.getItem('restaurantId') + '&status=waiting'
    })
    .then(function (resp) {
      return resp.data;
    });
  };
  var getSeatedParties = function () {
    return $http({
      method: 'GET',
      url: '/api/parties?rid=' + $window.localStorage.getItem('restaurantId') + '&status=seated'
    })
    .then(function (resp) {
      return resp.data;
    });
  };
  var seatParty = function (party, table) {
    return $http({
      method: 'PUT',
      url: '/api/parties/' + party.id + '?event=seat',
      data: {
        'table_id': table.id
      }
    })
    .then(function (resp) {
      return resp;
    });
  };
  return {
    getCheckedInParties: getCheckedInParties,
    getSeatedParties: getSeatedParties,
    seatParty: seatParty
  };
}]);
