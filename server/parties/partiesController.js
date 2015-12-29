/*jshint camelcase: false */
var partiesModel = require('./partiesModel');
var url = require('url');
var JsonResponse = require('../JsonResponseObject');
var JsonData = require('../JsonDataObject');
var nameGenerator = require('./nameGenerator');

var createJsonResponseForParty = function (data) {
  var JsonResponseObject = new JsonResponse();
  for (var i = 0; i < data.length; i++) {
    var JsonDataObject = new JsonData();
    JsonDataObject.type = 'party';
    JsonDataObject.id = data[i].id;
    JsonDataObject.attributes = {
      restaurantId: data[i].restaurant_id,
      tableId: data[i].table_id,
      partySize: data[i].party_size,
      partyName: data[i].party_name,
      checkedinAt: data[i].checkedin_at,
      seatedAt: data[i].seated_at,
      closedAt: data[i].closed_at
    };
    JsonResponseObject.data.push(JsonDataObject);
  }
  return JsonResponseObject;
};

var getAvailablePartyName = function () {
  var name = nameGenerator();
  return partiesModel.party.getOpenPartiesByName(name)
    .then(function (data) {
      if (data.length === 0) {
        return name;
      } else {
        return getAvailablePartyName();
      }
    });
};

module.exports = {
  checkInAndCreateParty: function (req, res) {
    getAvailablePartyName()
      .then(function (partyName) {
        partiesModel.party.checkInAndCreateParty({
          party_name: partyName,
          restaurant_id: req.body.restaurant_id,
          party_size: req.body.party_size,
          user_id: req.user.id})
          .then(function (data) {
            res.status(201);
            res.send(data);
          });
      });
  },
  editParty: function (req, res) {
    var query = url.parse(req.url, true).query;
    if (query.event === 'seat') {
      partiesModel.party.seatParty(req.params.id, req.body)
        .then(function (data) {
          res.status(200);
          res.send(data);
        });
    } else if (query.event === 'close') {
      partiesModel.party.closeParty(req.params.id)
        .then(function (data) {
          res.status(200);
          res.send(data);
        });
    } else if (query.event === 'addParticipant') {
      partiesModel.party.addUserToParty(req.params.id, req.body)
        .then(function (data) {
          res.status(200);
          res.send(data);
        });
    } else {
      res.status(400);
      res.send();
    }
  },
  get: function (req, res) {
    if (req.params.id) {
      partiesModel.party.getParty(req.params.id)
        .then(function (data) {
          var response = createJsonResponseForParty(data);
          res.status(200);
          res.send(response);
        });
    } else {
      if (req.query.rid) {
        var sendAnswer = function (callback) {
          callback(+req.query.rid)
            .then(function (data) {
              var response = createJsonResponseForParty(data);
              res.status(200);
              res.send(response);
            });
        };
        if (req.query.status === 'waiting') {
          sendAnswer(partiesModel.party.getCheckedInParties);
        } else if (req.query.status === 'seated') {
          sendAnswer(partiesModel.party.getCurrentParties);
        } else if (req.query.status === 'canceled') {
          sendAnswer(partiesModel.party.getCanceledParties);
        } else if (req.query.status === 'ended') {
          sendAnswer(partiesModel.party.getFinishedParties);
        } else {
          sendAnswer(partiesModel.party.getAllParties);
        }
      } else if (req.query.user) {
        partiesModel.party.getCurrentPartyForUser(req.user.id)
          .then(function (data) {
            var response = createJsonResponseForParty(data);
            res.status(200);
            res.send(response);
          });
      } else {
        res.status(400);
        res.send();
      }
    }
  }
};
