'use strict';

/**
* @ngdoc function
* @name minovateApp.controller:PagesLoginCtrl
* @description
* # PagesLoginCtrl
* Controller of the minovateApp
*/
 app.controller('viewlibrary1', function ($scope,$state,$http,$window,$location) {
	 var  serverHosturl;
	 var socket;
	 var Library_name;
	/* var nextbuild_no;
	$scope.buildmodal=false;
	$scope.status=false;
	var socket; */
	 
	$http({
		method : "GET",
		url : "/public/serverHost.json"	
	}).then(function(response){
		serverHosturl = response.data.serverHosturl;
		
	
		
	 // alert("clicked the edit Library page");
     $scope.editLibrary = function(){
		// alert("clicked the edit Library page");
		 $scope.buildmodal=true;    
		document.getElementById('id01').style.display='block';
	 }
	 
	 $scope.close= function(){  
       document.getElementById('id01').style.display='none';
     
    };
	
	$http({
			method : "GET",
			url : serverHosturl+"getLibName"
		}).then(function(response){
			//alert(response.data);
			$scope.libraryName = response.data;
			Library_name=response.data; 
			$http({
            method : "GET",
            url : serverHosturl+"recentlibjobs?url_key="+response.data
          }).then(function(response) {
			  //alert(JSON.stringify(response.data));
			  $scope.librarylog=response.data;
		  });
		
		});
	
	socket = io('http://localhost:9003');
	   socket.on('news', function (data) {
				//alert(JSON.stringify(data));
				console.log(JSON.stringify(data));
				var dataPort = document.getElementById("console3");
				/* var textFromTag = dataPort.innerHTML;
				alert("textFromTag => "+textFromTag);
				var data1=data.toString().replace(/textFromTag/gim,'');
				alert(data1); */
				dataPort.innerHTML=dataPort.innerHTML+JSON.stringify(data);
				 $('.demo').scrollTop($('.demo')[0].scrollHeight);
			}); 
	$scope.EditLib= function(){  
       document.getElementById('id01').style.display='none';
	  var LibraryName = $scope.LibraryName;
	  var LibraryURL = $scope.LibraryURL; 
	  var svnpassword = $scope.svnpassword;
	 // alert(LibraryName);
	 // alert(LibraryURL);
     
    };
	
	$scope.builddetails = function(){
		// alert("clicked the edit Library page");
		$scope.buildmodal1=true;    
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
			
		  $scope.iibhosts = "";
		  $scope.IIBNodes = "";
		  $scope.executionGroups = "";
		  $scope.BrokerNames = "";
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
	 }
	 
	 $scope.close2= function(){  
       document.getElementById('id02').style.display='none';
     
    };
	
	$scope.build= function(){  
       document.getElementById('id02').style.display='none';
	     var iibhost=$scope.iibhost;
		
		 var IIBNode=$scope.IIBNode;
		 
		var executionGroup=$scope.executionGroup;
	
		var BrokerName=$scope.BrokerName;
		
		//var svnpassword=$scope.svnpassword;
			
		
		 $http({
			method : "GET",
			url : serverHosturl+"libbuild?build_env=dev"+
			"&iibhost="+iibhost+
			"&IIBNode="+IIBNode+
			"&executionGroup="+executionGroup+
			"&BrokerName="+BrokerName
			//"&svnpassword="+svnpassword
		}).then(function(response){
			
			
			$http({
            method : "GET",
            url : serverHosturl+"recentlibjobs?url_key="+Library_name
          }).then(function(response) {
			 // alert(JSON.stringify(response.data));
			  $scope.librarylog=response.data;
		  });
		
		
			
			
			
			if((response.data.search('Job_FAILED'))>0){
				alert("failed");
               /*  $timeout( function(){ $scope.status=false; }, 3000);
                document.getElementById('btns').style.display="none";
                document.getElementById('load').innerHTML="Build and Deploy";
                document.getElementById("roll").disabled = false;
              //  document.getElementById("promote").disabled = false;  */
             }
             else
             {
				 alert("success")
				/*  $timeout( function(){ $scope.status=false; }, 3000);
                 document.getElementById('btns').style.display="none";
                document.getElementById('load').innerHTML="Build and Deploy";
                document.getElementById("roll").disabled = false; */
               // document.getElementById("promote").disabled = false;
             }
			//	alert(response.data);
				
		}); 
     
    };
	
	$scope.deploydetails = function(){
		// alert("clicked the edit Library page");
		 $scope.buildmodal2=true;    
		document.getElementById('id03').style.display='block';
	var iibhost12;
	var IIBNode12;
	var executionGroup12;
		 $http({
    method : "GET",
    url : serverHosturl+"EnvironmentalParameters?build_env=dev"	
  }).then(function(response) {
     //alert(JSON.stringify(response.data));
	 if(response.data=="no_record")
	 {
			
		  $scope.iibhosts_d = "";
		  $scope.IIBNodes_d = "";
		  $scope.executionGroups_d = "";
		  $scope.BrokerName_d = "";
	 }
	 else
	 {
		 iibhost12= (response.data[0].iibhost).split(",");
		 IIBNode12 = (response.data[0].IIBNode).split(",");
		 executionGroup12 = (response.data[0].executionGroup).split(",");
		
		  $scope.iibhosts_d = iibhost12;
		  $scope.iibhost_d = $scope.iibhosts_d[0];
		  $scope.IIBNodes_d = IIBNode12;
		  $scope.IIBNode_d = $scope.IIBNodes_d[0];
		  $scope.executionGroups_d = executionGroup12;
		  $scope.executionGroup_d = $scope.executionGroups_d[0];
		  $scope.BrokerName_d = response.data[0].BrokerName;
	 }
	      
    });    
	 }
	 
	 $scope.close3= function(){  
       document.getElementById('id03').style.display='none';
     
    };
	
	$scope.deploy= function(){  
       document.getElementById('id03').style.display='none';
	  var iibhost=$scope.iibhost_d;
		
		 var IIBNode=$scope.IIBNode_d;
		 
		var executionGroup=$scope.executionGroup_d;
	
		var BrokerName=$scope.BrokerName_d;
		
		//var svnpassword=$scope.svnpassword_d;
			
		
		 $http({
			method : "GET",
			url : serverHosturl+"libdeploy?build_env=dev"+
			"&iibhost="+iibhost+
			"&IIBNode="+IIBNode+
			"&executionGroup="+executionGroup+
			"&BrokerName="+BrokerName
			//"&svnpassword="+svnpassword
		}).then(function(response){
			
			$http({
            method : "GET",
            url : serverHosturl+"recentlibjobs?url_key="+Library_name
          }).then(function(response) {
			 // alert(JSON.stringify(response.data));
			  $scope.librarylog=response.data;
		  });
		
		
			
			if((response.data.search('Job_FAILED'))>0){
				alert("failed");
               /*  $timeout( function(){ $scope.status=false; }, 3000);
                document.getElementById('btns').style.display="none";
                document.getElementById('load').innerHTML="Build and Deploy";
                document.getElementById("roll").disabled = false;
              //  document.getElementById("promote").disabled = false;  */
             }
             else
             {
				 alert("success")
				/*  $timeout( function(){ $scope.status=false; }, 3000);
                 document.getElementById('btns').style.display="none";
                document.getElementById('load').innerHTML="Build and Deploy";
                document.getElementById("roll").disabled = false; */
               // document.getElementById("promote").disabled = false;
             }
			//	alert(response.data);
				
		}); 
    };
	
	$scope.rollbackdetails = function(){
		// alert("clicked the edit Library page");
		 $scope.buildmodal3=true;    
		document.getElementById('id04').style.display='block';
	 }
	 
	 $scope.close4= function(){  
       document.getElementById('id04').style.display='none';
     
    };
	
	$scope.rollback= function(){  
       document.getElementById('id04').style.display='none';
	 
	 // alert(LibraryName);
	 // alert(LibraryURL);
     
    };
	$scope.gotoLibList = function(){
		$state.go('app.libraryList');
	}
		
	
	
	
	
	});
 });