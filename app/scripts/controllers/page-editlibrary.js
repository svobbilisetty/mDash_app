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
	   
	   
	   $http({
		method : "GET",
		url : serverHosturl+"editLibrarydetails"
	}).then(function(response){
		
		$scope.library_name=response.data.result[0].url_key;
		$scope.LibraryName=response.data.result[0].url_key;
		$scope.LibraryURL=response.data.result[0].url_value;
	
	})
	   
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
				$scope.disableall=true;
		 }
		 $scope.close= function(){  
       document.getElementById('id01').style.display='none';
     
    };
	   
	   
	$scope.editLibrary1= function(svnpassword){
		document.getElementById('id01').style.display='none';
		btnm();
	  var LibraryName = $scope.LibraryName;
	  var LibraryURL = $scope.LibraryURL; 
	  //var svnpassword = $scope.svnpassword;
	 // alert(LibraryName);
	 // alert(LibraryURL);
	   
	    $http({
		method : "GET",
		url : serverHosturl+"editLibrarydetails"
	    }).then(function(response){
		alert("hai");
		
	var	LibraryName1=response.data.result[0].url_key;
	var	LibraryURL1=response.data.result[0].url_value;
	 
	// alert(LibraryName1);
	 // alert(LibraryURL1);
	            if(LibraryURL1==LibraryURL && LibraryName1==LibraryName)
				{
					//alert("library exist");
					$scope.disableall=false;
					 document.getElementById('btns').style.display="none";
                     document.getElementById('load').innerHTML="Edit Library";
				}
			    else
				{
					//alert("library  not exist");
						$http({
							method : "GET",
							url : serverHosturl+"deletelibrary?library_name="+LibraryName
						}).then(function(response1){
							 
							 if(response1.data=="deleted")
							 {
								  $http({
								method : "GET",
								url : serverHosturl+"createLibraryBuildFolder?Library_Name="+LibraryName+
								"&Library_URL="+LibraryURL+"&svnpassword="+svnpassword
							}).then(function(response2){
								//alert(response2.data);
								$scope.disableall=false;
								 document.getElementById('btns').style.display="none";
                                 document.getElementById('load').innerHTML="Edit Library";
								
							}) 
							 }
							
						})
					
					
				}  
	  })
	};   
	   
	function btnm(){
    document.getElementById('btns').style.display="inline-flex";
    document.getElementById('load').innerHTML="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Editing Library";
}   
	   
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
	   
	   
	   
	   
	   
	   
	   
	   
	   
	   
	   
	   
	   
	   
	});
 });