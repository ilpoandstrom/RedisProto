(function() {
  'use strict';

  var express = require("express");
  var bodyParser = require("body-parser");
  //var redis = require("redis");
  //var redisClient = redis.createClient();

  var app = express();

  app.get('/', function(req, res) {
    res.sendFile( __dirname + "/public/index.html");
    /*redisClient.lrange("users", 0, -1, function(err, reply) {
      if(err) {
        console.log(err);
      } else {
        if(reply.indexOf(req.ip) === -1) {
          redisClient.rpush("users", req.ip);
        }
      }
    });

    redisClient.pfadd("uniqVisitors", req.ip);
  });*/

  app.listen(8080, function() {
    console.log("port 8080");
  });

})();
