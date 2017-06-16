'use strict';

/**
* @ngdoc function
* @name minovateApp.controller:PagesLoginCtrl
* @description
* # PagesLoginCtrl
* Controller of the minovateApp
*/
 app.controller('editLibrary', function ($scope,$state,$http,$window,$location) {
	 var  serverHosturl;
	 
	$http({
		method : "GET",
		url : "/public/serverHost.json"	
	}).then(function(response){
		serverHosturl = response.data.serverHosturl;
       //alert(serverHosturl);
	   
	    $scope.editlibrary1 = function()
		 {
				$scope.buildmodal=true;	
				document.getElementById('id01').style.display='block';
				//alert($scope.svnpassword);
				//$scope.saveInterface();
		 }
		 $scope.editLibrary = function(){
			 	//alert($scope.svnpassword);
				$scope.editLibrary1($scope.svnpassword);
		 }
		 $scope.close= function(){  
       document.getElementById('id01').style.display='none';
     
    };
	   
	   
	$scope.editLibrary1= function(svnpassword){
		document.getElementById('id01').style.display='none';
	  var LibraryName = $scope.LibraryName;
	  var LibraryURL = $scope.LibraryURL; 
	  //var svnpassword = $scope.svnpassword;
	 // alert(LibraryName);
	 // alert(LibraryURL);
	                      /* $http({
								method : "GET",
								url : serverHosturl+"createLibraryBuildFolder?Library_Name="+LibraryName+
								"&Library_URL="+LibraryURL+"&svnpassword="+svnpassword
							}).then(function(response){
								//alert(response.data);
								$state.go('app.libraryList');
															/*  $http({
										method : "GET",
										url : serverHosturl+"librarylist"
									  }).then(function(response) {
										 // alert(JSON.stringify(response.data));
										  $scope.librarylist=response.data
										}); 
							}) */
	  
	  
	};   
	   
	   
	   
	   
	   
	   
	   
	   
	   
	   
	   
	   
	   
	   
	   
	   
	   
	   
	});
 });