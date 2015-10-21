(function() {
  'use strict';

  var express = require("express");
  var bodyParser = require("body-parser");
  var webSocket = require('ws');
  var redis = require("redis");
  var redisClient = redis.createClient( process.env.REDIS_URL);
  var port = process.env.PORT || 8080;
  var app = express();

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

  app.listen(port, function() {
    console.log("port " + port);

  });

})();
