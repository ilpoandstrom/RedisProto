(function() {
  'use strict';

  var express = require("express");
  var bodyParser = require("body-parser");
  var webSocket = require('ws');
  var redis = require("redis");
  var asyn = require("async");

  var redisClient;
  if(process.env.REDIS_URL) {
    redisClient = redis.createClient( process.env.REDIS_URL);
  } else {
    redisClient = redis.createClient();
  }

  var port = process.env.PORT || 8080;
  var app = express();

  app.use(express.static(__dirname + '/public'));

  app.get('/', function(req, res) {
    res.sendFile( __dirname + "/public/index.html");
    redisClient.lrange("users", 0, -1, function(err, reply) {
      console.log(reply);
      if(err) {
        console.log(err);
      } else {
        if(reply.indexOf(req.ip) === -1) {
          redisClient.rpush("users", req.ip);
        }
      }
    });

    redisClient.pfadd("uniqVisitors", req.ip);
  });

  app.get('/data', function(req, res) {

    redisClient.lrange("users", 0, -1, function(err, reply) {
      if(err) {
        console.log(err);
        res.status(404).send("something went wrong");
      } else {
        var index = reply.indexOf(req.ip);
        var key = "hourly:"+ dateHourString();
        redisClient.getbit(key, index, function(err, reply) {
          console.log("reply:" + reply);
          var response = {};
          if(reply == 1) {
            var dateNow = new Date();
            response.alreadyPushed = true;
            response.nextPush = 60 - dateNow.getMinutes();
            res.send(response);
          } else {
            response.alreadyPushed = false;
            res.send(response);
          }
        });

      }
    });
  });
  app.get('/allTimeUserCount', function(req, res) {
      redisClient.pfcount("uniqVisitors", function(err, reply) {
        if(err) {
          console.log(err);
          res.status(404).send("something went wrong");
        } else {
          console.log(reply);
          res.send(reply.toString());
        }
      });
  });

  app.post('/push', function(req, res) {
    redisClient.lrange("users", 0, -1, function(err, reply) {
      console.log(reply);
      console.log(req.ip);
      if(err) {
        console.log(err);
        res.status(404).send("something went wrong");
      } else {
        var index = reply.indexOf(req.ip);
        if(index >= 0) {
          var key = "hourly:"+ dateHourString();
          redisClient.setbit(key, index, 1);
          res.status(200).send("push completed");
        } else {
          res.status(404).send(index.toString());
        }

      }
    });
  });

  app.listen(port, function() {
    console.log("port " + port);

  });

  var dateHourString = function() {
    var date = new Date();
    return date.getMonth().toString() + date.getDate().toString() + date.getFullYear().toString() + ":" + date.getHours().toString();
  };

})();
