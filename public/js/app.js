(function () {
    var app = angular.module('redisproto', []);

    app.controller('mainController', ['$scope' , '$http', function ($scope, $http) {
      $scope.loaded = false;
      $scope.pushed = false;
      $scope.allTimeUsers = 0;
      $scope.nextPush = 0;

      $scope.pushMe = function() {
        $http.post("http://localhost:8080/push").then(function(res){
          console.log(res);
          $scope.init();
        }, function(err) {
          console.log(err);
        });
      };

      $scope.init = function() {
        console.log("init");
        $http.get("http://localhost:8080/data").then(function(res){
          console.log(res);
          $scope.pushed = res.data.alreadyPushed;
          if($scope.pushed === true) {
            $scope.nextPush = res.data.nextPush;
          }
          $scope.loaded = true;
        }, function(err) {
          console.log(err);
        });

        $http.get("http://localhost:8080/allTimeUserCount").then(function(res){
          console.log(res);
          $scope.allTimeUsers = res.data[0];
        }, function(err) {
          console.log(err);
        });
      };

    }]);


})();
