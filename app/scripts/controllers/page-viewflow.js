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
	$scope.status=false;
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
		 /*  $window.setInterval(function() {
			var element = document.getElementById("console2");
			element.scrollTop = element.scrollHeight;
			}, 2000); */
	});
			socket = io('http://localhost:9003');
			 socket.on('progress', function (data) {
				//alert(data);
				
				//alert(data.indexOf('_build'));
				//alert(data.includes("_build"));
				
				if((data.search('_Build'))>0){
					//alert("Build completed");
					fa7();
				}else if((data.search('Library_Detection'))>0){
					//alert("Library_Detection completed");
					fa1();
				}else if((data.search('Create_Config_Services'))>0){
					//alert("Create_Config_Services1 completed");
					fa2();
				}else if((data.search('Create_Queues'))>0){
					//alert("Create Queues completed");
					fa3();
				}else if((data.search('Deploy'))>0){
					//alert("Deploy completed");
					fa4();
									
											$timeout( function(){ $scope.status=false; }, 5000);
					 
				}
				
				
				
				
			}); 
			socket.on('news', function (data) {
				//alert(JSON.stringify(data));
				console.log(JSON.stringify(data));
				var dataPort = document.getElementById("console2");
				/* var textFromTag = dataPort.innerHTML;
				alert("textFromTag => "+textFromTag);
				var data1=data.toString().replace(/textFromTag/gim,'');
				alert(data1); */
				dataPort.innerHTML=dataPort.innerHTML+JSON.stringify(data);
				 $('.demo').scrollTop($('.demo')[0].scrollHeight);
			}); 	
			
		
	$scope.builddetails= function(){ 
		$scope.buildmodal=true;	
    document.getElementById('id01').style.display='block';		
	var iibhost1;
	var IIBNode1;
	var executionGroup1;
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
		 iibhost1= (response.data[0].iibhost).split(",");
		 IIBNode1 = (response.data[0].IIBNode).split(",");
		 executionGroup1 = (response.data[0].executionGroup).split(",");
		
		  $scope.iibhosts = iibhost1;
		  $scope.iibhost = $scope.iibhosts[0];
		  $scope.IIBNodes = IIBNode1;
		  $scope.IIBNode = $scope.IIBNodes[0];
		  $scope.executionGroups = executionGroup1;
		  $scope.executionGroup = $scope.executionGroups[0];
		  $scope.BrokerName = response.data[0].BrokerName;
	 }
	      
    });    
		
		
    }; 
	
	$scope.close= function(){  
	   document.getElementById('id01').style.display='none';
     
	};
		
	$scope.build = function(){ 
	btnm();
	document.getElementById("roll").disabled = true;
	document.getElementById("promote").disabled = true;
	
	$scope.status=true;
	document.getElementById('id01').style.display='none';
	//	alert("Clicked on Build");     
			
		 /* var build_env = "dev"; */
	    
	     var iibhost=$scope.iibhost;
		
		 var IIBNode=$scope.IIBNode;
		 
		var executionGroup=$scope.executionGroup;
	
		var BrokerName=$scope.BrokerName;
		
		var svnpassword=$scope.svnpassword;
			
		
		 $http({
			method : "GET",
			url : serverHosturl+"build?build_env=dev"+
			"&iibhost="+iibhost+
			"&IIBNode="+IIBNode+
			"&executionGroup="+executionGroup+
			"&BrokerName="+BrokerName+ 
			"&svnpassword="+svnpassword
		}).then(function(response){
			
			if((response.data.search('Job_FAILED'))>0){
                $timeout( function(){ $scope.status=false; }, 3000);
                document.getElementById('btns').style.display="none";
                document.getElementById('load').innerHTML="Build and Deploy";
                document.getElementById("roll").disabled = false;
                document.getElementById("promote").disabled = false; 
             }
             else
             {
                 document.getElementById('btns').style.display="none";
                document.getElementById('load').innerHTML="Build and Deploy";
                document.getElementById("roll").disabled = false;
                document.getElementById("promote").disabled = false;
             }
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
    var iibhost1;
	var IIBNode1;
	var executionGroup1;	
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
        
          iibhost1= (response.data[0].iibhost).split(",");
		 IIBNode1 = (response.data[0].IIBNode).split(",");
		 executionGroup1 = (response.data[0].executionGroup).split(",");
		
		  $scope.iibhosts = iibhost1;
		  $scope.iibhost = $scope.iibhosts[0];
		  $scope.IIBNodes = IIBNode1;
		  $scope.IIBNode = $scope.IIBNodes[0];
		  $scope.executionGroups = executionGroup1;
		  $scope.executionGroup = $scope.executionGroups[0];
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
	btnm1();
    document.getElementById('id02').style.display='none';
    document.getElementById('console2').innerHTML='';
    document.getElementById("deploy").disabled = true;
    document.getElementById("promote").disabled = true;
	
    //    alert("Clicked on Build");     
            
          var build_env = "dev"; 
        
         var iibhost=$scope.iibhost;
        
         var IIBNode=$scope.IIBNode;
                 
        var executionGroup=$scope.executionGroup;
    
        var BrokerName=$scope.BrokerName;
		
		var artifactory_number=$scope.artifactory_number;
		
        var target=$scope.target;
		 
		var svnpassword=$scope.svnpassword;
        
           // alert("values are..."+iibhost+"  "+IIBNode+"  "+executionGroup+" "+BrokerName+"  "+artifactory_number+"  "+target);
        
        $http({
            method : "GET",
            url : serverHosturl+"rollbackjob?iibhost="+iibhost+
            "&IIBNode="+IIBNode+
            "&executionGroup="+executionGroup+
            "&BrokerName="+BrokerName+"&artifactory_number="+artifactory_number+"&target="+target+"&build_env="+build_env+"&svnpassword="+svnpassword
			
        }).then(function(response){
			
			document.getElementById('id02').style.display='none';
               // alert(response.data);
                  if(response.data == 'roll_created')
                 {
                     document.getElementById('btns1').style.display="none";
                     document.getElementById('load1').innerHTML="Rollback and Decomission";
                     document.getElementById("deploy").disabled = false;
                     document.getElementById("promote").disabled = false;
                   // alert("rollback job triggerd");
                 }
                 else{
                     document.getElementById('btns1').style.display="none";
                     document.getElementById('load1').innerHTML="Rollback and Decomission";
                     document.getElementById("deploy").disabled = false;
                     document.getElementById("promote").disabled = false;
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
	
	
	function btnm(){
    document.getElementById('btns').style.display="block";
    document.getElementById('load').innerHTML="Build in Progress";
    
}
function btnm1(){
    document.getElementById('btns1').style.display="block";
    document.getElementById('load1').innerHTML="Rollback in progress";
    
}
	
	});
	
 });