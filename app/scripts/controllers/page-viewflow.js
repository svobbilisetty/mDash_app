'use strict';

/**
* @ngdoc function
* @name minovateApp.controller:PagesLoginCtrl
* @description
* # PagesLoginCtrl
* Controller of the minovateApp
*/

 app.controller('viewjob', function ($scope,$state,$http,$window,$location,$timeout) {
	
	var  serverHosturl;
	var nextbuild_no;
	$scope.buildmodal=false;
	var socket;
	 
	$http({
		method : "GET",
		url : "/public/serverHost.json"	
	}).then(function(response){
		serverHosturl = response.data.serverHosturl;
		
	$http({
		method : "GET",
		url : serverHosturl+"details"
	  }).then(function(response) {
	   //  alert(JSON.stringify(response.data));
	  
		  $scope.Interface_Name=response.data.interfaceName; 
		  $scope.Flow_Name=response.data.flowName;
    });
	
			socket = io('http://localhost:9003');
			socket.on('news', function (data) {
				//alert(JSON.stringify(data));
				console.log(JSON.stringify(data));
				var dataPort = document.getElementById("console2");
				/* var textFromTag = dataPort.innerHTML;
				alert("textFromTag => "+textFromTag);
				var data1=data.toString().replace(/textFromTag/gim,'');
				alert(data1); */
				dataPort.innerHTML=JSON.stringify(data);
			}); 	
			
		
	$scope.builddetails= function(){ 
		$scope.buildmodal=true;	
    document.getElementById('id01').style.display='block';		
		 $http({
    method : "GET",
    url : serverHosturl+"EnvironmentalParameters?build_env=dev"	
  }).then(function(response) {
     // alert(JSON.stringify(response.data));
	 if(response.data=="no_record")
	 {
			
		  $scope.iibhost = "";
		  $scope.IIBNode = "";
		  $scope.executionGroup = "";
		  $scope.BrokerName = "";
	 }
	 else
	 {
		
		  $scope.iibhost = response.data[0].iibhost;
		  $scope.IIBNode = response.data[0].IIBNode;
		  $scope.executionGroup = response.data[0].executionGroup;
		  $scope.BrokerName = response.data[0].BrokerName;
	 }
	      
    });    
		
		
    }; 
	
	$scope.close= function(){  
	   document.getElementById('id01').style.display='none';
     
	};
		
	$scope.build = function(){ 
	 
	document.getElementById('id01').style.display='none';
	//	alert("Clicked on Build");     
			
		 /* var build_env = "dev"; */
	    
	     var iibhost=$scope.iibhost;
		
		 var IIBNode=$scope.IIBNode;
		 		
		var executionGroup=$scope.executionGroup;
	
		var BrokerName=$scope.BrokerName;
		
			
		
		$http({
			method : "GET",
			url : serverHosturl+"build?build_env=dev"+
			"&iibhost="+iibhost+
			"&IIBNode="+IIBNode+
			"&executionGroup="+executionGroup+
			"&BrokerName="+BrokerName 
		}).then(function(response){
			
				document.getElementById('id01').style.display='none';
				alert(response.data);
				
		});
		
	
		
		
		
		
	}
		
	});
	
 });