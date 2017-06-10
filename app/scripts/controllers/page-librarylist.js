'use strict';

/**
* @ngdoc function
* @name minovateApp.controller:PagesLoginCtrl
* @description
* # PagesLoginCtrl
* Controller of the minovateApp
*/
 app.controller('librarylist', function ($scope, $state,$http,$window,$location) {
	 
	// Library Add pop-up - START
	$scope.addLibrary = function(){
		//alert("enterd addLibrarylist");
		
		$scope.buildmodal=true;    
		document.getElementById('id01').style.display='block';
	}
	$scope.close= function(){  
       document.getElementById('id01').style.display='none';
     
    };
	// Library Add pop-up - END
 });