'use strict';

/**
* @ngdoc function
* @name minovateApp.controller:PagesLoginCtrl
* @description
* # PagesLoginCtrl
* Controller of the minovateApp
*/
 app.controller('AddInterface', function ($scope, $state,$http,$window,$location,$timeout) {
	// alert("enterd add interface");
	 var  serverHosturl;
	 var svnrepohost
	 $http({
			method : "GET",
			url : "/public/serverHost.json"	
		  }).then(function(response){
			serverHosturl = response.data.serverHosturl;
			svnrepohost = response.data.svnrepohost;
           // alert(serverHosturl);				
        $scope.folder=false;
		$scope.create=false;
		$scope.enablecf = function() 
		{ 
		$scope.folder=true;
		document.getElementById("button").disabled = false;
		} 	
	// alert(serverHosturl);	 
  $scope.submit = function() 
    {
		
   var interface_name = $scope.interface_name;
   var flowname = $scope.flowname;	
   var last = flowname.split("_").pop();
   var  Remote_SVN_Path = $scope.Remote_SVN_Path;
   var Remote_SVN_URL = svnrepohost+Remote_SVN_Path;
   		   
   // alert(flowname);
   // alert(last);
	//alert(Remote_SVN_URL);
	
		 
   
   $http({
    method : "GET",
    url : serverHosturl+"CInterface?flowname="+flowname+
	"&folder="+last+
	"&Remote_SVN_URL="+Remote_SVN_URL+
	"&interface_name="+interface_name
  }).then(function(response) {
      alert(response.data);
	  if(response.data=="created"){
	  $scope.create=true;
	  $scope.flow=flowname;
	  }
    }, function(response) {
      
  });  
   } ;
   
   
   $scope.createfolder= function()
		{
		 var flowname=$scope.flowname;
		// alert(flowname);
		 var last = flowname.split("_").pop();
		// alert(last);
		 var  Remote_SVN_Path = $scope.Remote_SVN_Path;
        var Remote_SVN_URL = svnrepohost+Remote_SVN_Path;
		 // var  TCPIPServer_Command = $scope.TCPIPServer_Command;
		 $http({
					method : "GET",
					url : serverHosturl+"createBuildFolder?flowname="+flowname+"&type="+last+"&Remote_SVN_URL="+Remote_SVN_URL
				}).then(function(response){
					alert(" folder commited");
					/* $timeout( function(){                  
                        $window.location.href=serverHosturl+"downloadFolder";
                        }, 1000 ); */
					//$window.location.href=serverHosturl+"downloadFolder";
					//$scope.folder=false;
					//document.getElementById("button").disabled = true;
				});
		}
		
	 $scope.addItem = function()	
	 {
		 $scope.create=false;
		 $scope.flowname = "";
         $scope.Remote_SVN_Path = "";
        
	 }
	 $scope.saveInterface = function(){
        var interface_name = $scope.interface_name;
        /*CREATE folder*/
		
		
		 var flowname=$scope.flowname;
		// alert(flowname);
		 var last = flowname.split("_").pop();
		// alert(last);
		 var  Remote_SVN_Path = $scope.Remote_SVN_Path;
        var Remote_SVN_URL = svnrepohost+Remote_SVN_Path;
		 // var  TCPIPServer_Command = $scope.TCPIPServer_Command;
		 $http({
					method : "GET",
					url : serverHosturl+"createBuildFolder?flowname="+flowname+"&type="+last+"&Remote_SVN_URL="+Remote_SVN_URL
				}).then(function(response){
					alert(" folder commited");
					/*CREATE Flow*/
											
							
					   var interface_name = $scope.interface_name;
					   var flowname = $scope.flowname;	
					   var last = flowname.split("_").pop();
					   var  Remote_SVN_Path = $scope.Remote_SVN_Path;
					   var Remote_SVN_URL = svnrepohost+Remote_SVN_Path;
							   
						//alert(flowname);
						//alert(last);
						//alert(Remote_SVN_URL);
						
							 
					   
					   $http({
						method : "GET",
						url : serverHosturl+"CInterface?flowname="+flowname+
						"&folder="+last+
						"&Remote_SVN_URL="+Remote_SVN_URL+
						"&interface_name="+interface_name
					  }).then(function(response) {
						  alert(response.data);
						  if(response.data=="created"){
						  $scope.create=true;
						  $scope.flow=flowname;
						  
						  $http({
								method : "GET",
								url : serverHosturl+"saveInterface?interface_name="+interface_name
							}).then(function(response){
								$state.go('app.dashboard');
							});
						  }
						  
						}, function(response) {
						  
					  }); 
					/*CReate  Flow*/
				});
		
		/*Create folder*/
        
    }
		
 
 });
 });