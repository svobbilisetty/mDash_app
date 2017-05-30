'use strict';

/**
* @ngdoc function
* @name minovateApp.controller:PagesLoginCtrl
* @description
* # PagesLoginCtrl
* Controller of the minovateApp
*/
/*  app.controller('configurationsPage', function ($scope, $state,$http,$window,$location) {
	 alert("enterd configurationsPage");
	 var  serverHosturl;
	 $http({
			method : "GET",
			url : "/public/serverHost.json"	
		  }).then(function(response){
			serverHosturl = response.data.serverHosturl;
           alert(serverHosturl);				

   /* $scope.selected = function()
   {
	   var build_env=$scope.build_env.value;
	   alert($scope.build_env.value);
	    $http({
    method : "GET",
    url : serverHosturl+"CentralizedParameters"
  }).then(function(response) {
     // alert(JSON.stringify(response.data));
		  $scope.username = response.data[0].username;	
		  $scope.password = response.data[0].password;
		  $scope.ArtifactoryURL = response.data[0].ArtifactoryURL;
		  $scope.ArtifactoryUserName = response.data[0].ArtifactoryUserName;
		  $scope.ArtifactoryPassword = response.data[0].ArtifactoryPassword;
		  $scope.svnhost = response.data[0].svnhost;
		  $scope.SVNBaseURL = response.data[0].SVNBaseURL;
		  $scope.SVNUserName = response.data[0].SVNUserName;
		  $scope.SVNPassword = response.data[0].SVNPassword;
	  
    })
	
	 $http({
    method : "GET",
    url : serverHosturl+"EnvironmentalParameters?build_env="+build_env	
  }).then(function(response) {
     // alert(JSON.stringify(response.data));
	 if(response.data=="no_record")
	 {
		 $scope.toolkithome = "";	
		  $scope.iibhost = "";
		  $scope.IIBNode = "";
		  $scope.executionGroup = "";
		  $scope.deployment_path = "";
		  $scope.mqsiprofile = "";
		  $scope.BrokerName = "";
	 }
	 else
	 {
		 $scope.toolkithome = response.data[0].toolkithome;	
		  $scope.iibhost = response.data[0].iibhost;
		  $scope.IIBNode = response.data[0].IIBNode;
		  $scope.executionGroup = response.data[0].executionGroup;
		  $scope.deployment_path = response.data[0].deployment_path;
		  $scope.mqsiprofile = response.data[0].mqsiprofile;
		  $scope.BrokerName = response.data[0].BrokerName;
	 }
	      
    });   
    } 
   
   
  $scope.submit = function() 
    {
		alert("enterd submit of cen");
		alert($scope.username);
		alert($scope.password);
  var  username = $scope.username;	
  var  password = $scope.password;
  var  ArtifactoryURL = $scope.ArtifactoryURL;
  var  ArtifactoryUserName = $scope.ArtifactoryUserName;
  var  ArtifactoryPassword = $scope.ArtifactoryPassword;
  var  svnhost = $scope.svnhost;
  var  SVNBaseURL = $scope.SVNBaseURL;
  var  SVNUserName = $scope.SVNUserName;
  var  SVNPassword = $scope.SVNPassword;
 
  
		   
    /*  $http({
    method : "GET",
    url : serverHosturl+"SaveCentralizedParameters?username="+username+
	"&password="+password+
	"&ArtifactoryURL="+ArtifactoryURL+
	"&ArtifactoryUserName="+ArtifactoryUserName+
	"&ArtifactoryPassword="+ArtifactoryPassword+
	"&svnhost="+svnhost+
	"&SVNBaseURL="+SVNBaseURL+
	"&SVNUserName="+SVNUserName+
	"&SVNPassword="+SVNPassword	
  }).then(function(response) {
      alert(response.data);
    }); 

   } ;
    $scope.submit1 = function() 
    {
		alert("enterd submit of env")
  var  build_env = $scope.build_env;
  var  toolkithome = $scope.toolkithome;
  var  iibhost = $scope.iibhost;
  var  IIBNode = $scope.IIBNode;
  var  executionGroup = $scope.executionGroup;
  var  deployment_path = $scope.deployment_path;
  var  mqsiprofile = $scope.mqsiprofile;
  var  BrokerName = $scope.BrokerName;

	 $http({
    method : "GET",
    url : serverHosturl+"SaveEnvironmentalParameters?build_env="+build_env+
	"&toolkithome="+toolkithome+
	"&iibhost="+iibhost+
	"&IIBNode="+IIBNode+
	"&executionGroup="+executionGroup+
	"&deployment_path="+deployment_path+
	"&BrokerName="+BrokerName+
	"&mqsiprofile="+mqsiprofile		
  }).then(function(response) {
      alert(response.data);
    });

   } 
   
 
 });
 }); */
 
 app.controller('AccordionDemoCtrl1', function ($scope, $state,$http,$window,$location) {
  // alert("enterd configurationsPage");
	 var  serverHosturl;
	 $http({
			method : "GET",
			url : "/public/serverHost.json"	
		  }).then(function(response){
			serverHosturl = response.data.serverHosturl;
         //  alert(serverHosturl);	


  $scope.oneAtATime = true;
	

    $scope.groups = [
      {
        title: 'Dynamic Group Header - 1',
        content: 'Dynamic Group Body - 1'
      },
      {
        title: 'Dynamic Group Header - 2',
        content: 'Dynamic Group Body - 2'
      }
    ];

    $scope.items = ['Item 1', 'Item 2', 'Item 3'];

    $scope.addItem = function() {
      var newItemNo = $scope.items.length + 1;
      $scope.items.push('Item ' + newItemNo);
    };

    $scope.status = {
      isFirstOpen: true,
      isFirstDisabled: false
    };
	 $http({
    method : "GET",
    url : serverHosturl+"CentralizedParameters"
  }).then(function(response) {
     // alert(JSON.stringify(response.data));
		  $scope.username = response.data[0].username;	
		  $scope.password = response.data[0].password;
		  $scope.ArtifactoryURL = response.data[0].ArtifactoryURL;
		  $scope.ArtifactoryUserName = response.data[0].ArtifactoryUserName;
		  $scope.ArtifactoryPassword = response.data[0].ArtifactoryPassword;
		  $scope.svnhost = response.data[0].svnhost;
		  $scope.SVNBaseURL = response.data[0].SVNBaseURL;
		  $scope.SVNUserName = response.data[0].SVNUserName;
		  $scope.SVNPassword = response.data[0].SVNPassword;
	  
    })
	
	$scope.submit = function() 
    {
		//alert("enterd submit of cen");
		//alert($scope.username);
		//alert($scope.password);
  var  username = $scope.username;	
  var  password = $scope.password;
  var  ArtifactoryURL = $scope.ArtifactoryURL;
  var  ArtifactoryUserName = $scope.ArtifactoryUserName;
  var  ArtifactoryPassword = $scope.ArtifactoryPassword;
  var  svnhost = $scope.svnhost;
  var  SVNBaseURL = $scope.SVNBaseURL;
  var  SVNUserName = $scope.SVNUserName;
  var  SVNPassword = $scope.SVNPassword;
 
  
		   
     $http({
    method : "GET",
    url : serverHosturl+"SaveCentralizedParameters?username="+username+
	"&password="+password+
	"&ArtifactoryURL="+ArtifactoryURL+
	"&ArtifactoryUserName="+ArtifactoryUserName+
	"&ArtifactoryPassword="+ArtifactoryPassword+
	"&svnhost="+svnhost+
	"&SVNBaseURL="+SVNBaseURL+
	"&SVNUserName="+SVNUserName+
	"&SVNPassword="+SVNPassword	
  }).then(function(response) {
      alert(response.data);
    }); 

   } ;
	
	
	
	 })
  })
  
  app.controller('EnvController', function ($scope, $state,$http,$window,$location) {
  // alert("enterd configurationsPage");
	 var  serverHosturl;
	 $http({
			method : "GET",
			url : "/public/serverHost.json"	
		  }).then(function(response){
			serverHosturl = response.data.serverHosturl;
         //  alert(serverHosturl);	
    var build_env=$scope.build_env;
	$http({
    method : "GET",
    url : serverHosturl+"EnvironmentalParameters?build_env="+build_env	
  }).then(function(response) {
     // alert(JSON.stringify(response.data));
	 if(response.data=="no_record")
	 {
		 $scope.toolkithome = "";	
		  $scope.iibhost = "";
		  $scope.IIBNode = "";
		  $scope.executionGroup = "";
		  $scope.deployment_path = "";
		  $scope.mqsiprofile = "";
		  $scope.BrokerName = "";
	 }
	 else
	 {
		 $scope.toolkithome = response.data[0].toolkithome;	
		  $scope.iibhost = response.data[0].iibhost;
		  $scope.IIBNode = response.data[0].IIBNode;
		  $scope.executionGroup = response.data[0].executionGroup;
		  $scope.deployment_path = response.data[0].deployment_path;
		  $scope.mqsiprofile = response.data[0].mqsiprofile;
		  $scope.BrokerName = response.data[0].BrokerName;
	 }
	      
    });   	 
	
	$scope.submit1 = function() 
    {
		//alert("enterd submit of env");
		//alert($scope.build_env);
  var  build_env = $scope.build_env;
  var  toolkithome = $scope.toolkithome;
  var  iibhost = $scope.iibhost;
  var  IIBNode = $scope.IIBNode;
  var  executionGroup = $scope.executionGroup;
  var  deployment_path = $scope.deployment_path;
  var  mqsiprofile = $scope.mqsiprofile;
  var  BrokerName = $scope.BrokerName;

	  $http({
    method : "GET",
    url : serverHosturl+"SaveEnvironmentalParameters?build_env="+build_env+
	"&toolkithome="+toolkithome+
	"&iibhost="+iibhost+
	"&IIBNode="+IIBNode+
	"&executionGroup="+executionGroup+
	"&deployment_path="+deployment_path+
	"&BrokerName="+BrokerName+
	"&mqsiprofile="+mqsiprofile		
  }).then(function(response) {
      alert(response.data);
    }); 

   } 
	
	
	
	 })
  })