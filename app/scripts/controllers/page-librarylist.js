'use strict';

/**
* @ngdoc function
* @name minovateApp.controller:PagesLoginCtrl
* @description
* # PagesLoginCtrl
* Controller of the minovateApp
*/
 app.controller('librarylist', function ($scope, $state,$http,$window,$location) {
	  var  serverHosturl;
	// alert("enterd addLibrarylist");
	  $http({
			method : "GET",
			url : "/public/serverHost.json"	
		  }).then(function(response){
			serverHosturl = response.data.serverHosturl;
			
			  $http({
			method : "GET",
			url : serverHosturl+"librarylist"
		  }).then(function(response) {
			 // alert(JSON.stringify(response.data));
			  $scope.librarylist=response.data
			});
			
			
			
			
			
			
			
			
	// Library Add pop-up - START
	$scope.addLibrary = function(){	
		/* $scope.buildmodal=true;    
		document.getElementById('id01').style.display='block'; */
		 $state.go('app.addlibrary');
	}
	$scope.close= function(){  
       document.getElementById('id01').style.display='none';
     
    };
	$scope.AddLibrary= function(){
		document.getElementById('id01').style.display='none';
	  var LibraryName = $scope.LibraryName;
	  var LibraryURL = $scope.LibraryURL; 
	  var svnpassword = $scope.svnpassword;
	 // alert(LibraryName);
	 // alert(LibraryURL);
	                      $http({
								method : "GET",
								url : serverHosturl+"createLibraryBuildFolder?Library_Name="+LibraryName+
								"&Library_URL="+LibraryURL+"&svnpassword="+svnpassword
							}).then(function(response){
								//alert(response.data);
															 $http({
										method : "GET",
										url : serverHosturl+"librarylist"
									  }).then(function(response) {
										 // alert(JSON.stringify(response.data));
										  $scope.librarylist=response.data
										});
							})
	  
	  
	};
	// Library Add pop-up - END
	//View Library redirection - START
		$scope.viewlibrary = function(libname){
		//	alert(libname);
			
			$http({
				method : "GET",
				url : serverHosturl+"viewLibrarypage?Library_Name="+libname
			}).then(function(response){
			//	alert(response.data);
				if(response.data == 'nameReceived'){
					$state.go('app.viewlibrary1');
				}
			});
		}
	//View Library redrection - END
	 });
 });