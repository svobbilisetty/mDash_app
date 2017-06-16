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
	 var interfacename1;
	 var flowname1;
	 var type;
	$http({
		method : "GET",
		url : "/public/serverHost.json"	
	}).then(function(response){
		serverHosturl = response.data.serverHosturl;
		
		$scope.viewflow= function(interfaceName){  
	//alert("in view page ==> "+interfaceName);
    $http({
    method : "GET",
    url : serverHosturl+"viewflow?interfaceName="+interfaceName
    }).then(function(response) {
     $state.go('app.viewinterface');
      }, function(response) {
     
    });
     
   }; 
    var build_env=["dev","test","prod"];
	   $scope.envs=build_env;
	   $scope.env=$scope.envs[0];
		
	$http({
		method : "GET",
		url : serverHosturl+"details"
	  }).then(function(response) {
	   //  alert(JSON.stringify(response.data));
	  
		  $scope.Interface_Name=response.data.interfaceName; 
		  $scope.Flow_Name=response.data.flowName;
		  interfacename1=response.data.interfaceName;
		  flowname1=response.data.flowName;
		  type=flowname1.split("_").pop();
		  $http({
    method : "GET",
    url : serverHosturl+"recentflowjobs?interface_name="+response.data.interfaceName+"&flowname="+response.data.flowName	
  }).then(function(response) {
	  $scope.flowjobs=response.data;  
  });
	});
			socket = io('http://localhost:9003');
			 socket.on('progress', function (data) {
				//alert(data);
				
				//alert(data.indexOf('_build'));
				//alert(data.includes("_build"));
				
				if((data.search('_Build'))>0){
					//alert("Build completed");
					fa7();
					fa4p()
				}else if((data.search('Library_Detection'))>0){
					//alert("Library_Detection completed");
					fa1();
					fa1p()
				}else if((data.search('Create_Config_Services'))>0){
					//alert("Create_Config_Services1 completed");
					fa2();
				}else if((data.search('Create_Queues'))>0){
					//alert("Create Queues completed");
					fa3();
					fa2p()
				}else if((data.search('Deploy'))>0){
					//alert("Deploy completed");
					fa4();
					fa3p()
									
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


$scope.passworddetails= function(){ 
$scope.passswordmodal=true;	
 document.getElementById('id03').style.display='block';
 document.getElementById('id01').style.display='none';
}
$scope.close3= function(){  
	   document.getElementById('id03').style.display='none';
     };
	 
	 
$scope.buildpassword= function(){  
	  // document.getElementById('id03').style.display='none';
	  $scope.build($scope.svnpassword);
     };


$scope.passworddetails1= function(){ 
$scope.passswordmodal1=true;	
 document.getElementById('id04').style.display='block';
 document.getElementById('id02').style.display='none';
}
$scope.close4= function(){  
	   document.getElementById('id04').style.display='none';
     };
	 
	 
$scope.buildpassword1= function(){  
	  // document.getElementById('id03').style.display='none';
	  $scope.build1($scope.svnpassword);
     };	 
			
		
	$scope.builddetails= function(){ 
		$scope.buildmodal=true;	
    document.getElementById('id01').style.display='block';	
 var build_env=$scope.env;	
	var iibhost1;
	var IIBNode1;
	var executionGroup1;
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
		
	$scope.build = function(svnpassword){ 
	document.getElementById('id03').style.display='none';
	btnm();
	document.getElementById("roll").disabled = true;
	//document.getElementById("promote").disabled = true;
	fa7reset();
	fa1reset();
	fa2reset();
	fa3reset();
	fa4reset();
	fa1preset();
	fa2preset();
	fa3preset();
	fa4preset();
	if(type=="Transform"){$scope.transformstatus=true;}else{$scope.status=true;}
	
	
		//alert("Clicked on Build");     
			
		   var build_env=$scope.env;
	    
	     var iibhost=$scope.iibhost;
		
		 var IIBNode=$scope.IIBNode;
		 
		var executionGroup=$scope.executionGroup;
	
		var BrokerName=$scope.BrokerName;
		
		//var svnpassword=$scope.svnpassword;
			//alert(svnpassword);
			//alert(iibhost);
	if(build_env=="dev"){	
		 $http({
			method : "GET",
			url : serverHosturl+"build?build_env="+build_env+
			"&iibhost="+iibhost+
			"&IIBNode="+IIBNode+
			"&executionGroup="+executionGroup+
			"&BrokerName="+BrokerName+
			"&svnpassword="+svnpassword
		}).then(function(response){
			
			if((response.data.search('Job_FAILED'))>0){
                $timeout( function(){ $scope.status=false; $scope.transformstatus=false;}, 3000);
                document.getElementById('btns').style.display="none";
                document.getElementById('load').innerHTML="Build and Deploy";
                document.getElementById("roll").disabled = false;
              //  document.getElementById("promote").disabled = false; 
             }
             else
             {
				 $timeout( function(){ $scope.status=false; $scope.transformstatus=false;}, 3000);
                 document.getElementById('btns').style.display="none";
                document.getElementById('load').innerHTML="Build and Deploy";
                document.getElementById("roll").disabled = false;
               // document.getElementById("promote").disabled = false;
             }
			//	alert(response.data);
				
		}); 
		}
		else
		{
					 $http({
			method : "GET",
			url : serverHosturl+"promote?build_env="+build_env+
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
              //  document.getElementById("promote").disabled = false; 
             }
             else
             {
				 $timeout( function(){ $scope.status=false; }, 3000);
                 document.getElementById('btns').style.display="none";
                document.getElementById('load').innerHTML="Build and Deploy";
                document.getElementById("roll").disabled = false;
               // document.getElementById("promote").disabled = false;
             }
			//	alert(response.data);
				
		}); 
		}
	
		
		
		
		
	}
	$scope.rollbackdetails= function(){ 
	document.getElementById('artifactory_numberDiv').style.display='block';
    //alert("rollback working");
	var build_env=$scope.env;	
        $scope.buildmodal1=true;    
         $scope.targets = ["Rollback","Decomission"];
          $scope.target = $scope.targets[0];
    document.getElementById('id02').style.display='block';   
   	
         $http({
    method : "GET",
    url : serverHosturl+"recentdeploy?interface_name="+interfacename1+"&flowname="+flowname1+"&build_env="+build_env    
 }).then(function(response) {
     // alert(JSON.stringify(response.data));
      if(response.data=="no_record")
     {
           alert("No Builds Available") ;
		   document.getElementById("execute").disabled = true;
          $scope.iibhost = "";
          $scope.IIBNode = "";
          $scope.executionGroup = "";
          $scope.BrokerName = "";
        // $scope.targets = "";
     }
     else
     {
        
          /* iibhost1= (response.data[0].iibhost).split(",");
		 IIBNode1 = (response.data[0].IIBNode).split(",");
		 executionGroup1 = (response.data[0].executionGroup).split(","); */
		
		  // $scope.iibhosts = iibhost1;
		  $scope.iibhost = response.data[0].iibhost;
		  document.getElementById("iibhost").readOnly = true;
		//  $scope.IIBNodes = IIBNode1;
		  $scope.IIBNode = response.data[0].IIBNode;
		  document.getElementById("IIBNode").readOnly = true;
		 //$scope.executionGroups = executionGroup1;
		  $scope.executionGroup = response.data[0].executionGroup;
		  document.getElementById("executionGroup").readOnly = true;
          $scope.BrokerName = response.data[0].BrokerName; 
		  document.getElementById("BrokerName1").readOnly = true;
     } 
          
   });    
   /*  $http({
    method : "GET",
    url : serverHosturl+"artifactory"	
  }).then(function(response) {
	 // alert(JSON.stringify(response.data));
	  $scope.artifactory_number = response.data.artifactory;  
  })    */ 
        
   }; 
    $scope.close1= function(){  
       document.getElementById('id02').style.display='none';
     
    };
    $scope.build1 = function(svnpassword){ 
	btnm1();
    document.getElementById('id04').style.display='none';
    document.getElementById('console2').innerHTML='';
    document.getElementById("deploy").disabled = true;
    //document.getElementById("promote").disabled = true;
	
     //  alert("Clicked on Build");     
            
          var build_env=$scope.env;	
        
         var iibhost=$scope.iibhost;
        
         var IIBNode=$scope.IIBNode;
                 
        var executionGroup=$scope.executionGroup;
    
        var BrokerName=$scope.BrokerName;
		
		var artifactory_number=$scope.artifactory_number;
		
        var target=$scope.target;
		 
		//var svnpassword=$scope.svnpassword;
        
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
                    // document.getElementById("promote").disabled = false;
                   // alert("rollback job triggerd");
                 }
                 else{
                     document.getElementById('btns1').style.display="none";
                     document.getElementById('load1').innerHTML="Rollback and Decomission";
                     document.getElementById("deploy").disabled = false;
                   //  document.getElementById("promote").disabled = false;
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
    document.getElementById('btns').style.display="inline-flex";
    document.getElementById('load').innerHTML="&nbsp&nbsp;Job in Progress";  
}
function btnm1(){
    document.getElementById('btns1').style.display="inline-flex";
    document.getElementById('load1').innerHTML="&nbsp;Rollback in progress";
    
}
$scope.fieldspop = function(){
	 var iibhost1;
	var IIBNode1;
	var executionGroup1;
  var build_env=$scope.env;
if(build_env=="prod" || build_env=="test")
{document.getElementById('promote').innerHTML="&nbsp&nbsp;Promote";}
else{document.getElementById('promote').innerHTML="&nbsp&nbsp;Build Now";}	
	$http({
    method : "GET",
    url : serverHosturl+"EnvironmentalParameters?build_env="+build_env	
  }).then(function(response) {
     // alert(JSON.stringify(response.data));
	 if(response.data=="no_record")
	 {
			
		 $scope.iibhosts = "";
		 $scope.IIBNodes = "";
		 $scope.executionGroups = "";
		 //$scope.mqsiprofile = "";
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
	 }
	      
    });   	
	
}
$scope.changepopup = function(){
	
  var build_env=$scope.env;
	
	$http({
    method : "GET",
    url : serverHosturl+"recentdeploy?interface_name="+interfacename1+"&flowname="+flowname1+"&build_env="+build_env    
 }).then(function(response) {
      //alert(JSON.stringify(response.data));
	 if(response.data=="no_record")
	 {
			alert("No Builds Available") ;	//alert("no records");
			document.getElementById("execute").disabled = true;
		 $scope.iibhost = "";
          $scope.IIBNode = "";
          $scope.executionGroup = "";
          $scope.BrokerName = "";
	 }
	 else
	 {
		 
		
		 document.getElementById("execute").disabled = false;
		   $scope.iibhost = response.data[0].iibhost;
		  document.getElementById("iibhost").readOnly = true;
		//  $scope.IIBNodes = IIBNode1;
		  $scope.IIBNode = response.data[0].IIBNode;
		  document.getElementById("IIBNode").readOnly = true;
		 //$scope.executionGroups = executionGroup1;
		  $scope.executionGroup = response.data[0].executionGroup;
		  document.getElementById("executionGroup").readOnly = true;
          $scope.BrokerName = response.data[0].BrokerName; 
		  document.getElementById("BrokerName1").readOnly = true;
	 }
	      
    });   	
	
}

	})
 })