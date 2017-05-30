'use strict';

/**
* @ngdoc function
* @name minovateApp.controller:PagesLoginCtrl
* @description
* # PagesLoginCtrl
* Controller of the minovateApp
*/
app
 .controller('LoginCtrl', function ($scope, $state,$http,$window,$location) {
   var hostName
   var port
   var serverHosturl
    $http.get("/public/serverHost.json").then(function(response){
        hostName = response.data.serverHostname;
        port = response.data.serverPort;
		serverHosturl = response.data.serverHosturl;       
    // alert(hostName+":"+port+":"+serverHosturl);
     $scope.login = function() {
   
    alert("enterd login")
     var username = $scope.user.username;
     var password = $scope.user.password;
    
    
    
     var data = {
         "uname" : username,
         "password" : password
     }
    
    
    $http.post(serverHosturl+"serverlogin",data).then(function(response){
        if(response.data=="admin")
       {
            $state.go('app.dashboard');
        }
      else if(response.data=="user")
      {
           $state.go('app.dashboard');
      }
      else if(response.data=="status_pending")
      {
           alert("status need to approve");
           $state.go('core.locked');
      }
      else
      {
           alert("invalid credentials");
           $scope.errorMsg="**Invalid Credentials"
      }
     });
   };
 });
  });   