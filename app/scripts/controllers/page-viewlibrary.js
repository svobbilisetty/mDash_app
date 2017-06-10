'use strict';

/**
* @ngdoc function
* @name minovateApp.controller:PagesLoginCtrl
* @description
* # PagesLoginCtrl
* Controller of the minovateApp
*/
 app.controller('viewlibrary', function ($scope, $state,$http,$window,$location) {
     $scope.editLibrary = function(){
		 alert("clicked the edit Library page");
		 $scope.buildmodal=true;    
		document.getElementById('id01').style.display='block';
	 }
	 
	 $scope.close= function(){  
       document.getElementById('id01').style.display='none';
     
    };
 });