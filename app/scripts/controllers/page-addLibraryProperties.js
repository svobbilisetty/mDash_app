'use strict';

/**
* @ngdoc function
* @name minovateApp.controller:PagesLoginCtrl
* @description
* # PagesLoginCtrl
* Controller of the minovateApp
*/
 app.controller('addLibraryProperties', function ($scope, $state,$http,$window,$location) {
	// alert("enterd addLibraryProperties");
	 var  serverHosturl;
	 $http({
			method : "GET",
			url : "/public/serverHost.json"	
		  }).then(function(response){
			serverHosturl = response.data.serverHosturl;
         //  alert(serverHosturl);				
        
  $scope.submit = function() 
    {
		//alert("enterd submit")
  var  urlkey = $scope.urlkey;	
  var  urlvalue = $scope.urlvalue;
  
   		   
   // alert($scope.urlkey);
   // alert(urlvalue);
		   
    $http({
    method : "GET",
    url : serverHosturl+"addLibraryProperties?urlkey="+urlkey+
	"&urlvalue="+urlvalue
  }).then(function(response) {
      alert(response.data);
	 $scope.urlkey="";	
     $scope.urlvalue="";
    }, function(response) {
      
  });
   } ;
   
   
 
 });
 });