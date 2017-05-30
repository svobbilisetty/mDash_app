'use strict';

/**
* @ngdoc function
* @name minovateApp.controller:PagesLoginCtrl
* @description
* # PagesLoginCtrl
* Controller of the minovateApp
*/
 app.controller('viewinterface', function ($scope, $state,$http,$window,$location) {
	// alert("enterd viewinterface");
	 var  serverHosturl;
	 $http({
			method : "GET",
			url : "/public/serverHost.json"	
		  }).then(function(response){
			serverHosturl = response.data.serverHosturl;
           // alert(serverHosturl);				
         $http({
			method : "GET",
			url : serverHosturl+"flows"
		  }).then(function(response) {
			 // alert(JSON.stringify(response.data));
			  $scope.flows=response.data
			}, function(response) {
			  
		  });
	
	$scope.flow= function(flowname){  
	//alert(flowname);
    $http({
    method : "GET",
    url : serverHosturl+"viewjob?flowName="+flowname
    }).then(function(response) {
     $state.go('app.viewjob');
      }, function(response) {
     
    });
     
   }; 

		
 
 });
 });