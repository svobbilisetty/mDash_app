'use strict';

/**
* @ngdoc function
* @name minovateApp.controller:PagesLoginCtrl
* @description
* # PagesLoginCtrl
* Controller of the minovateApp
*/
 app.controller('viewinterface', function ($scope, $state,$http,$window,$location) {
    // alert("enterd viewinterface");
    $scope.buildmodal=false;
    $scope.buildmodal1=false;
	var socket;
     var  serverHosturl;			
			
     $http({
            method : "GET",
            url : "/public/serverHost.json"    
          }).then(function(response){
            serverHosturl = response.data.serverHosturl;
           // alert(serverHosturl);                
		   
		 /*   socket = io('http://localhost:9003');
		   socket.on('news', function (data) {
				//alert(JSON.stringify(data));
				console.log(JSON.stringify(data));
				var dataPort = document.getElementById("console2");
				/* var textFromTag = dataPort.innerHTML;
				alert("textFromTag => "+textFromTag);
				var data1=data.toString().replace(/textFromTag/gim,'');
				alert(data1); */
				/*dataPort.innerHTML=dataPort.innerHTML+JSON.stringify(data);
				 $('.demo').scrollTop($('.demo')[0].scrollHeight);
			});  */  
		   
	   var build_env=["dev","test","prod"];
	   $scope.envs=build_env;
	   $scope.env=$scope.envs[0];
		   
        $http({
            method : "GET",
            url : serverHosturl+"flows"
          }).then(function(response) {
             // alert(JSON.stringify(response.data));
              $scope.flows=response.data.result;
			  //$scope.flowNames_Test=response.data.result;
			 var senderString=[];
			 var runString=[];
			 var counter=0;
			  for (var ik=0; ik <response.data.result.length;ik++){
				 // alert("response of sender ==> "+response.data.result[ik].flowname.indexOf('Sender'));
				  if(response.data.result[ik].flowname.indexOf('Sender') != -1){
					  senderString[counter] = response.data.result[ik].flowname;
					  counter++;
				  }  
			  }
			  counter=0;
			   for (var ik=0; ik <response.data.result.length;ik++){
				 // alert("response of sender ==> "+response.data.result[ik].flowname.indexOf('Sender'));
				  if(response.data.result[ik].flowname.indexOf('Receiver') != -1){
					  runString[counter] = response.data.result[ik].flowname;
					  counter++;
				  }  
			  }
			 // alert(string);
			  
			  $scope.flowNames_Test=senderString;
			  $scope.ConfigServiceName = $scope.flowNames_Test[0];
			  
			  $scope.flowNames_Run=runString;
			  $scope.FlowName = $scope.flowNames_Run[0];
			  
			  
			 			  //var string = JSON.stringify(response.data.result);
			  //var array = string.split(',');
			  //alert(array);
              $scope.interfaceName = response.data.interfaceName;
            }, function(response) {
              
          });
    
    $scope.flow= function(flowname){  
    //alert(flowname);
    $http({
    method : "GET",
    url : serverHosturl+"viewjob?flowName="+flowname
    }).then(function(response) {
     $state.go('app.viewjob');
      }, function(response) {
    
    });
    
   };

        
    $scope.edit = function(interfaceName){
          $state.go('app.editinterface');
    /*     alert("InterfaceName : "+$scope.interfaceName);
        $http({
            method : "GET",
            url : serverHosturl+"editInterface"
        }).then(function(response) {
             // alert(JSON.stringify(response.data));
              $scope.flows=response.data.result;
              $scope.interfaceName = response.data.interfaceName;
        }); */
    }
    
    
    
    $scope.ChangeSenderConfigService= function(){ 
        $scope.buildmodal=true;    
   document.getElementById('id01').style.display='block';   
 var iibhost1;
	var IIBNode1;
	var executionGroup1;
  var build_env=$scope.env;
	
	$http({
    method : "GET",
    url : serverHosturl+"EnvironmentalParameters?build_env="+build_env	
  }).then(function(response) {
     // alert(JSON.stringify(response.data));
	 if(response.data=="no_record")
	 {
			
		 $scope.iibhost = "";
		 $scope.IIBNode = "";
		 $scope.executionGroup = "";
		 $scope.mqsiprofile = "";
	 }
	 else
	 {
		 iibhost1= (response.data[0].iibhost).split(",");
		 IIBNode1 = (response.data[0].IIBNode).split(",");
		 executionGroup1 = (response.data[0].executionGroup).split(",");
		 
		 
		   $scope.IIBNodes=IIBNode1;
	       $scope.IIBNode=$scope.IIBNodes[0];
		   $scope.iibhosts=iibhost1;
	       $scope.iibhost=$scope.iibhosts[0];
	       $scope.executionGroups=executionGroup1;
	       $scope.executionGroup=$scope.executionGroups[0];
	       $scope.mqsiprofile = response.data[0].mqsiprofile;
	 }
	      
    });   	 

  
   }; 
    
    $scope.close= function(){  
       document.getElementById('id01').style.display='none';
     
    };
        
    $scope.change = function(){ 
     
    document.getElementById('id01').style.display='none';
    //    alert("Clicked on Build");     
            var ConfigServiceName = $scope.ConfigServiceName;
			//alert(ConfigServiceName);
            var SenderHost_IP = $scope.SenderHost_IP
            var SenderPort_Num = $scope.SenderPort_Num
            //var username = $scope.username
            var svnpassword = $scope.password
			var IIBNode = $scope.IIBNode
			var iibhost = $scope.iibhost
		    var executionGroup = $scope.executionGroup
			var mqsiprofile = $scope.mqsiprofile
           // alert($scope.ConfigServiceName);
             $http({
            method : "GET",
            url : serverHosturl+"UpdateConfigServiceName?ConfigServiceName="+ConfigServiceName+
            "&SenderHost_IP="+SenderHost_IP+
            "&SenderPort_Num="+SenderPort_Num+
            "&svnpassword="+svnpassword+
			"&IIBNode="+IIBNode+
			"&iibhost="+iibhost+
			"&executionGroup="+executionGroup+
			"&mqsiprofile="+mqsiprofile
        }).then(function(response){
            
                
            alert(response.data);
                
        }); 
          
    
    }
    $scope.runtest= function(){ 
        $scope.buildmodal1=true;    
   document.getElementById('id02').style.display='block';                
   }; 
    
    $scope.close1= function(){  
       document.getElementById('id02').style.display='none';
     
    };
        
    $scope.test = function(){ 
     
    document.getElementById('id02').style.display='none';
    //    alert("Clicked on Build");     
            
         var ConfigServiceName = $scope.ConfigServiceName;
            var InputData = $scope.InputData
            var ReceiverPort = $scope.ReceiverPort
            var iibhost = $scope.iibhost
            var FlowName = $scope.FlowName
			var svnpassword = $scope.password
            
             $http({
            method : "GET",
            url : serverHosturl+"RunTest?InputData="+InputData+
            "&ReceiverPort="+ReceiverPort+
            "&iibhost="+iibhost+
            "&FlowName="+FlowName+
			"&svnpassword="+svnpassword
        }).then(function(response){
            
               alert(response.data);
                
        }); 
    
    }
$scope.fieldspop = function(){
	 var iibhost1;
	var IIBNode1;
	var executionGroup1;
  var build_env=$scope.env;
	
	$http({
    method : "GET",
    url : serverHosturl+"EnvironmentalParameters?build_env="+build_env	
  }).then(function(response) {
     // alert(JSON.stringify(response.data));
	 if(response.data=="no_record")
	 {
			
		 $scope.iibhost = "";
		 $scope.IIBNode = "";
		 $scope.executionGroup = "";
		 $scope.mqsiprofile = "";
	 }
	 else
	 {
		 iibhost1= (response.data[0].iibhost).split(",");
		 IIBNode1 = (response.data[0].IIBNode).split(",");
		 executionGroup1 = (response.data[0].executionGroup).split(",");
		
		 
		   $scope.IIBNodes=IIBNode1;
	       $scope.IIBNode=$scope.IIBNodes[0];
		   $scope.iibhosts=iibhost1;
	       $scope.iibhost=$scope.iibhosts[0];
	       $scope.executionGroups=executionGroup1;
	       $scope.executionGroup=$scope.executionGroups[0];
	       $scope.mqsiprofile = response.data[0].mqsiprofile;
	 }
	      
    });   	
	
}

});
 });