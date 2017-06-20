'use strict';

/**
* @ngdoc function
* @name minovateApp.controller:PagesLoginCtrl
* @description
* # PagesLoginCtrl
* Controller of the minovateApp
*/
 app.controller('AddLibrary', function ($scope,$state,$http,$window,$location) {
	 var  serverHosturl;
	 
	$http({
		method : "GET",
		url : "/public/serverHost.json"	
	}).then(function(response){
		serverHosturl = response.data.serverHosturl;
       //alert(serverHosturl);
	   
	    $scope.savelibrary1 = function()
		 {
				$scope.buildmodal=true;	
				document.getElementById('id01').style.display='block';
				//alert($scope.svnpassword);
				//$scope.saveInterface();
		 }
		 $scope.AddLibrary = function(){
			 	//alert($scope.svnpassword);
				$scope.AddLibrary1($scope.svnpassword);
				$scope.disableall=true;
		 }
		 $scope.close= function(){  
       document.getElementById('id01').style.display='none';
     
    };
	   
	$scope.librarylist= function(){
		$state.go('app.libraryList');
	}   
	   
	   
	$scope.AddLibrary1= function(svnpassword){
		document.getElementById('id01').style.display='none';
		btnm();
	  var LibraryName = $scope.LibraryName;
	  var LibraryURL = $scope.LibraryURL; 
	  //var svnpassword = $scope.svnpassword;
	 // alert(LibraryName);
	 // alert(LibraryURL);
	                      $http({
								method : "GET",
								url : serverHosturl+"createLibraryBuildFolder?Library_Name="+LibraryName+
								"&Library_URL="+LibraryURL+"&svnpassword="+svnpassword
							}).then(function(response){
								//alert(response.data);
								$scope.disableall=false;
								$state.go('app.libraryList');
															/*  $http({
										method : "GET",
										url : serverHosturl+"librarylist"
									  }).then(function(response) {
										 // alert(JSON.stringify(response.data));
										  $scope.librarylist=response.data
										}); */
							})
	  
	  
	};   
	   
	   
	   
	   
function btnm(){
    document.getElementById('btns').style.display="inline-flex";
    document.getElementById('load').innerHTML="&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Creating Library";
    document.getElementById('load').style.fontWeight="bold";
}		   
	   
	   
	   
	   
	   
	   
	   
	   
	   
	   
	   
	   
	   
	});
 });