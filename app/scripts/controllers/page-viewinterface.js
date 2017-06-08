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
		   
		   socket = io('http://localhost:9003');
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
		   
	   
		   
        $http({
            method : "GET",
            url : serverHosturl+"flows"
          }).then(function(response) {
             // alert(JSON.stringify(response.data));
              $scope.flows=response.data.result;
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
   }; 
    
    $scope.close= function(){  
       document.getElementById('id01').style.display='none';
     
    };
        
    $scope.change = function(){ 
     
    document.getElementById('id01').style.display='none';
    //    alert("Clicked on Build");     
            var ConfigServiceName = $scope.ConfigServiceName;
            var SenderHost_IP = $scope.SenderHost_IP
            var SenderPort_Num = $scope.SenderPort_Num
            var username = $scope.username
            var password = $scope.password
           // alert($scope.ConfigServiceName);
             $http({
            method : "GET",
            url : serverHosturl+"UpdateConfigServiceName?ConfigServiceName="+ConfigServiceName+
            "&SenderHost_IP="+SenderHost_IP+
            "&SenderPort_Num="+SenderPort_Num+
            "&username="+username+
            "&password="+password 
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
            
             $http({
            method : "GET",
            url : serverHosturl+"RunTest?InputData="+InputData+
            "&ReceiverPort="+ReceiverPort+
            "&iibhost="+iibhost+
            "&FlowName="+FlowName
        }).then(function(response){
            
               alert(response.data);
                
        }); 
    
    }

});
 });