angular.module('dd-payFactories', [])

.factory('CheckFactory', ['$http', '$window', function ($http, $window) {
  var getCheckItems = function (pid) {
    return $http({
      url: 'http://localhost:8000/api/parties/' + pid + '/menuitems',
      method: 'GET'
    });
  };
  var chargeCard = function (paymentSummary) {
    return $http({
      url: 'http://localhost:8000/api/charges',
      method: 'POST',
      data: paymentSummary
    }).then(function () {
        console.log('charged sucessfully');
    });
  };
  var closeBill = function () {
    return $http({
      url: 'http://localhost:8000/api/parties/' + $window.localStorage.getItem('partyId') + '?event=close',
      method: 'PUT'
    })
    .then(function () {
      $window.localStorage.removeItem('partyInfo');
      $window.localStorage.removeItem('partyId');
      $window.localStorage.removeItem('restaurantId');
    });
  };

  return {
    closeBill: closeBill,
    getCheckItems: getCheckItems,
    chargeCard: chargeCard
  };
}])

.factory('PaymentFactory', ['$http', function ($http) {
  var addCard = function (token) {
    return $http({
      url: 'http://localhost:8000/api/charges/addcard',
      method: 'POST',
      data: {
        'stripeToken' : token
      }
    });
  };
  return {
    addCard: addCard
  };
}]);
