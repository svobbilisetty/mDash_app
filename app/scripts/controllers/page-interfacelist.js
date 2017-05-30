'use strict';

/**
* @ngdoc function
* @name minovateApp.controller:PagesLoginCtrl
* @description
* # PagesLoginCtrl
* Controller of the minovateApp
*/
 app.controller('interfacelist', function ($scope, $state,$http,$window,$location) {
	// alert("enterd interfacelist");
	 var  serverHosturl;
	 $http({
			method : "GET",
			url : "/public/serverHost.json"	
		  }).then(function(response){
			serverHosturl = response.data.serverHosturl;
           // alert(serverHosturl);				
         $http({
			method : "GET",
			url : serverHosturl+"interfacelist"
		  }).then(function(response) {
			 // alert(JSON.stringify(response.data));
			  $scope.interfaces=response.data
			}, function(response) {
			  
		  });
	
	$scope.viewflow= function(interfaceName){  
	//alert(interfaceName);
    $http({
    method : "GET",
    url : serverHosturl+"viewflow?interfaceName="+interfaceName
    }).then(function(response) {
     $state.go('app.viewinterface');
      }, function(response) {
     
    });
     
   }; 

		
 
 });
 });