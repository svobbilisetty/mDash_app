'use strict';

/**
* @ngdoc function
* @name minovateApp.controller:PagesLoginCtrl
* @description
* # PagesLoginCtrl
* Controller of the minovateApp
*/
 app.controller('viewflow', function ($scope, $state,$http,$window,$location) {
	// alert("enterd viewflow");
	 var  serverHosturl;
	 $http({
			method : "GET",
			url : "/public/serverHost.json"	
		  }).then(function(response){
			serverHosturl = response.data.serverHosturl;
           // alert(serverHosturl);				
         $http({
			method : "GET",
			url : serverHosturl+"flowjobs"
		  }).then(function(response) {
			 // alert(JSON.stringify(response.data));
			  $scope.jobs=response.data.jobs;
			}, function(response) {
			  
		  });
	
	$scope.job= function(jobname){  
	//alert(jobname);
    $http({
    method : "GET",
    url : serverHosturl+"jobdetail?jobName="+jobname
    }).then(function(response) {
     $state.go('app.viewjob');
      }, function(response) {
     
    });
     
   }; 

		
 
 });
 });