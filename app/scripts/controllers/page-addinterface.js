'use strict';

/**
* @ngdoc function
* @name minovateApp.controller:PagesLoginCtrl
* @description
* # PagesLoginCtrl
* Controller of the minovateApp
*/
 app.controller('AddInterface', function ($scope, $state,$http,$window,$location,$timeout,$parse) {
	 //alert("enterd add interface");
	 var  serverHosturl;
	$scope.buildmodal=false;
	// var svnrepohost;
	 var flownames1=[];
	 var interfacenames=[];
	 var svnurl;
	var i;
	var j;
	var x;
	var repo;
	 $scope.interfaceList=function(){
		  //alert("HAI");
		  $state.go('app.interfacelist');
	  }
	  
	  
	 $http({
			method : "GET",
			url : "/public/serverHost.json"	
		  }).then(function(response){
			serverHosturl = response.data.serverHosturl;
			//svnrepohost = response.data.svnrepohost;
           // alert(serverHosturl); 
 /*  $http({
    method : "GET",
    url : serverHosturl+"CentralizedParameters"
    }).then(function(response2) {
		// svnrepohost = response2.data[0].SVNBaseURL;
		// alert(svnrepohost); 
	}); */
	
      $http({
    method : "GET",
    url : serverHosturl+"interfaceretrive"
    }).then(function(response1) {
      //alert(response1.data);
	   var s=JSON.stringify(response1.data.interfaceretrive);
    var res=s.replace(/{|:|}|,/g, "");
   var res1=res.replace(/interface_name"/g, ",");
   var res2=res1.replace(/",/g, ",");
   var res3=res2.replace(/\[,/g, "["); 
   interfacenames=JSON.parse(res3);
   //alert(interfacenames);
   
    var s1=JSON.stringify(response1.data.flownameretrive);
    var res1=s1.replace(/{|:|}|,/g, "");
   var res11=res1.replace(/flowname"/g, ", ");
   var res21=res11.replace(/",/g, ",");
   var res31=res21.replace(/\[,/g, "["); 
   flownames1=JSON.parse(res31);
   //alert(flownames1);
    $(document).ready(
  /* This is the function that will get executed after the DOM is fully loaded */
  function () {
 
	$( "#Interface" ).autocomplete({
      /*Source refers to the list of fruits that are available in the auto complete list. */
      source:interfacenames,
      /* auto focus true means, the first item in the auto complete list is selected by default. therefore when the user hits enter,
      it will be loaded in the textbox */
      autoFocus: true ,

    });
	$( "#inputflow1" ).autocomplete({
      /*Source refers to the list of fruits that are available in the auto complete list. */
      source:flownames1,
      /* auto focus true means, the first item in the auto complete list is selected by default. therefore when the user hits enter,
      it will be loaded in the textbox */
      autoFocus: true ,

    });
  }
);
	  }); 
	
	  
	  
 

		 $scope.saveInterface1 = function()
		 {
				$scope.buildmodal=true;	
				document.getElementById('id01').style.display='block';
				//alert($scope.svnpassword);
				//$scope.saveInterface();
		 }
		 $scope.save = function(){
			 	//alert($scope.svnpassword);
				$scope.saveInterface($scope.svnpassword);
				$scope.disableall=true;
		 }
		 $scope.close= function(){  
       document.getElementById('id01').style.display='none';
     
    };
		 $scope.saveInterface = function(svnpassword)
		 {
			 $scope.close();
			 btnm();
			// alert("enterd saveInterface")
				var interface_name = $scope.interface_name;
				//var svnpassword = $scope.svnpassword;
				//alert($scope.svnpassword);
				 var no_rows = document.getElementById("svnTable").rows.length;
				// alert(no_rows);
				var no_flows=no_rows-1;
//alert(no_flows);
				var flow_names=[];
				var last=[];
				var Remote_SVN_URLs=[];
				 /* var flowname ;	
			     var last ;
			     var Remote_SVN_URL; */
				for( i=0;i<no_flows;i++)
				{
					flow_names[i]= document.getElementById("inputflow"+(i+1)).value;
					last[i]=flow_names[i].split("_").pop();
					Remote_SVN_URLs[i]=document.getElementById("inputsvn"+(i+1)).value;
					//Remote_SVN_URLs[i]=svnrepohost+document.getElementById("inputsvn"+(i+1)).value;
					
				}	
                   // alert(flow_names)	;	
					//alert(last)	;	
					//alert(Remote_SVN_URLs)	;
					
				/* $http({
								method : "GET",
								url : serverHosturl+"AddInterface?interface_name="+interface_name+
								"&flow_names="+flow_names+
								"&type="+last+
								"&Remote_SVN_URLs="+Remote_SVN_URLs+
								"&length="+no_flows
							}).then(function(response){
								alert("flows created and interface saved")
							}); 
				*/
				buildFolderTest(flow_names,last,Remote_SVN_URLs,interface_name,no_flows,svnpassword);
				
		 }
		 
		 
var count=1;
$scope.myFunction1 = function()
		 {
			 
			   x = document.getElementById("svnTable").rows.length; 
	 
   var node = document.createElement("tr");
	node.setAttribute("id",x);
	node.innerHTML="<td ><input class='form-control' placeholder='Flow Name' type='text' ng-model='flowname"+x+"' id='inputflow"+x+"' ng-keyup='myFunc2()' required/>	</td><td><input class='form-control' placeholder='SVN Path for Flow' id='inputsvn"+x+"' type='text' ng-model='Remote_SVN_Path"+x+"'  required/></td>   <td><button class='btn btn-sm btn-danger' ng-click='rate = 0' ng-disabled='isReadonly' onclick='del("+x+")'>x</button></td>"
 var newButt = angular.element(node);
    newButt.bind('keyup', $scope.myFunc2);
    angular.element(document.getElementById("myList")).append(newButt);
   // document.getElementById("myList").appendChild(node);
count++;
$(document).ready(
  
  /* This is the function that will get executed after the DOM is fully loaded */
  function () {
    
  /* binding the text box with the jQuery Auto complete function. */
    $( "#inputflow"+x ).autocomplete({
      /*Source refers to the list of fruits that are available in the auto complete list. */
      source:flownames1,
      /* auto focus true means, the first item in the auto complete list is selected by default. therefore when the user hits enter,
      it will be loaded in the textbox */
      autoFocus: true ,

    });
  }

);
			 
}
$scope.myFunc = function(i) {
	document.getElementById("inputsvn"+i).disabled = false;
	var text=document.getElementById("inputflow"+i).value;
	//var text =$scope.flowname;
	//	alert(text);
        $http({
                method : "GET",
                url : serverHosturl+"svnurlretrive?flowname="+text
              }).then(function(response) {
                 // alert(JSON.stringify(response.data));
                  if(response.data=="no_match")
                  {
                      $scope.Remote_SVN_Path1="";
                  }
                  else{
					  // alert(svnrepohost);
					  // alert(response.data[0].svn_url);
                        //  repo = response.data[0].svn_url.replace(svnrepohost, "");
					
					 // alert(repo);
					 document.getElementById("inputsvn"+i).disabled = true;
                      $scope.Remote_SVN_Path1=response.data[0].svn_url;
                  }
              })
      };
	  
	  
	  
$scope.myFunc2 = function() {
//alert(this.id);
var i=this.id;
//alert("i: "+i.toSource());	
    document.getElementById("inputsvn"+i).disabled = false;
	var text=document.getElementById("inputflow"+i).value;
	//var text =$scope.flowname;
		//alert(text);
        $http({
                method : "GET",
                url : serverHosturl+"svnurlretrive?flowname="+text
              }).then(function(response) {
                 // alert(JSON.stringify(response.data));
                  if(response.data=="no_match")
                  {
					  //alert(document.getElementById("inputsvn"+(i)).value);
                      //document.getElementById("inputsvn"+(i)).value="";
                  }
                  else{
					//  repo = response.data[0].svn_url.replace(svnrepohost, "");
					 document.getElementById("inputsvn"+i).disabled = true;
                      document.getElementById("inputsvn"+(i)).value=response.data[0].svn_url;
                  }
              })
      };	  
	  
	  
	  
	  
	   function buildFolderTest(flow_names,last,Remote_SVN_URLs,interface_name,no_flows,svnpassword){
					var flow_names1 = flow_names.shift();
					var last1=last.shift();
					var Remote_SVN_URLs1 = Remote_SVN_URLs.shift();
					//alert("flow_names -> "+flow_names1);
				 $http({
								method : "GET",
								url : serverHosturl+"createBuildFolder?interface_name="+interface_name+
								"&flowname="+flow_names1+
								"&type="+last1+
								"&Remote_SVN_URL="+Remote_SVN_URLs1+
								"&svnpassword="+svnpassword
							}).then(function(response){
								if(response.data == "Authentication Failed"){
									alert(response.data);
									$scope.disableall=false;
									$state.go('app.interfacelist');
								}
								//alert("response: "+response.data);
								 else if (flow_names.length > 0) {   //callback
									buildFolderTest(flow_names,last,Remote_SVN_URLs,interface_name,no_flows,svnpassword)
								 }
								 else
								 {
							$http({
                                method : "GET",
                                url : serverHosturl+"saveInterface?interface_name="+interface_name
                            }).then(function(response){
								$scope.disableall=false;
                                $state.go('app.interfacelist');
                            });
								 }
							}); 
		 }
	  
	  
function btnm(){
    document.getElementById('btns').style.display="block";
    document.getElementById('load').innerHTML="&nbsp;&nbsp;Creating Interface";
    document.getElementById('load').style.fontWeight="bold";
    document.getElementById("showAccordian").disabled = true;
}	  
	  
 
 });
 });
 

