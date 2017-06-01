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
		  $window.setInterval(function() {
			var element = document.getElementById("console2");
			element.scrollTop = element.scrollHeight;
			}, 2000);
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
			//	alert(response.data);
				
		});
		
	
		
		
		
		
	}
	$scope.rollbackdetails= function(){ 
	document.getElementById('artifactory_numberDiv').style.display='block';
    //alert("rollback working");
        $scope.buildmodal1=true;    
         $scope.targets = ["Rollback","Decomission"];
          $scope.target = $scope.targets[0];
    document.getElementById('id02').style.display='block';        
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
         $scope.targets = "";
     }
     else
     {
        
          $scope.iibhost = response.data[0].iibhost;
          $scope.IIBNode = response.data[0].IIBNode;
          $scope.executionGroup = response.data[0].executionGroup;
          $scope.BrokerName = response.data[0].BrokerName;
     }
          
   });    
    $http({
    method : "GET",
    url : serverHosturl+"artifactory"	
  }).then(function(response) {
	 // alert(JSON.stringify(response.data));
	  $scope.artifactory_number = response.data.artifactory;  
  })    
        
   }; 
    $scope.close1= function(){  
       document.getElementById('id02').style.display='none';
     
    };
    $scope.build1 = function(){ 
    document.getElementById('id02').style.display='none';
    //    alert("Clicked on Build");     
            
          var build_env = "dev"; 
        
         var iibhost=$scope.iibhost;
        
         var IIBNode=$scope.IIBNode;
                 
        var executionGroup=$scope.executionGroup;
    
        var BrokerName=$scope.BrokerName;
		
		var artifactory_number=$scope.artifactory_number;
		
        var target=$scope.target;
        
           // alert("values are..."+iibhost+"  "+IIBNode+"  "+executionGroup+" "+BrokerName+"  "+artifactory_number+"  "+target);
        
        $http({
            method : "GET",
            url : serverHosturl+"rollbackjob?iibhost="+iibhost+
            "&IIBNode="+IIBNode+
            "&executionGroup="+executionGroup+
            "&BrokerName="+BrokerName+"&artifactory_number="+artifactory_number+"&target="+target+"&build_env="+build_env
        }).then(function(response){
            
                document.getElementById('id02').style.display='none';
               // alert(response.data);
                  if(response.data == 'roll_created')
                 {
                   // alert("rollback job triggerd");
                 } 
                 else{
                    // alert("rollback job failed");
                     }
                 
        });
    }
	
	$scope.artifact= function(){
		//alert("entered  hide");
		 var target1 = $scope.target;
		// alert(target1);
		 if(target1 == "Decomission"){
			document.getElementById('artifactory_numberDiv').style.display='none';
		 }
		 if(target1 == "Rollback"){
			 document.getElementById('artifactory_numberDiv').style.display='block';
		 }
    };
	
	
	
	});
	
 });