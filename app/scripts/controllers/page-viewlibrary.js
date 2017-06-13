'use strict';

/**
* @ngdoc function
* @name minovateApp.controller:PagesLoginCtrl
* @description
* # PagesLoginCtrl
* Controller of the minovateApp
*/
 app.controller('viewlibrary1', function ($scope, $state,$http,$window,$location) {
	  var  serverHosturl;
	  $http({
		method : "GET",
		url : "/public/serverHost.json"	
	  }).then(function(response){
		serverHosturl = response.data.serverHosturl;
			
		$http({
			method : "GET",
			url : serverHosturl+"getLibName"
		}).then(function(response){
			//alert(response.data);
			$scope.libraryName = response.data;
		});
		
	 $scope.editLibrary = function(){
		// alert("clicked the edit Library page");
		 $scope.buildmodal=true;    
		document.getElementById('id01').style.display='block';
	 }
	 
	 $scope.close= function(){  
	   document.getElementById('id01').style.display='none';
	 
	};
	
	$scope.gotoLibList = function(){
		$state.go('app.libraryList');
	}
	
	  });			
	


});