'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:FormImgCropCtrl
 * @description
 * # FormImgCropCtrl
 * Controller of the minovateApp
 */
app
  .controller('FormImgCropCtrl', function ($scope,$state,$http,$window,$location) {
	 // alert("hai enterd users");
	 var hostName
     var port
     var serverHosturl
	  $http.get("/public/serverHost.json").then(function(response){
        hostName = response.data.serverHostname;
        port = response.data.serverPort;
		serverHosturl = response.data.serverHosturl;       
    // alert(hostName+":"+port+":"+serverHosturl); 
     /* $scope.myImage='';
    $scope.myCroppedImage='';
    $scope.cropType='circle';

    var handleFileSelect=function(evt) {
      var file=evt.currentTarget.files[0];
      var reader = new FileReader();
      reader.onload = function (evt) {
        $scope.$apply(function($scope){
          $scope.myImage=evt.target.result;
        });
      };
      reader.readAsDataURL(file);
    };
    angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect); */
	
	$http({
            method : "GET",
            url : serverHosturl+"RetriveUserData"
         }).then(function(response) {
         //alert(JSON.stringify(response.data));
           $scope.users=response.data;
         });	
  });
  });