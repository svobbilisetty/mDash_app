var express = require('express');
var http = require('http');
var fs=require('fs');
var app = express();
var path = require('path');
var MongoClient = require('mongodb').MongoClient;
var body = require('body-parser');
var server = http.createServer(app);
server.listen(9003);
var io = require('socket.io')(server);
//var io = require('socket.io').listen(server);
var nodemailer = require('nodemailer');
var rmdirSync = require('rmdir-sync');
var request1 = require('request');
var dir = './Build';
var zipFolder = require('zip-folder');
var config = require('./public/serverHost.json');
console.log(config.jenkinurl);
var jenkins = require('jenkins')({ baseUrl: config.jenkinurl});
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');
app.use(body.json());

var fs1 = require('fs-extra'); 
var svnUltimate = require('node-svn-ultimate');
var svnUltimate1 = require('svn-info');
var client;
var loginuser;
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

io.on('connection',function(client1){
		client = client1;
		console.log("Client connected........");
	});
	
app.post('/serverlogin', function (req, res) {
   console.log("entered login module");  
   response= {
      "uname":req.body.uname,
      "password":req.body.password
             };
  console.log(response);
   console.log(config.mongodburl);
 MongoClient.connect(config.mongodburl, function(err, db) {
 if(db){
            var collection = db.collection('users');
            
            if(collection){
                collection.find({uname : response.uname}).toArray(function (finderror, result) {
                    if(finderror)
					    {
                        console.log("Unable to execute find operation");
                        }
				    else
					    {
                          if(result.length > 0)
						   {
                            console.log("Record exists");
							console.log('Found:', result[0]);
		                    console.log(config.mongodburl);
		                    uname=result[0].uname;
							password=result[0].password;
		
							if(uname==response.uname && password==response.password)
								{
									console.log(response.uname+"  "+response.password);
									var collection = db.collection('user_role');
									if(collection)
									{
										 collection.find({uname : response.uname}).toArray(function (finderror, result1) {
											if(finderror)
												{
													console.log("Unable to execute find operation");
												}
											else
												{
													if(result1.length > 0)
													{
														console.log(result1[0].role_name);
														role=result1[0].role_name
														if(role=="admin")
														{
															loginuser = uname;
															password = password;
															res.send("admin");
														}
														else
														{
															if(result[0].status=="pending")
															{
															  res.send("status_pending");
															}
															else
															{
																loginuser = uname;
																password = password;
																res.send("user");
															}
															
														}
													}
													else
													{
														console.log("records not found");
													}
												}
										 })
									}
									else
									{
										console.log("collection not found");
								    }		 
								}
							else
								{
									console.log("invalid password");
									res.send("invalid_credentials");
								} 
                           }
						   else
						   {
                            console.log("no records found");
                           
                           }
                    }
                });
        }else{console.log("collection not found");}
            
        }else{console.log("error is connecting to db");}
})
}) ;

app.get('/CInterface', function(req, res){
	console.log("createInterface");
	// interface_name = req.query.interface_name;
  //   flowname = req.query.flowname;	
	// folder = req.query.folder;
	// Remote_SVN_URL = req.query.Remote_SVN_URL;
	 folder=type;
 
	 console.log(Remote_SVN_URL);
	 
	 MongoClient.connect(config.mongodburl, function(err, db) {
    if(db){
            var collection = db.collection('CentralizedParameters');
            
           if(collection){
                collection.find({}).toArray(function (finderror, result)
                {
                
                   if(finderror)
                        {
                        console.log("Unable to execute find operation");
                        }
                   else if (result.length)
                        {
                             console.log(result[0].JavaUtilitySVNPath);
                              console.log(result[0].SVNLibraryRootPath);
                               console.log(result[0].WSDLSVNPath);
    
                    var JavaUtilitySVNPath = result[0].JavaUtilitySVNPath;
                    var SVNLibraryRootPath = result[0].SVNLibraryRootPath;
                    var WSDLSVNPath = result[0].WSDLSVNPath;
	 
	 
	 
	
	  /* rmdir(__dirname+'/job_configfiles', function(error){
                if(error){
                    console.log(error);
                }
            }); */	
	 if (!fs.existsSync('C:\\Ruby23\\files\\job_configfiles')){
		 console.log("created new folder");
        fs.mkdirSync('C:\\Ruby23\\files\\job_configfiles');        
        }	else{
			console.log("folder exists");
			rmdirSync('C:\\Ruby23\\files\\job_configfiles', function(error){
                if(error){
                    console.log(error);
                }
            });
			console.log("folder removed");
			fs.mkdirSync('C:\\Ruby23\\files\\job_configfiles');        
			console.log("Created a new folder after deleting");
		}
		if(!(folder == 'Transform')){
			/*Changes for Create_config_job.xml file*/
			var data = fs.readFileSync(__dirname+'/job_templates/Create_Config_Services.xml', 'utf-8');
			var newValue = data.replace(/Remote_SVN_URL/gim, Remote_SVN_URL);
			var newValue1 = newValue.replace(/TCPIPServer_Command/gim, TCPIPServer_Command);
			var newValue2 = newValue1.replace(/Flow_Name/gim, flowname);
	        var newValue3 = newValue2.replace(/Flow_Type/gim, folder);
			fs.writeFileSync('C:\\Ruby23\\files\\job_configfiles\\Create_Config_Services.xml',newValue3, 'utf-8');
			/*Changes for Create_config_job.xml file*/
		}else{
			console.log("Folder is "+folder+". So, skipped creating this job Create_Config_job");
		}
	
		
	/*Changes for Create_Queues.xml file*/
    var data = fs.readFileSync(__dirname+'/job_templates/Create_Queues.xml', 'utf-8');
    var newValue = data.replace(/Remote_SVN_URL/gim, Remote_SVN_URL);
	var newValue1 = newValue.replace(/Flow_Name/gim, flowname);
	var newValue2 = newValue1.replace(/Flow_Type/gim, folder);
    fs.writeFileSync('C:\\Ruby23\\files\\job_configfiles\\Create_Queues.xml',newValue2, 'utf-8');
    /*Changes for Create_Queues.xml file*/
	
	/*Changes for Deploy_to_test.xml file*/
    var data = fs.readFileSync(__dirname+'/job_templates/Deploy_to_test.xml', 'utf-8');
    var newValue = data.replace(/Remote_SVN_URL/gim, Remote_SVN_URL);
    var newValue1 = newValue.replace(/Flow_Name/gim, flowname);
    var newValue2 = newValue1.replace(/Flow_Type/gim, folder);
    fs.writeFileSync('C:\\Ruby23\\files\\job_configfiles\\Deploy.xml',newValue2, 'utf-8');
    /*Changes for Deploy_to_test.xml file*/
	
	/*Changes for Flow_name_Build.xml file*/
    var data = fs.readFileSync(__dirname+'/job_templates/Flow_name_Build.xml', 'utf-8');
    var newValue = data.replace(/Remote_SVN_URL/gim, Remote_SVN_URL);
	var newValue1 = newValue.replace(/Flow_Name/gim, flowname);
	var newValue2 = newValue1.replace(/Flow_Type/gim, folder);
	var newValue3 = newValue2.replace(/Java_Utility_SVN_Path/gim, JavaUtilitySVNPath);
    var newValue4 = newValue3.replace(/SVN_Library_Root_Path/gim, SVNLibraryRootPath);
     var newValue5 = newValue4.replace(/WSDL_SVN_Path/gim, WSDLSVNPath);
    fs.writeFileSync('C:\\Ruby23\\files\\job_configfiles\\'+flowname+'_Build.xml',newValue5, 'utf-8');
    /*Changes for Flow_name_Build.xml file*/
	
	/*Changes for Library_Detection.xml file*/
    var data = fs.readFileSync(__dirname+'/job_templates/Library_Detection.xml', 'utf-8');
    var newValue = data.replace(/Remote_SVN_URL/gim, Remote_SVN_URL);
	var newValue1 = newValue.replace(/Flow_Name/gim, flowname);
	var newValue2 = newValue1.replace(/Flow_Type/gim, folder);
	var newValue3 = newValue2.replace(/Java_Utility_SVN_Path/gim, JavaUtilitySVNPath);
    fs.writeFileSync('C:\\Ruby23\\files\\job_configfiles\\Library_Detection.xml',newValue3, 'utf-8');
    /*Changes for Library_Detection.xml file*/
	
	/*Changes for Rollback_test.xml file*/
    var data = fs.readFileSync(__dirname+'/job_templates/Rollback_test.xml', 'utf-8');
	var newValue = data.replace(/Remote_SVN_URL/gim, Remote_SVN_URL);
    var newValue1 = newValue.replace(/TCPIPServer_Command/gim, TCPIPServer_Command);
    var newValue2 = newValue1.replace(/Flow_Name/gim, flowname);
	var newValue3 = newValue2.replace(/Flow_Type/gim, folder);
    fs.writeFileSync('C:\\Ruby23\\files\\job_configfiles\\Rollback_Decomission.xml',newValue3, 'utf-8');
    /*Changes for Rollback_test.xml file*/
	
	
		 if (fs.existsSync('C:\\Ruby23\\files\\job_configfiles/'+flowname+'_Build.xml')){
		   res.redirect('/createjob');      
		}
	
	
	
	}
                        else
                        {
                            console.log("no records found");
                        }
    
                })
            }
    }
 });
	 
});

app.get('/createjob', function (req, res) {
	
   console.log("entered createjob");   
 fs.readFile(__dirname+'/configfolder.xml','UTF-8', function(err, data) {
	   if (err) {
		   throw err;
	   }
	   xml = data;
		console.log(xml);
		console.log(folder);
    jenkins.job.exists(folder, function(err, exists) {
				   if (exists==false)
						{
							console.log("doesnot exist");
												jenkins.job.create(folder,xml, function(err){
												if (err) throw err;
												console.log("folder created");
												fs.readFile(__dirname+'/configfolder.xml','UTF-8', function(err, data) {
												if (err) {
												throw err;
											}
											xml1 = data;
											//console.log(xml1);
											jenkins.job.exists(folder+"/"+flowname, function(err, exists) {
											if (exists==false)
											{
												jenkins.job.create(folder+"/"+flowname,xml1, function(err){
												if (err) throw err;
												console.log("folder2 created");
																		dir1 = "C:\\Ruby23\\files\\job_configfiles";
					
					fs.readdir(dir1, function(err, filenames) {
						if (err) {
							console.log(err);
						}
						if(folder=="Transform"){var  jlength=5;}else{var  jlength=6;}
						filenames.forEach(function(filename) {
							jlength--;
			            console.log(filename);
							if (err) {
								console.log(err);
							}
							
						  fs.readFile(dir1+'/'+filename,'UTF-8', function(err, data) {
																		if (err) {
																		throw err;
																	}
																 var xml2 = data;
																	//console.log(xml2);
																	jenkins.job.exists(folder+"/"+flowname+"/"+(filename.substr(0,filename.indexOf("."))), function(err, exists) {
																	if (exists==false)
																	{
																		
																		 jenkins.job.create(folder+"/"+flowname+"/"+(filename.substr(0,filename.indexOf("."))),xml2, function(err){
																		if (err) throw err;
																		console.log("job created");
																		
																	});
																	}
																	else
																	{
																		console.log("Job Exists");
																	}
																	})
																   
																	});
																		if(jlength<1){
																	
										 MongoClient.connect(config.mongodburl, function(err, db) {
															 if(db){
																		var collection = db.collection('flows');
																		
										if(collection){
											var createTime = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
											var createdate1 = new Date().toDateString();
											var createDate =createdate1.slice(createdate1.indexOf(" "),createdate1.length);
											
											var data = {
															"interface_name":interface_name,
															"flowname":flowname,
															"svn_url": Remote_SVN_URL,
															"createdDate": createDate,
															"createdtime": createTime,
															"updatedDate":"",
															"updatedTime":"",
															"Environment":"dev",
															"By":loginuser
														}
														console.log("Inserting the data -------- "+JSON.stringify(data));
														collection.insert(data);
									}else
									{
											console.log("collection not found");
											db.createCollection("flows",function(err,res){
												console.log(err);
												console.log("created collection");
											});
											var createTime = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
											var createdate1 = new Date().toDateString();
											var createDate =createdate1.slice(createdate1.indexOf(" "),createdate1.length);
											
											var data = {
															"interface_name":interface_name,
															"flowname":flowname,
															"svn_url": Remote_SVN_URL,
															"createdDate": createDate,
															"createdtime": createTime,
															"updatedDate":"",
															"updatedTime":"",
															"Environment":"dev",
															"By":loginuser
														}
																						console.log("Inserting the data -------- "+JSON.stringify(data));
																						collection.insert(data);
																	}
																		
																	}
															else{console.log("error is connecting to db");}
													});	
											
											setTimeout(function() {
												console.log("flow created");
												res.send("created");		
											}, 5000);
												
														
														}
						});
						
					});
											});
											}
											else
											{
												dir1 = "C:\\Ruby23\\files\\job_configfiles";
					
					fs.readdir(dir1, function(err, filenames) {
						if (err) {
							console.log(err);
						}
						if(folder=="Transform"){var  jlength=5;}else{var  jlength=6;}
						filenames.forEach(function(filename) {
							jlength--;
			            console.log(filename);
							if (err) {
								console.log(err);
							}
							
						  fs.readFile(dir1+'/'+filename,'UTF-8', function(err, data) {
																		if (err) {
																		throw err;
																	}
																  var  xml2 = data;
																	//console.log(xml2);
																	jenkins.job.exists(folder+"/"+flowname+"/"+(filename.substr(0,filename.indexOf("."))), function(err, exists) {
																	if (exists==false)
																	{
																		
																		 jenkins.job.create(folder+"/"+flowname+"/"+(filename.substr(0,filename.indexOf("."))),xml2, function(err){
																		if (err) throw err;
																		console.log("job created");
																		
																	});
																	}
																	else
																	{
																		console.log("Job Exists");
																	}
																	})
																   
																	});
																		if(jlength<1){
																	
										 MongoClient.connect(config.mongodburl, function(err, db) {
															 if(db){
																		var collection = db.collection('flows');
																		
																		if(collection){
																			var createTime = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
																			var createdate1 = new Date().toDateString();
																			var createDate =createdate1.slice(createdate1.indexOf(" "),createdate1.length);
																			
																			var data = {
																							"interface_name":interface_name,
																							"flowname":flowname,
																							"svn_url": Remote_SVN_URL,
																							"createdDate": createDate,
																							"createdtime": createTime,
																							"updatedTime":"",
															"Environment":"dev",
															"By":loginuser
																						}
																						console.log("Inserting the data -------- "+JSON.stringify(data));
																						collection.insert(data);
																	}else
																	{
																			console.log("collection not found");
																			db.createCollection("flows",function(err,res){
																				console.log(err);
																				console.log("created collection");
																			});
																			var createTime = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
																			var createdate1 = new Date().toDateString();
																			var createDate =createdate1.slice(createdate1.indexOf(" "),createdate1.length);
																			
																			var data = {
																							"interface_name":interface_name,
																							"flowname":flowname,
																							"svn_url": Remote_SVN_URL,
																							"createdDate": createDate,
																							"createdtime": createTime,
																							"updatedDate":"",
																							"updatedTime":"",
															"Environment":"dev",
															"By":loginuser
																						}
																						console.log("Inserting the data -------- "+JSON.stringify(data));
																						collection.insert(data);
																	}
																		
																	}
															else{console.log("error is connecting to db");}
													});	
											
											setTimeout(function() {
												console.log("flow created");
												res.send("created");		
											}, 5000);
												
														
														}
						});
						
					});
											}
											})
											
											});
											});
							
							
						}
            else{
        console.log(' folderexists', exists);
                            
                                 fs.readFile(__dirname+'/configfolder.xml','UTF-8', function(err, data) {
                                if (err) {
                                throw err;
                            }
                            xml1 = data;
                           // console.log(xml1);
                            jenkins.job.exists(folder+"/"+flowname, function(err, exists) {
                            if (exists==false)
							{
								jenkins.job.create(folder+"/"+flowname,xml1, function(err){
                                if (err) throw err;
                                console.log("folder2 created");
                                                       dir1 = "C:\\Ruby23\\files\\job_configfiles";
    
    fs.readdir(dir1, function(err, filenames) {
        if (err) {
            console.log(err);
        }
     if(folder=="Transform"){var  jlength=5;}else{var  jlength=6;}
        filenames.forEach(function(filename) {
			jlength--;
			console.log(filename);
            if (err) {
                console.log(err);
            }
            
          fs.readFile(dir1+'/'+filename,'UTF-8', function(err, data) {
                                                        if (err) {
                                                        throw err;
                                                    }
                                                  var  xml2 = data;
                                                    //console.log(xml2);
                                                    jenkins.job.exists(folder+"/"+flowname+"/"+(filename.substr(0,filename.indexOf("."))), function(err, exists) {
                                                    if (exists==false)
							                        {
														
								 jenkins.job.create(folder+"/"+flowname+"/"+(filename.substr(0,filename.indexOf("."))),xml2, function(err){
                                                        if (err) throw err;
                                                        console.log("job created");
                                                        
                                                    });
													}
												    else
													{
														console.log("job exists");
													}
													})
                                                   
                                                    });
													
													if(jlength<1){
																	
										 MongoClient.connect(config.mongodburl, function(err, db) {
															 if(db){
																		var collection = db.collection('flows');
																		
																		if(collection){
																			var createTime = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
																			var createdate1 = new Date().toDateString();
																			var createDate =createdate1.slice(createdate1.indexOf(" "),createdate1.length);
																			
																			var data = {
																							"interface_name":interface_name,
																							"flowname":flowname,
																							"svn_url": Remote_SVN_URL,
																							"createdDate": createDate,
																							"createdtime": createTime,
																							"updatedDate":"",
																							"updatedTime":"",
															"Environment":"dev",
															"By":loginuser
																						}
																						console.log("Inserting the data -------- "+JSON.stringify(data));
																						collection.insert(data);
																	}else
																	{
																			console.log("collection not found");
																			db.createCollection("flows",function(err,res){
																				console.log(err);
																				console.log("created collection");
																			});
																			var createTime = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
																			var createdate1 = new Date().toDateString();
																			var createDate =createdate1.slice(createdate1.indexOf(" "),createdate1.length);
																			
																			var data = {
																							"interface_name":interface_name,
																							"flowname":flowname,
																							"svn_url": Remote_SVN_URL,
																							"createdDate": createDate,
																							"createdtime": createTime,
																							"updatedDate":"",
																							"updatedTime":"",
															"Environment":"dev",
															"By":loginuser
																						}
																						console.log("Inserting the data -------- "+JSON.stringify(data));
																						collection.insert(data);
																	}
																		
																	}
															else{console.log("error is connecting to db");}
													});	
											
											setTimeout(function() {
												console.log("flow created");
												res.send("created");		
											}, 5000);
												
														
														}
        });
        
    });
                            });
							}
							else
							{
								dir1 = "C:\\Ruby23\\files\\job_configfiles";
    
    fs.readdir(dir1, function(err, filenames) {
        if (err) {
            console.log(err);
        }
		if(folder=="Transform"){var  jlength=5;}else{var  jlength=6;}    
        filenames.forEach(function(filename) {
			jlength--;
			console.log(filename);
            if (err) {
                console.log(err);
            }
            
          fs.readFile(dir1+'/'+filename,'UTF-8', function(err, data) {
                                                        if (err) {
                                                        throw err;
                                                    }
                                                   var xml2 = data;
                                                   // console.log(xml2);
                                                    jenkins.job.exists(folder+"/"+flowname+"/"+(filename.substr(0,filename.indexOf("."))), function(err, exists) {
                                                    if (exists==false)
							                        {
														
														 jenkins.job.create(folder+"/"+flowname+"/"+(filename.substr(0,filename.indexOf("."))),xml2, function(err){
                                                        if (err) throw err;
                                                        console.log("job created");
                                                        
                                                    });
													}
												    else
													{
														console.log("Job Exists");
													}
													})
                                                   
                                                    });
													if(jlength<1){
																	
										 MongoClient.connect(config.mongodburl, function(err, db) {
															 if(db){
																		var collection = db.collection('flows');
																		
																		if(collection){
																			var createTime = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
																			var createdate1 = new Date().toDateString();
																			var createDate =createdate1.slice(createdate1.indexOf(" "),createdate1.length);
																			
																			var data = {
																							"interface_name":interface_name,
																							"flowname":flowname,
																							"svn_url": Remote_SVN_URL,
																							"createdDate": createDate,
																							"createdtime": createTime,
																							"updatedDate":"",
																							"updatedTime":"",
															"Environment":"dev",
															"By":loginuser
																						}
																						console.log("Inserting the data -------- "+JSON.stringify(data));
																						collection.insert(data);
																	}else
																	{
																			console.log("collection not found");
																			db.createCollection("flows",function(err,res){
																				console.log(err);
																				console.log("created collection");
																			});
																			var createTime = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
																			var createdate1 = new Date().toDateString();
																			var createDate =createdate1.slice(createdate1.indexOf(" "),createdate1.length);
																			
																			var data = {
																							"interface_name":interface_name,
																							"flowname":flowname,
																							"svn_url": Remote_SVN_URL,
																							"createdDate": createDate,
																							"createdtime": createTime,
																							"updatedDate":"",
																							"updatedTime":"",
															"Environment":"dev",
															"By":loginuser
																						}
																						console.log("Inserting the data -------- "+JSON.stringify(data));
																						collection.insert(data);
																	}
																		
																	}
															else{console.log("error is connecting to db");}
													});	
											
											setTimeout(function() {
												console.log("flow created");
												res.send("created");		
											}, 5000);
												
														
														}
        });
        
    });
							}
							})
                            
                            });
                            //});		
    }
    


});

});

//res.send("created");     
}) ; 

app.get("/createBuildFolder",function(req,res){
    console.log("In Build folder creation");
    flowname = req.query.flowname;
    interface_name = req.query.interface_name;
   type = req.query.type;
   Remote_SVN_URL = req.query.Remote_SVN_URL;
  var svnpassword = req.query.svnpassword;
  var s_flow = flowname.split("_");
  var Split_Flow = s_flow[0]+'.'+s_flow[1];
  
//  var  TCPIPServer_Command = req.query.TCPIPServer_Command;


 /* MongoClient.connect(config.mongodburl, function(err, db) {
        if(db){
            var collection = db.collection('CentralizedParameters');
            if(collection){
                collection.find({}).toArray(function (err, result) {
				  if (err) {
					console.log(err);
				  } else if (result.length) {
					  console.log(result);
					  svnuser = result[0].SVNUserName;
					  svnpassword = result[0].SVNPassword;  */
				 


   svnUltimate.commands.checkout( Remote_SVN_URL, 'C:\\Ruby23\\files\\svn_repo', {username: loginuser,	password: svnpassword},function( err ) {
	   if(err == null){
		   console.log("check out completed"); 
console.log(flowname);
console.log(type);
    if (!fs.existsSync('C:\\Ruby23\\files\\Build')){
        fs.mkdirSync('C:\\Ruby23\\files\\Build');        
    }
	if (!fs.existsSync('C:\\Ruby23\\files\\Build\\EnvironmentProperties')){
        fs.mkdirSync('C:\\Ruby23\\files\\Build\\EnvironmentProperties');        
    }
	if (!fs.existsSync('C:\\Ruby23\\files\\Build\\EnvironmentProperties\\'+type)){
        fs.mkdirSync('C:\\Ruby23\\files\\Build\\EnvironmentProperties\\'+type);        
    }
	if (!fs.existsSync('C:\\Ruby23\\files\\Build\\EnvironmentProperties\\'+type+'\\'+flowname)){
        fs.mkdirSync('C:\\Ruby23\\files\\Build\\EnvironmentProperties\\'+type+'\\'+flowname);        
    }
    
    /*Changes for EnvironmentProperties file*/
    var data = fs.readFileSync(__dirname+'/templates/EnvironmentProperties/Sender_Receiver_Transform/Flow_Name/Flow_Name_Build.dev.properties', 'utf-8');
	 var newValue = data.replace(/Flow_Name/gim, flowname);
	 var newValue1 = newValue.replace(/Split_Flow/gim, Split_Flow);
    fs.writeFileSync('C:\\Ruby23\\files\\Build\\EnvironmentProperties\\'+type+'\\'+flowname+'\\'+flowname+'_Build.dev.properties',newValue1, 'utf-8');
    /*Changes for Artifactory.xml file*/
	
	/*Changes for EnvironmentProperties file*/
    var data = fs.readFileSync(__dirname+'/templates/EnvironmentProperties/Sender_Receiver_Transform/Flow_Name/Flow_Name_Build.prod.properties', 'utf-8');
	var newValue = data.replace(/Flow_Name/gim, flowname);
	 var newValue1 = newValue.replace(/Split_Flow/gim, Split_Flow);
    fs.writeFileSync('C:\\Ruby23\\files\\Build\\EnvironmentProperties\\'+type+'\\'+flowname+'\\'+flowname+'_Build.prod.properties',newValue1, 'utf-8');
    /*Changes for Artifactory.xml file*/
	
	/*Changes for EnvironmentProperties file*/
    var data = fs.readFileSync(__dirname+'/templates/EnvironmentProperties/Sender_Receiver_Transform/Flow_Name/Flow_Name_Build.test.properties', 'utf-8');
	var newValue = data.replace(/Flow_Name/gim, flowname);
	 var newValue1 = newValue.replace(/Split_Flow/gim, Split_Flow);
    fs.writeFileSync('C:\\Ruby23\\files\\Build\\EnvironmentProperties\\'+type+'\\'+flowname+'\\'+flowname+'_Build.test.properties',newValue1, 'utf-8');
    /*Changes for Artifactory.xml file*/
		
	/*Changes for Artifactory.xml file*/
    var data = fs.readFileSync(__dirname+'/templates/Artifactory.xml', 'utf-8');
    var newValue = data.replace(/Flow_Name/gim, flowname);
	var newValue1 = newValue.replace(/Flow_Type/gim, type);
    fs.writeFileSync('C:\\Ruby23\\files\\Build\\Artifactory.xml',newValue1, 'utf-8');
    /*Changes for Artifactory.xml file*/
    
    /*Changes for Build.xml file*/
     var data = fs.readFileSync(__dirname+'/templates/build.xml', 'utf-8');
    var newValue = data.replace(/Flow_Name/gim, flowname);
	var newValue1 = newValue.replace(/Flow_Type/gim, type);
    fs.writeFileSync('C:\\Ruby23\\files\\Build\\build.xml', newValue1, 'utf-8');
    /*Changes for Build.properties file*/
    
  

	if(!(type == 'Transform')){
        console.log(type);
        /*Changes for ConfigCommands.txt file*/	
		if(type == 'Sender'){
	 TCPIPServer_Command = fs.readFileSync('C:\\Ruby23\\files\\svn_repo\\TCPIPClient.txt', 'utf-8');
  
		}
		else {
	 TCPIPServer_Command = fs.readFileSync('C:\\Ruby23\\files\\svn_repo\\TCPIPServer.txt', 'utf-8');
		}
    /*Changes for config.properties file*/
    }
    
    /*Changes for ConfigService.xml file*/
    var data = fs.readFileSync(__dirname+'/templates/ConfigService.xml', 'utf-8');
    var newValue = data.replace(/Flow_Name/gim, flowname);
	var newValue1 = newValue.replace(/Flow_Type/gim, type);
    fs.writeFileSync('C:\\Ruby23\\files\\Build\\ConfigService.xml', newValue1, 'utf-8');
    /*Changes for ConfigService.xml file*/
     
    /*Changes for QueueDeploy.xml file*/
    var data = fs.readFileSync(__dirname+'/templates/QueueDeploy.xml', 'utf-8');
    var newValue = data.replace(/Flow_Name/gim, flowname);
	var newValue1 = newValue.replace(/Flow_Type/gim, type);
    fs.writeFileSync('C:\\Ruby23\\files\\Build\\QueueDeploy.xml', newValue1, 'utf-8');
    /*Changes for QueueCommands.txt file*/
		
	/*Changes for Undeploy file*/
    var data = fs.readFileSync(__dirname+'/templates/Undeploy.xml', 'utf-8');
	if(type == 'Receiver'){
	 Undeploy_Config_Service = '<sshexec trust="true" host="${iib.host}" username="${iib.userid}" password="${iib.userpassword}" command="${mqsiprofile};mqsideleteconfigurableservice ${iib.node} -c TCPIPServer -o Flow_Name;mqsireload ${iib.node} -e ${execution.group}"/>';
  
		}
		else if(type == 'Sender'){
	 Undeploy_Config_Service = '<sshexec trust="true" host="${iib.host}" username="${iib.userid}" password="${iib.userpassword}" command="${mqsiprofile};mqsideleteconfigurableservice ${iib.node} -c TCPIPClient -o Flow_Name;mqsireload ${iib.node} -e ${execution.group}"/>';
		}
	else{Undeploy_Config_Service="";}
	var new1 = data.replace(/Undeploy_Config_Service/gim, Undeploy_Config_Service);
    var newValue = new1.replace(/Flow_Name/gim, flowname);
	var newValue1 = newValue.replace(/Flow_Type/gim, type);
    fs.writeFileSync('C:\\Ruby23\\files\\Build\\Undeploy.xml', newValue1, 'utf-8');
    /*Changes for Undeploy.txt file*/
	
	/*Changes for testCaseBuild.xml file*/
    var data = fs.readFileSync(__dirname+'/templates/testCasebuild.xml', 'utf-8');
    var newValue = data.replace(/Flow_Name/gim, flowname);
    fs.writeFileSync('C:\\Ruby23\\files\\Build\\testCasebuild.xml', newValue, 'utf-8');
    /*Changes for testCaseBuild.xml file*/
	
		
	/*Changes for libraryURLInSVN.properties file
    var data = fs.readFileSync(__dirname+'/templates/libraryURLInSVN.properties', 'utf-8');
    fs.writeFileSync('C:\\Ruby23\\files\\Build\\libraryURLInSVN.properties', data, 'utf-8');
    /*Changes for libraryURLInSVN.properties file*/
	
	/*Changes for DeleteTransformQueues.mqsc file*/
	var data = fs.readFileSync('C:\\Ruby23\\files\\svn_repo\\Create'+type+'Queues.mqsc', 'utf-8');
        var lines = data.split("\n");
      
        for(var i=0;i<lines.length;i++){
            var str = lines[i];
            var str1;
            var newvalue="";
            var n = str.indexOf(")");
            if((str.indexOf('*'))==0){
                str1=str;
            }else{
                if(n==-1){
                    str1=str;
                }else{
                 str1 = str.substring(0,n+1);
                }
            }
                str1 = str1.replace(/DEFINE/gim,'DELETE');
                console.log("str1 ==> "+str1);
                fs1.appendFileSync('C:\\Ruby23\\files\\Build\\Delete'+type+'Queues.mqsc', str1+"\n");
                /*newvalue = newvalue+str1+"\n";
                console.log("newValue ===> "+newvalue);*/
        }
       
    /*Changes for DeleteTransformQueues.mqsc file*/
	
   
	fs1.copySync('C:\\Ruby23\\files\\Build', 'C:\\Ruby23\\files\\svn_repo\\Build', { overwrite: true });
	svnUltimate.commands.add('C:\\Ruby23\\files\\svn_repo\\Build',function( err ) {
            svnUltimate.commands.update('C:\\Ruby23\\files\\svn_repo',function(err){
                svnUltimate.commands.cleanup('C:\\Ruby23\\files\\svn_repo',function(err){
                    svnUltimate.commands.commit('C:\\Ruby23\\files\\svn_repo','-q',function(err){
                        console.log( "commit complete" );
                        setTimeout(function() {
                        fs1.removeSync('C:\\Ruby23\\files\\svn_repo');
                        fs1.removeSync('C:\\Ruby23\\files\\Build');
                        res.redirect('/CInterface');
                                            }, 5000);
                    });
                });
            });
        });
	
	

	   }else{
		   console.log(err);
		   res.send("Authentication Failed");
	   }
	   }) ;
	    /* }
				  else {
					
					console.log('No document(s) found with defined "find" criteria!');
				  }
				 
				})
            }    
        }
        else{
            console.log("error is connecting to db");
        }
    });    */
		
});

app.get('/downloadFolder', function(req, res){
var file = __dirname + '/Build.zip';
 res.download(file); // Set disposition and send it.
 rmdirSync(__dirname+'/Build.zip', function(error){
                if(error){
                    console.log(error);
                }
            });
});

app.get('/RetriveUserData', function (req, res) {
  // Prepare output in JSON format

MongoClient.connect(config.mongodburl, function(err, db) {
 if(!err) {
   console.log("We are connected");
var collection = db.collection('users');

collection.find().toArray(function (err, result) {
     if (err) {
       console.log(err);
     } else if (result.length) {
          
        for(i=0;i<result.length;i++)
        {
        console.log('Found:', result[i].Insname);
        }
        res.send(result);
     }
      else {
        
       console.log('No document(s) found with defined "find" criteria!');
     }
   
   })
db.close()
 }
})
});

app.get('/RetriveRoleData', function (req, res) {
  // Prepare output in JSON format

MongoClient.connect(config.mongodburl, function(err, db) {
 if(!err) {
   console.log("We are connected");
var collection = db.collection('roles');

collection.find().toArray(function (err, result) {
     if (err) {
       console.log(err);
     } else if (result.length) {
          
        for(i=0;i<result.length;i++)
        {
        //console.log('Found:', result[i].role_name);
        }
        res.send(result);
     }
      else {
        
       console.log('No document(s) found with defined "find" criteria!');
     }
   
   })
db.close()
 }
})
});

app.get('/addLibraryProperties', function(req, res){
   var  urlkey = req.query.urlkey;
  var  urlvalue = req.query.urlvalue;
  
  MongoClient.connect(config.mongodburl, function(err, db) {
        if(db){
            var collection = db.collection('svn_library_urls');
            if(collection){
                var data = {
                    "url_key":urlkey,
                    "url_value":urlvalue
                }
                console.log("Inserting the data -------- "+JSON.stringify(data));
                collection.insert(data);
				res.send("inserted");
            }    
       }
        else{
            console.log("error is connecting to db");
        }
    });  
  
 /* var data = "\r\n"+urlkey+"="+urlvalue;
  console.log(__dirname+'/templates/libraryURLInSVN.properties');
  
 fs.appendFileSync(__dirname+'/templates/libraryURLInSVN.properties',data,'UTF-8',function(err){
      if(err){
          console.log(err);
      }
  });
  console.log("AFter adding");
  */
});

app.get("/saveInterface",function(req,res){
    var interface_name = req.query.interface_name;
	var createTime = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
	var createdate1 = new Date().toDateString();
	var createDate =createdate1.slice(createdate1.indexOf(" "),createdate1.length);

	
     MongoClient.connect(config.mongodburl, function(err, db) {
        if(db){
            var collection = db.collection('interfaces');
            if(collection){
                var data = {
                    "interface_name":interface_name,
					"createdDate": createDate,
					"createdtime": createTime,
					"updatedDate":"",
					"updatedTime":"",
					"Environment":"dev",
					"By":loginuser
                }
				
                console.log("Inserting the data -------- "+JSON.stringify(data));
                collection.insert(data);
            }    
        }
        else{
            console.log("error is connecting to db");
        }
    });    
    res.send("interface_saved");
});

app.get("/interfacelist",function(req,res){   
     MongoClient.connect(config.mongodburl, function(err, db) {
        if(db){
            var collection = db.collection('interfaces');
            if(collection){
                collection.find().toArray(function (err, result) {
				  if (err) {
					console.log(err);
				  } else if (result.length) {
					  
					for(i=0;i<result.length;i++)
					{
					console.log('Found:', result[i].interface_name);
					}
					res.send(result);
				  }
				  else {
					
					console.log('No document(s) found with defined "find" criteria!');
				  }
				 
				})
            }    
        }
        else{
            console.log("error is connecting to db");
        }
    });    
});

app.get('/viewflow', function (req, res) {
	 console.log("came viewflow");
	 interfaceName=req.query.interfaceName;
	 console.log(interfaceName);
	/*  io.on('connection',function(client1){
		client = client1;
	}); */
	 res.send("true");	 
})

app.get("/flows",function(req,res){  
     
	 var i_Name = interfaceName
     MongoClient.connect(config.mongodburl, function(err, db) {
        if(db){
            var collection = db.collection('flows');
            if(collection){
                collection.find({interface_name : i_Name}).toArray(function (err, result) {
				  if (err) {
					console.log(err);
				  } else if (result.length) {
					  
					for(i=0;i<result.length;i++)
					{
					console.log('Found:', result[i].flowname);
					}
					data = {
						'result' : result,
						'interfaceName' : i_Name
					}
					res.send(data);
				  }
				  else {
					
					console.log('No document(s) found with defined "find" criteria!');
				  }
				 
				})
            }    
        }
        else{
            console.log("error is connecting to db");
        }
    });    
});

app.get('/viewjob', function (req, res) {
	 console.log("came viewjob");
	 flowName=req.query.flowName;
	 folder = flowName.split("_").pop();
	 console.log(flowName);
	/* io.on('connection',function(client1){
		client = client1;
	}); */
	 res.send("true");	
});
app.get('/flowjobs', function (req, res) {
	 console.log("came flowjobs");
	 console.log(flowName);
	 folder = flowName.split("_").pop();
	 uri=folder+"/"+flowName;
	 jenkins.job.get(uri,({ depth: 2,pretty: 'true'}), function(err, data) {
							  if (err) throw err;
							jobs=data.
							 // console.log('job', data);
							 res.send(data);
							}); 
		 
});

app.get('/jobdetail', function (req, res) {
	 console.log("came jobdetail");
	 jobName=req.query.jobName;
	 console.log(jobName);
	 res.send("true");	 
});

app.get('/jobinfo', function (req, res) {
	 console.log("came jobinfo");
	// console.log(jobName);
	 folder = flowName.split("_").pop();
	 uri=folder+"/"+flowName+"/"+jobName;
	 jenkins.job.get(uri,({ depth: 2,pretty: 'true'}), function(err, data) {
							  if (err) throw err;

							 // console.log('job', data);
							 res.send(data);
							}); 
		 
});

app.get('/builddetail', function (req, res) {
	  console.log("came builddetail");
	  nextbuild_no=req.query.nextbuild_no;
	 console.log(nextbuild_no);
	 folder = flowName.split("_").pop();
	 uri=folder+"/"+flowName+"/"+jobName;
	 jenkins.job.get(uri,({ depth: 2,pretty: 'true'}), function(err, data) {
							  if (err) throw err;

							 // console.log('job', data);
							 res.send(data);
							}); 
		 
});

app.use(body.json());
app.get('/build', function (req, res) {
	data={};
   console.log("entered build"); 
console.log(loginuser);
//console.log(password);
         build_env = req.query.build_env;
         console.log(build_env); 
	     iibhost=req.query.iibhost;

		 IIBNode=req.query.IIBNode;

		 executionGroup=req.query.executionGroup;
		
		BrokerName=req.query.BrokerName;
		
		svnpassword=req.query.svnpassword;
		
		current_Interface= req.query.interface_name;
      console.log(svnpassword);
					MongoClient.connect(config.mongodburl, function(err, db) {
				if(db){
					var collection = db.collection('CentralizedParameters');
					if(collection){
						collection.find({}).toArray(function (err, result) {
						  if (err) {
							console.log(err);
						  } else if (result.length) {
							  console.log(result);
							  CentralizedParameters=result;
							  console.log(CentralizedParameters[0].ArtifactoryURL);
															   MongoClient.connect(config.mongodburl, function(err, db) {
										if(db){
											var collection = db.collection('EnvironmentalParameters');
											if(collection){
												collection.find({build_env:build_env}).toArray(function (err, result) {
												  if (err) {
													console.log(err);
												  } else if (result.length) {
													  
													console.log(result);
													EnvironmentalParameters=result;
				jenkins.job.get(folder+"/"+flowName+"/"+flowName+"_Build",({ depth: 2,pretty: 'true'}), function(err, data) {
							  if (err) throw err;
							 console.log('job', data.actions[0].parameterDefinitions[9].defaultParameterValue.value);
							 projectname=data.actions[0].parameterDefinitions[8].defaultParameterValue.value;
							 messageflowname=data.actions[0].parameterDefinitions[9].defaultParameterValue.value;
							 svnrepo=data.actions[0].parameterDefinitions[10].defaultParameterValue.value; 
							  if( data.builds == "")
												     {
														 console.log("entered if");
														 build_no=0;
													 }
												  else{
													  console.log("entered else");
													  build_no=data.builds[0].number;
													  } 
							  console.log('job', projectname);
							  if(folder=="Transform")
							  {
								 // svnUltimate.util.getRevision( svnrepo, function( err, revision ) {
				      // console.log( "Head revision=" + revision );
					  // artifactory_number=revision;
					  svnUltimate1(svnrepo, 'HEAD', function(err, info) {
                          if(err) {
                            throw err;
                          }
                          console.log(info.lastChangedRev);
                          artifactory_number=info.lastChangedRev;
					    jenkins.job.build({ name: folder+"/"+flowName+"/"+flowName+"_Build", parameters: { build_env: build_env,
														username:CentralizedParameters[0].username,
														password :CentralizedParameters[0].password,
														toolkithome :EnvironmentalParameters[0].toolkithome,
														svnhost :CentralizedParameters[0].svnhost,
														ArtifactoryURL:CentralizedParameters[0].ArtifactoryURL,
														ArtifactoryUserName : CentralizedParameters[0].ArtifactoryUserName,
														ArtifactoryPassword : CentralizedParameters[0].ArtifactoryPassword,
														projectname :projectname,
														messageflowname: messageflowname,
														svnrepo:svnrepo,
														svnusername:loginuser,
														svnpassword:svnpassword
								} }, function(err) {
												if (err) console.log(err);
												console.log("build triggered");
												setTimeout(function() {
														executed_job=folder+"/"+flowName+"/"+flowName+"_Build";
												 res.redirect("/console");
											}, 10000);
											}); 
					   
			         }); 
							  }
							  else
							  {
							   jenkins.job.get(folder+"/"+flowName+"/Create_Config_Services",({ depth: 2,pretty: 'true'}), function(err, data) {
							  if (err) throw err;
							 console.log('job', data.actions[0].parameterDefinitions[5].defaultParameterValue.value);
							 Config_Service=data.actions[0].parameterDefinitions[5].defaultParameterValue.value;
							 
				//svnUltimate.util.getRevision( svnrepo, function( err, revision ) {
				      // console.log( "Head revision=" + revision );
					 //  artifactory_number=revision;
					 svnUltimate1(svnrepo, 'HEAD', function(err, info) {
                          if(err) {
                            throw err;
                          }
                          console.log(info.lastChangedRev);
                          artifactory_number=info.lastChangedRev;
					    jenkins.job.build({ name: folder+"/"+flowName+"/"+flowName+"_Build", parameters: { build_env: build_env,
														username:CentralizedParameters[0].username,
														password :CentralizedParameters[0].password,
														toolkithome :EnvironmentalParameters[0].toolkithome,
														svnhost :CentralizedParameters[0].svnhost,
														ArtifactoryURL:CentralizedParameters[0].ArtifactoryURL,
														ArtifactoryUserName : CentralizedParameters[0].ArtifactoryUserName,
														ArtifactoryPassword : CentralizedParameters[0].ArtifactoryPassword,
														projectname :projectname,
														messageflowname: messageflowname,
														svnrepo:svnrepo,
														svnusername:loginuser,
														svnpassword:svnpassword
								} }, function(err) {
												if (err) console.log(err);
												console.log("build triggered");
												setTimeout(function() {
														executed_job=folder+"/"+flowName+"/"+flowName+"_Build";
												 res.redirect("/console");
											}, 10000);
											}); 
					   
			         });   
							 
							 
							 
							 
							  }); 
							  }
							  
							  
							  
							}); 
												  }
												  else {
													
													console.log('No document(s) found with defined "find" criteria!');
												  }
												 
												})
											}    
										}
										else{
											console.log("error is connecting to db");
										}
									}); 
						  }
						  else {
							
							console.log('No document(s) found with defined "find" criteria!');
						  }
						 
						})
					}    
				}
				else{
					console.log("error is connecting to db");
				}
			});   
       
			        
			  	
				
					
});

app.get('/console', function (req, res) {  
nextbuild_no=build_no+1;  
var Library_Name = req.query.Library_Name;
console.log(Library_Name);
if(Library_Name!=null){folder="";flowName=""}
console.log("entered console with nextbuild_no ==> "+nextbuild_no);
   var uri=executed_job;
   console.log("uri : "+uri);
   if(client){
   console.log("Connected succesfully to the socket ..."+client);
  
 
     var log = jenkins.build.logStream(uri, nextbuild_no);
      console.log("log data  ..."+log.toString());
    

 
 log.on('data', function(text) {
    //console.log("BEFOR TEXT ****************** "+text)  
    var news ='';
     news = text;
    // Send news on the socket
   client.emit('news', news);

  
});

log.on('error', function(err) {
 console.log('error', err);
  counter="1";  
 var news ='';
  news = err;
      // Send news on the socket
   client.emit('news', news);

});

log.on('end', function(end) {
//client.emit('progress', uri);
// socket.emit('end', end);
 jenkins.job.get(uri,({ depth: 2,pretty: 'true'}), function(err, data) {
							  if (err) throw err;
							 jobdata=data;
							  console.log('job status'+ data.builds[0]+" build number  "+data.builds[0].number);
							// res.send(data);
							if(data.builds[0].result=="SUCCESS" || data.builds[0].result=="UNSTABLE")
						//	if(data.builds[0].result=="FAILURE" || data.builds[0].result=="UNSTABLE")
							{
								client.emit('progress', uri);
								current_job=uri;
								console.log(current_job);
								if( current_job=="Test_Suite/Run_Test" || current_job=="Test_Suite/Change_Sender_ConfigService"){
									var jobtype1;
									if ((current_job.search('Run_Test'))>0){
					               //alert("Build completed");
					                jobtype1="RunTest";
									console.log(jobtype1);
				                   }
								   else if((current_job.search('Change_Sender_ConfigService'))>0){
					               //alert("Build completed");
					                jobtype1="ChangeSenderConfigService";
									console.log(jobtype1);
				                   }
								   var updatedTime = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
									var updatedDate1 = new Date().toDateString();
									var updatedDate =updatedDate1.slice(updatedDate1.indexOf(" "),updatedDate1.length);
									 MongoClient.connect(config.mongodburl, function(err, db) {
										if(db){
											var runtest = db.collection('runtest');
													log=
												                   	{
														                                    "interface_name":interface1,
																							"updatedDate":updatedDate,
																							"updatedTime":updatedTime,
															                                "Environment":"dev",
															                                "By":loginuser,
																							"Jobtype":jobtype1,
																							"flowstatus":'SUCCESS'
													}
													runtest.insert(log);
													
												var collection = db.collection('interfaces');
												if(collection){
													
													var myquery = { "interface_name":interface1 };
													var newvalues = { "updatedDate":"","updatedTime":updatedTime };	
													console.log("Update data -------- "+JSON.stringify(myquery)+"     ---- "+JSON.stringify(newvalues));
													collection.update({interface_name:interface1},{$set:{updatedDate:updatedDate,updatedTime:updatedTime}},function(err, res){
														if (err) throw console.log(err);
														console.log(res.result.nModified + " record updated");
													});
												}  
																					
										}
										else{
											console.log("error is connecting to db");
										}
									});
								   
								   res.send("JOb Executed")
								   
								}
								else if(current_job==folder+"/"+flowName+"/Deploy" || current_job==folder+"/"+flowName+"/"+"Rollback_Decomission")
								{
									if((current_job.search('Deploy'))>0){
					               //alert("Build completed");
					                jobtype="Deploy";
				                   }
								   else if((current_job.search('Rollback_Decomission'))>0){
					               //alert("Build completed");
					                jobtype="Rollback";
				                   }
								  
								
									// If here, update flows collection last update to current timestamp and status to SUCCESS.
									// Also, update Interface collection last update to current timestamp
									var updatedTime = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
									var updatedDate1 = new Date().toDateString();
									var updatedDate =updatedDate1.slice(updatedDate1.indexOf(" "),updatedDate1.length);
									var interface_name_update;
									 MongoClient.connect(config.mongodburl, function(err, db) {
										if(db){
											var flowCollection = db.collection('flows');
											var flowlogs= db.collection('flowslog');
											//flowCollection.find({flowname:flowName},({interface_name:true,_id:false})).toArray(function
											flowCollection.find({flowname:flowName,interface_name:current_Interface}).toArray(function 
											(err, result) {
												interface_name_update = result[0].interface_name;
												console.log("interface_name_update =====> "+interface_name_update);
												flowCollection.update({flowname:flowName,interface_name:current_Interface},{$set:{updatedDate:updatedDate,updatedTime:updatedTime,flowstatus:'SUCCESS'}},function(err, res){
														if (err) throw console.log(err);
														console.log(res.result.nModified + " record updated");
													});
													console.log("date"+result[0].createdDate+"time"+result[0].createdtime);
													log=
													{
														                                    "interface_name":result[0].interface_name,
																							"flowname":result[0].flowname,
																							"svn_url": result[0].svn_url,
																							"createdDate": result[0].createdDate,
																							"createdtime": result[0].createdtime,
																							"updatedDate":updatedDate,
																							"updatedTime":updatedTime,
															                                "Environment":build_env,
															                                "By":loginuser,
																							"Jobtype":jobtype,
																							"flowstatus":'SUCCESS',
																							"iibhost":iibhost,
																							"IIBNode":IIBNode,
																							"executionGroup":executionGroup,
																							"BrokerName":BrokerName
																							
													}
													flowlogs.insert(log);
													
												var collection = db.collection('interfaces');
												if(collection){
													
													var myquery = { "interface_name":interface_name_update };
													var newvalues = { "updatedDate":"","updatedTime":updatedTime };	
													console.log("Update data -------- "+JSON.stringify(myquery)+"     ---- "+JSON.stringify(newvalues));
													collection.update({interface_name:interface_name_update},{$set:{updatedDate:updatedDate,updatedTime:updatedTime}},function(err, res){
														if (err) throw console.log(err);
														console.log(res.result.nModified + " record updated");
													});
												}  
											});											
										}
										else{
											console.log("error is connecting to db");
										}
									});
									
									res.send("JObs Executed")
								}
								else if( current_job=="LibraryManagement/"+Library_Name+"/"+Library_Name+"_Build" || current_job=="LibraryManagement/"+Library_Name+"/"+"Deploy_"+Library_Name)
								{
									var jobtype2;
									if ((current_job.search('_Build'))>0){
					               //alert("Build completed");
					                jobtype2="Build";
									console.log(jobtype2);
				                   }
								   else if((current_job.search('Deploy_'))>0){
					               //alert("Build completed");
					                jobtype2="Deploy";
									console.log(jobtype2);
				                   }
								  
								
									// If here, update flows collection last update to current timestamp and status to SUCCESS.
									// Also, update Interface collection last update to current timestamp
									var updatedTime = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
									var updatedDate1 = new Date().toDateString();
									var updatedDate =updatedDate1.slice(updatedDate1.indexOf(" "),updatedDate1.length);
									 MongoClient.connect(config.mongodburl, function(err, db) {
										if(db){
											var svn_library_urls_list = db.collection('svn_library_urls_list');
											var librarylog= db.collection('librarylog');
											svn_library_urls_list.find({url_key:Library_Name}).toArray(function 
											(err, result) {
												
												
												svn_library_urls_list.update({url_key:Library_Name},{$set:{updatedDate:updatedDate,updatedTime:updatedTime,flowstatus:'SUCCESS'}},function(err, res){
														if (err) throw console.log(err);
														console.log(res.result.nModified + " record updated");
													});
												//	console.log("date"+result[0].createdDate+"time"+result[0].createdtime);
													log=
													{
														            "url_key":Library_Name,
																	"url_value":result[0].url_value,
																	"createdDate": result[0].createdDate,
																	"createdtime": result[0].createdtime,
																	"updatedDate":updatedDate,
																	"flowstatus":"SUCCESS",
																	"Jobtype":jobtype2,
																	"updatedTime":updatedTime,
																	"Environment":result[0].Environment,
																	"By":loginuser
													}
													librarylog.insert(log);
													
												 
											});											
										}
										})
										res.send("JOb Executed")
										}
								
								
								else{
									//res.location("Done");
									res.redirect('/build1?folder='+folder+'&flowName='+flowName);
								}
								
								
							}
							else
                            {
								
									// If here, update flows collection last update to current timestamp and status to SUCCESS.
									// Also, update Interface collection last update to current timestamp
								current_job=uri;
								//console.log(current_job);
								if( current_job=="Test_Suite/Run_Test" || current_job=="Test_Suite/Change_Sender_ConfigService"){
									if((current_job.search('Test_Suite/Run_Test'))>0){
					               //alert("Build completed");
					                jobtype1="RunTest";
				                   }
								   else if((current_job.search('Change_Sender_ConfigService'))>0){
					               //alert("Build completed");
					                jobtype1="ChangeSenderConfigService";
				                   }
								   var updatedTime = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
									var updatedDate1 = new Date().toDateString();
									var updatedDate =updatedDate1.slice(updatedDate1.indexOf(" "),updatedDate1.length);
									 MongoClient.connect(config.mongodburl, function(err, db) {
										if(db){
											var runtest = db.collection('runtest');
													log=
												                   	{
														                                    "interface_name":interface1,
																							"updatedDate":updatedDate,
																							"updatedTime":updatedTime,
															                                "Environment":"dev",
															                                "By":loginuser,
																							"Jobtype":jobtype1,
																							"flowstatus":'FAILURE'
													}
													runtest.insert(log);
													
												var collection = db.collection('interfaces');
												if(collection){
													
													var myquery = { "interface_name":interface1 };
													var newvalues = { "updatedDate":"","updatedTime":updatedTime };	
													console.log("Update data -------- "+JSON.stringify(myquery)+"     ---- "+JSON.stringify(newvalues));
													collection.update({interface_name:interface1},{$set:{updatedDate:updatedDate,updatedTime:updatedTime}},function(err, res){
														if (err) throw console.log(err);
														console.log(res.result.nModified + " record updated");
													});
												}  
																					
										}
										else{
											console.log("error is connecting to db");
										}
									});
								   
								   
								   
								}
								else if(current_job==folder+"/"+flowName+"/Deploy" || current_job==folder+"/"+flowName+"/"+"Rollback_Decomission")
								{
									if((current_job.search('Deploy'))>0){
					               //alert("Build completed");
					                jobtype="Deploy";
				                   }
								   else if((current_job.search('Rollback_Decomission'))>0){
					               //alert("Build completed");
					                jobtype="Rollback";
				                   }
								  
								
									// If here, update flows collection last update to current timestamp and status to SUCCESS.
									// Also, update Interface collection last update to current timestamp
									var updatedTime = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
									var updatedDate1 = new Date().toDateString();
									var updatedDate =updatedDate1.slice(updatedDate1.indexOf(" "),updatedDate1.length);
									var interface_name_update;
									 MongoClient.connect(config.mongodburl, function(err, db) {
										if(db){
											var flowCollection = db.collection('flows');
											var flowlogs= db.collection('flowslog');
											//flowCollection.find({flowname:flowName},({interface_name:true,_id:false})).toArray(function
											flowCollection.find({flowname:flowName}).toArray(function 
											(err, result) {
												interface_name_update = result[0].interface_name;
												console.log("interface_name_update =====> "+interface_name_update);
												flowCollection.update({flowname:flowName},{$set:{updatedDate:updatedDate,updatedTime:updatedTime,flowstatus:'SUCCESS'}},function(err, res){
														if (err) throw console.log(err);
														console.log(res.result.nModified + " record updated");
													});
													console.log("date"+result[0].createdDate+"time"+result[0].createdtime);
													log=
													{
														                                    "interface_name":result[0].interface_name,
																							"flowname":result[0].flowname,
																							"svn_url": result[0].svn_url,
																							"createdDate": result[0].createdDate,
																							"createdtime": result[0].createdtime,
																							"updatedDate":updatedDate,
																							"updatedTime":updatedTime,
															                                "Environment":build_env,
															                                "By":loginuser,
																							"Jobtype":jobtype,
																							"flowstatus":'FAILURE',
																							"iibhost":iibhost,
																							"IIBNode":IIBNode,
																							"executionGroup":executionGroup,
																							"BrokerName":BrokerName
													}
													flowlogs.insert(log);
													
												var collection = db.collection('interfaces');
												if(collection){
													
													var myquery = { "interface_name":interface_name_update };
													var newvalues = { "updatedDate":"","updatedTime":updatedTime };	
													console.log("Update data -------- "+JSON.stringify(myquery)+"     ---- "+JSON.stringify(newvalues));
													collection.update({interface_name:interface_name_update},{$set:{updatedDate:updatedDate,updatedTime:updatedTime}},function(err, res){
														if (err) throw console.log(err);
														console.log(res.result.nModified + " record updated");
													});
												}  
											});											
										}
										else{
											console.log("error is connecting to db");
										}
									});
									
									
								}
								else if( current_job=="LibraryManagement/"+Library_Name+"/"+Library_Name+"_Build" || current_job=="LibraryManagement/"+Library_Name+"/"+"Deploy_"+Library_Name)
								{
									var jobtype2;
									if ((current_job.search('_Build'))>0){
					               //alert("Build completed");
					                jobtype2="Build";
									console.log(jobtype2);
				                   }
								   else if((current_job.search('Deploy_'))>0){
					               //alert("Build completed");
					                jobtype2="Deploy";
									console.log(jobtype2);
				                   }
								  
								
									// If here, update flows collection last update to current timestamp and status to SUCCESS.
									// Also, update Interface collection last update to current timestamp
									var updatedTime = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
									var updatedDate1 = new Date().toDateString();
									var updatedDate =updatedDate1.slice(updatedDate1.indexOf(" "),updatedDate1.length);
									 MongoClient.connect(config.mongodburl, function(err, db) {
										if(db){
											var svn_library_urls_list = db.collection('svn_library_urls_list');
											var librarylog= db.collection('librarylog');
											svn_library_urls_list.find({url_key:Library_Name}).toArray(function 
											(err, result) {
												
												
												svn_library_urls_list.update({url_key:Library_Name},{$set:{updatedDate:updatedDate,updatedTime:updatedTime,flowstatus:'SUCCESS'}},function(err, res){
														if (err) throw console.log(err);
														console.log(res.result.nModified + " record updated");
													});
												//	console.log("date"+result[0].createdDate+"time"+result[0].createdtime);
													log=
													{
														            "url_key":Library_Name,
																	"url_value":result[0].url_value,
																	"createdDate": result[0].createdDate,
																	"createdtime": result[0].createdtime,
																	"updatedDate":updatedDate,
																	"flowstatus":"SUCCESS",
																	"updatedTime":updatedTime,
																	"Environment":result[0].Environment,
																	"By":loginuser
													}
													librarylog.insert(log);
													
												 
											});											
										}
										})
										
										}
								
                                console.log(uri+"FAILED");
                                res.send(uri+"_job_FAILED");
                            }
}); 

});    
}
});

app.get('/build1', function (req, res) {
	console.log(current_job);
	folder=req.query.folder;
	flowName= req.query.flowName;
	console.log(folder+"---------"+flowName);
	if(current_job==folder+"/"+flowName+"/"+flowName+"_Build")
	{
		next_job=folder+"/"+flowName+"/Library_Detection";
		params={
			username :CentralizedParameters[0].username,
			password : CentralizedParameters[0].password,
			iibhost  : iibhost,
			mqsiprofile :  EnvironmentalParameters[0].mqsiprofile,
			IIBNode: IIBNode,
			executionGroup:executionGroup,
			svnhost:CentralizedParameters[0].svnhost,
			svnrepo:svnrepo,
			svnusername:loginuser,
		    svnpassword:svnpassword

		       }
			   
	}
	if(current_job==folder+"/"+flowName+"/Library_Detection")
	{
		if(folder=="Transform")
		{
			next_job=folder+"/"+flowName+"/Create_Queues";
			params={
			build_env :build_env,
			username:CentralizedParameters[0].username,
			password:CentralizedParameters[0].password,
			BrokerName :BrokerName,
			deployment_path:EnvironmentalParameters[0].deployment_path,
			iibhost: iibhost,
			svnusername:loginuser,
		    svnpassword:svnpassword

		}
		}
		else
		{
			next_job=folder+"/"+flowName+"/Create_Config_Services";
			
			params={
			build_env:build_env,
			username:CentralizedParameters[0].username,
			password :CentralizedParameters[0].password,
			iibhost : iibhost,
			deployment_path:EnvironmentalParameters[0].deployment_path,
			Config_Service:Config_Service,
			mqsiprofile :EnvironmentalParameters[0].mqsiprofile,
			IIBNode:  IIBNode,
			executionGroup :executionGroup,
			svnusername:loginuser,
		    svnpassword:svnpassword
		}
		}
		
		
		                 
	}
	if(current_job==folder+"/"+flowName+"/Create_Config_Services")
	{
		next_job=folder+"/"+flowName+"/Create_Queues";
		params={
			build_env :build_env,
			username:CentralizedParameters[0].username,
			password:CentralizedParameters[0].password,
			BrokerName :BrokerName,
			deployment_path:EnvironmentalParameters[0].deployment_path,
			iibhost:iibhost,
			svnusername:loginuser,
		    svnpassword:svnpassword

		}
		
	}
	if(current_job==folder+"/"+flowName+"/Create_Queues")
	{
		next_job=folder+"/"+flowName+"/Deploy";
		params={
			build_env:build_env,
			username:CentralizedParameters[0].username,
			password:CentralizedParameters[0].password,
			artifactory_number:artifactory_number,
			ArtifactoryURL : CentralizedParameters[0].ArtifactoryURL,
			mqsiprofile:EnvironmentalParameters[0].mqsiprofile,
			iibhost: iibhost,
			IIBNode:  IIBNode,
			executionGroup :executionGroup,
			deployment_path:EnvironmentalParameters[0].deployment_path,
			ArtifactoryUserName : CentralizedParameters[0].ArtifactoryUserName,
            ArtifactoryPassword : CentralizedParameters[0].ArtifactoryPassword,
			svnusername:loginuser,
		    svnpassword:svnpassword
		}
		
	}
	jenkins.job.get(next_job,({ depth: 2,pretty: 'true'}), function(err, data) {
												  if (err) throw err;
												  if( data.builds == "")
												     {
														 console.log("entered if");
														 build_no=0;
													 }
												  else{
													  console.log("entered else");
													  build_no=data.builds[0].number;
													  } 
												
	 jenkins.job.build({ name: next_job, parameters: params }, function(err) {
												if (err) console.log(err);
												console.log("build triggered");
												setTimeout(function() {
												 executed_job=next_job;
												 res.redirect("/console");
											}, 10000);
											}); 
											
											}); 
	
	
		
})

app.get("/SaveCentralizedParameters",function(req,res){
   
  var  username = req.query.username;	
  var  password = req.query.password;
  var  ArtifactoryURL = req.query.ArtifactoryURL;
  var  ArtifactoryUserName = req.query.ArtifactoryUserName;
  var  ArtifactoryPassword = req.query.ArtifactoryPassword;
  var  svnhost = req.query.svnhost;
  var  SVNBaseURL = req.query.SVNBaseURL;
  var  SVNUserName = req.query.SVNUserName;
  var  SVNPassword = req.query.SVNPassword;
  var  JavaUtilitySVNPath=req.query.JavaUtilitySVNPath;
  var  SVNLibraryRootPath=req.query.SVNLibraryRootPath;
  var  WSDLSVNPath=req.query.WSDLSVNPath;
    
     MongoClient.connect(config.mongodburl, function(err, db) {
        if(db){
            var collection = db.collection('CentralizedParameters');
            if(collection){
                var data = {
                    "username":username,
					"password":password,
					"ArtifactoryURL":ArtifactoryURL,
					"ArtifactoryUserName":ArtifactoryUserName,
					"ArtifactoryPassword":ArtifactoryPassword,
					"svnhost":svnhost,
					"SVNBaseURL":SVNBaseURL,
					"SVNUserName":SVNUserName,
					"SVNPassword":SVNPassword,
                    "JavaUtilitySVNPath":JavaUtilitySVNPath,
                    "SVNLibraryRootPath":SVNLibraryRootPath,
                    "WSDLSVNPath":WSDLSVNPath					
                }
				collection.remove();
                console.log("Inserting the data -------- "+JSON.stringify(data));
					setTimeout(function() {
					collection.insert(data);													 
					}, 3000);
               res.send("CentralizedParameters_saved");
            }    
        }
        else{
            console.log("error is connecting to db");
        }
    });    
    
});

app.get("/SaveEnvironmentalParameters",function(req,res){
   
  var  build_env = req.query.build_env;	
  var  toolkithome = req.query.toolkithome;
  var  iibhost = req.query.iibhost;
  var  IIBNode = req.query.IIBNode;
  var  executionGroup = req.query.executionGroup;
  var  deployment_path = req.query.deployment_path;
  var  mqsiprofile = req.query.mqsiprofile;
  var  BrokerName = req.query.BrokerName;
    
     MongoClient.connect(config.mongodburl, function(err, db) {
        if(db){
            var collection = db.collection('EnvironmentalParameters');
            if(collection){
                var data = {
                    "build_env":build_env,
					"toolkithome":toolkithome,
					"iibhost":iibhost,
					"IIBNode":IIBNode,
					"executionGroup":executionGroup,
					"deployment_path":deployment_path,
					"mqsiprofile":mqsiprofile,
					"BrokerName":BrokerName
										
                }
				collection.remove({ "build_env":build_env});
                console.log("Inserting the data -------- "+JSON.stringify(data));
                setTimeout(function() {
					collection.insert(data);						
					}, 3000);
					 res.send("EnvironmentalParameters_saved");
            }    
        }
        else{
            console.log("error is connecting to db");
        }
    });    
});

app.get("/CentralizedParameters",function(req,res){  
     
     MongoClient.connect(config.mongodburl, function(err, db) {
        if(db){
            var collection = db.collection('CentralizedParameters');
            if(collection){
                collection.find({}).toArray(function (err, result) {
				  if (err) {
					console.log(err);
				  } else if (result.length) {
					  console.log(result);
					res.send(result);
				  }
				  else {
					
					console.log('No document(s) found with defined "find" criteria!');
				  }
				 
				})
            }    
        }
        else{
            console.log("error is connecting to db");
        }
    });    
});

app.get("/EnvironmentalParameters",function(req,res){  
      var  build_env = req.query.build_env;
     MongoClient.connect(config.mongodburl, function(err, db) {
        if(db){
            var collection = db.collection('EnvironmentalParameters');
            if(collection){
                collection.find({build_env:build_env}).toArray(function (err, result) {
				  if (err) {
					console.log(err);
				  } else if (result.length) {
					  
					console.log(result);
					res.send(result);
				  }
				  else {
					res.send("no_record");
					console.log('No document(s) found with defined "find" criteria!');
				  }
				 
				})
            }    
        }
        else{
            console.log("error is connecting to db");
        }
    });    
});

app.get('/details', function (req, res) {
     console.log("came details");
     var details={
        flowName:flowName,
        interfaceName:interfaceName        
     }
     console.log(details);
     res.send(details);     
});
app.get("/rollbackjob",function(req,res){
    console.log("this is rollback job");
    var CentralizedParameters;
    var EnvironmentalParameters;
    build_env = req.query.build_env;
    iibhost = req.query.iibhost;
    IIBNode = req.query.IIBNode;
    executionGroup = req.query.executionGroup;
    BrokerName = req.query.BrokerName;
	var artifactory_number=req.query.artifactory_number;
    var target = req.query.target;
	var svnpassword = req.query.svnpassword;
	current_Interface= req.query.interface_name;
	console.log(target);
    var Config_Service;
         console.log("values are..."+iibhost+"  "+IIBNode+"  "+executionGroup+" "+BrokerName+""+target);
         MongoClient.connect(config.mongodburl, function(err, db) {
                if(db){
                    var collection = db.collection('CentralizedParameters');
                    if(collection){
                        collection.find({}).toArray(function (err, result) {
                          if (err) {
                            console.log(err);
                          } else if (result.length) {
                              console.log(result);
                             CentralizedParameters=result;
                              console.log(CentralizedParameters[0].ArtifactoryURL);
                                                               MongoClient.connect(config.mongodburl, function(err, db) {
                                        if(db){
                                            var collection = db.collection('EnvironmentalParameters');
                                            if(collection){
                                                collection.find({build_env:build_env}).toArray(function (err, result) {
                                                  if (err) {
                                                    console.log(err);
                                                  } else if (result.length) {
                                                      
                                                    console.log(result);
                                                    EnvironmentalParameters=result;
								if(folder=="Transform")
													{
														Config_Service="";
														jenkins.job.get(folder+"/"+flowName+"/"+"Rollback_Decomission",({ depth: 2,pretty: 'true'}), function(err, data) {
												  if (err) throw err;
												  if( data.builds == "")
												     {
														 console.log("entered if");
														 build_no=0;
													 }
												  else{
													  console.log("entered else");
													  build_no=data.builds[0].number;
													  } 
                       
											jenkins.job.build({ name:folder+"/"+flowName+"/"+"Rollback_Decomission", parameters: {  
											build_env:build_env,
											username:CentralizedParameters[0].username,
											password:CentralizedParameters[0].password,
											artifactory_number:artifactory_number,
											executionGroup:executionGroup,
											IIBNode:IIBNode,
											deployment_path:EnvironmentalParameters[0].deployment_path,
											iibhost:iibhost,
											mqsiprofile:EnvironmentalParameters[0].mqsiprofile,
											ArtifactoryURL : CentralizedParameters[0].ArtifactoryURL,
											BrokerName:BrokerName,
											Config_Service:Config_Service,
											target:target,
											svnusername:loginuser,
		                                    svnpassword:svnpassword
											
											} }, function(err) {
																				if (err) console.log(err);
																				console.log("rollback job triggered");
																				setTimeout(function() {
																				 executed_job=folder+"/"+flowName+"/"+"Rollback_Decomission";
																				  res.redirect("/console");
																			}, 10000);
																			}); 
													   });	
													}
													else
													{
								jenkins.job.get(folder+"/"+flowName+"/Create_Config_Services",({ depth: 2,pretty: 'true'}), function(err, data) {
                              if (err) throw err;
                             console.log('job', data.actions[0].parameterDefinitions[5].defaultParameterValue.value);
                           Config_Service=data.actions[0].parameterDefinitions[5].defaultParameterValue.value;
                       
					    jenkins.job.get(folder+"/"+flowName+"/"+"Rollback_Decomission",({ depth: 2,pretty: 'true'}), function(err, data) {
												  if (err) throw err;
												  if( data.builds == "")
												     {
														 console.log("entered if");
														 build_no=0;
													 }
												  else{
													  console.log("entered else");
													  build_no=data.builds[0].number;
													  } 
                       
            jenkins.job.build({ name:folder+"/"+flowName+"/"+"Rollback_Decomission", parameters: {  
            build_env:build_env,
            username:CentralizedParameters[0].username,
            password:CentralizedParameters[0].password,
            artifactory_number:artifactory_number,
            executionGroup:executionGroup,
            IIBNode:IIBNode,
            deployment_path:EnvironmentalParameters[0].deployment_path,
            iibhost:iibhost,
            mqsiprofile:EnvironmentalParameters[0].mqsiprofile,
            ArtifactoryURL : CentralizedParameters[0].ArtifactoryURL,
            BrokerName:BrokerName,
            Config_Service:Config_Service,
            target:target,
			svnusername:loginuser,
		    svnpassword:svnpassword} }, function(err) {
                                                if (err) console.log(err);
                                                console.log("rollback job triggered");
                                                setTimeout(function() {
												 executed_job=folder+"/"+flowName+"/"+"Rollback_Decomission";
												 res.redirect("/console");
											}, 10000);
                                            }); 
					   });											
                  // })
                    
                  //  })
                    
                    })
													}
                   
                    }else {
                                                    
                            console.log('No document(s) found with defined "find" criteria!');
                         }
                                                 
                        })
                            }    
                            }
                            else{
                                console.log("error is connecting to db");
                                }
                            }); 
                          }
                          else {
                            
                            console.log('No document found with defined "find" criteria!');
                          }
                         
                        })
                    }    
                }
                else{
                    console.log("error is connecting to db");
                }
            });   
                                            
});
app.get("/artifactory",function(req,res){
	
	jenkins.job.get(folder+"/"+flowName+"/"+flowName+"_Build",({ depth: 2,pretty: 'true'}), function(err, data) {
                              if (err) throw err;
                             console.log('job', data.actions[0].parameterDefinitions[10].defaultParameterValue.value);
                             svnrepo=data.actions[0].parameterDefinitions[10].defaultParameterValue.value; 
                             
              //  svnUltimate.util.getRevision( svnrepo, function( err, revision ) {
                     //  console.log( "Head revision=" + revision );
                    // var artifactory =revision;
					svnUltimate1(svnrepo, 'HEAD', function(err, info) {
                          if(err) {
                            throw err;
                          }
                          console.log(info.lastChangedRev);
                          artifactory=info.lastChangedRev;
					 var data={
						 artifactory : artifactory
					 }
					   res.send(data);
				})
	})
	
});

app.get('/interfaceretrive', function (req, res) {
   // Prepare output in JSON format

MongoClient.connect(config.mongodburl, function(err, db) {
  if(!err) {
    console.log("We are connected");
 var collection = db.collection('interfaces');

collection.find({},({interface_name:true,_id:false})).toArray(function (err, result) {
      if (err) {
        console.log(err);
      } else if (result.length) {
          
        /* for(i=0;i<result.length;i++)
        {
        console.log('Found:', result[i].flowname);
        } */
        console.log(result);
        interfaceretrive=result;
        res.redirect('/flownameretrive');
      }
      else {
        
      console.log('No document(s) found with defined "find" criteria!');
      }
    
   })
db.close()
  }
})
});
app.get('/flownameretrive', function (req, res) {
   // Prepare output in JSON format

MongoClient.connect(config.mongodburl, function(err, db) {
  if(!err) {
    console.log("We are connected");
 var collection = db.collection('flows');

collection.find({},({flowname:true,_id:false})).toArray(function (err, result) {
      if (err) {
        console.log(err);
      } else if (result.length) {
          
        /* for(i=0;i<result.length;i++)
        {
        console.log('Found:', result[i].flowname);
        } */
        console.log(result);
        flownameretrive=result;
        data={
flownameretrive : flownameretrive,
interfaceretrive : interfaceretrive
        }
        res.send(data);
      }
      else {
        
      console.log('No document(s) found with defined "find" criteria!');
      }
    
   })
db.close()
  }
})
});
app.get('/svnurlretrive', function (req, res) {
   // Prepare output in JSON format
 var flowname=req.query.flowname;
console.log("flowname : "+flowname);
MongoClient.connect(config.mongodburl, function(err, db) {
  if(!err) {
    console.log("We are connected");
 var collection = db.collection('flows');

collection.find({flowname:flowname},({svn_url:true,_id:false})).toArray(function (err, result) {
      if (err) {
        console.log(err);
      } else if (result.length) {
          
        /* for(i=0;i<result.length;i++)
        {
        console.log('Found:', result[i].flowname);
        } */
        console.log(result);
        res.send(result);
      }
      else {
        res.send("no_match")
        console.log('No document(s) found with defined "find" criteria!');
      }
    
   })
db.close()
  }
})
});

app.get('/svnurlretrive1', function (req, res) {
   // Prepare output in JSON format
 var flowname=req.query.flowname;
 var interface_name=req.query.interface_name;
console.log("flowname : "+flowname);
MongoClient.connect(config.mongodburl, function(err, db) {
  if(!err) {
    console.log("We are connected");
 var collection = db.collection('flows');

collection.find({flowname:flowname,interface_name:interface_name},({svn_url:true,_id:false})).toArray(function (err, result) {
      if (err) {
        console.log(err);
      } else if (result.length) {
          
        /* for(i=0;i<result.length;i++)
        {
        console.log('Found:', result[i].flowname);
        } */
        console.log(result);
        res.send(result);
      }
      else {
        res.send("no_match")
        console.log('No document(s) found with defined "find" criteria!');
      }
    
   })
db.close()
  }
})
});

app.get('/AddInterface',function(req,res){
	console.log("Add Interface app.get");
	var flowName = req.query.flow_names;
	var interfaceName = req.query.interface_name;
	var svnURLs = req.query.Remote_SVN_URLs;
	var lengthOfFlow = req.query.length;
	
	console.log(flowName+"  : "+interfaceName+" : "+svnURLs+" : "+lengthOfFlow);
	res.send("received");
	
});
app.get('/UpdateConfigServiceName',function(req,res){  
console.log("Login User"+loginuser);  
    var ConfigServiceName = req.query.ConfigServiceName;
    var SenderHost_IP = req.query.SenderHost_IP;
    var SenderPort_Num = req.query.SenderPort_Num;
   // var svnpassword = req.query.svnpassword;
	var IIBNode = req.query.IIBNode
	var iibhost = req.query.iibhost
	var executionGroup = req.query.executionGroup
	var mqsiprofile = req.query.mqsiprofile
	  interface1 = req.query.i_name;
	//need to get the svnusername from session that means who logged in
	MongoClient.connect(config.mongodburl, function(err, db) {
        if(db){
            var collection = db.collection('CentralizedParameters');
            if(collection){
                collection.find({}).toArray(function (err, result) {
				  if (err) {
					console.log(err);
				  } else if (result.length) {
					  console.log(result);
					username = result[0].username;	
		            password = result[0].password;
	
	 jenkins.job.get("Test_Suite/Change_Sender_ConfigService",({ depth: 2,pretty: 'true'}), function(err, data) {
												  if (err) throw err;
												  if( data.builds == "")
												     {
														 console.log("entered if");
														 build_no=0;
													 }
												  else{
													  console.log("entered else");
													  build_no=data.builds[0].number;
													  }
    
     jenkins.job.build({ name:"Test_Suite/Change_Sender_ConfigService", parameters: {  
           ConfigServiceName:ConfigServiceName,
            SenderHost_IP:SenderHost_IP,
            SenderPort_Num:SenderPort_Num,
            username:username,
            password:password,
			svnusername:username,
			svnpassword:password,
			IIBNode : IIBNode,
	        iibhost : iibhost,
	        executionGroup : executionGroup,
	        mqsiprofile : mqsiprofile
            } }, function(err) {
                                          if (err) console.log(err);
                             console.log("UpdateConfigServiceName job triggered");
							 //res.send("UpdateConfigServiceName job triggered");
                               setTimeout(function() {
												 executed_job="Test_Suite/Change_Sender_ConfigService";
												 res.redirect("/console");
											}, 10000); 
            
            })
			
	 })
	 
	 }
				  else {
					
					console.log('No document(s) found with defined "find" criteria!');
				  }
				 
				})
            }    
        }
        else{
            console.log("error is connecting to db");
        }
    });   
})

app.get('/RunTest',function(req,res){    
    var InputData = req.query.InputData;
    var ReceiverPort = req.query.ReceiverPort;
    var iibhost = req.query.iibhost;
    var FlowName = req.query.FlowName;
     interface1 = req.query.i_name;
	 
	 
	 
	 MongoClient.connect(config.mongodburl, function(err, db) {
        if(db){
            var collection = db.collection('CentralizedParameters');
            if(collection){
                collection.find({}).toArray(function (err, result) {
				  if (err) {
					console.log(err);
				  } else if (result.length) {
					  console.log(result);
					svnusername = result[0].username;	
		            svnpassword = result[0].password;
	 
	 
	jenkins.job.get("Test_Suite/Run_Test",({ depth: 2,pretty: 'true'}), function(err, data) {
												  if (err) throw err;
												  if( data.builds == "")
												     {
														 console.log("entered if");
														 build_no=0;
													 }
												  else{
													  console.log("entered else");
													  build_no=data.builds[0].number;
													  }
     jenkins.job.build({ name:"Test_Suite/Run_Test", parameters: {  
           InputData:InputData,
            ReceiverPort:ReceiverPort,
            iibhost:iibhost,
            FlowName:FlowName,
			svnusername:svnusername,
			svnpassword:svnpassword
            } }, function(err) {
                                          if (err) console.log(err);
                             console.log("RunTest job triggered");
							  //res.send("RunTest job triggered");
											setTimeout(function() {
												 executed_job="Test_Suite/Run_Test";
												 res.redirect("/console");
											}, 10000); 
            })
	})
	
	
	}
				  else {
					
					console.log('No document(s) found with defined "find" criteria!');
				  }
				 
				})
            }    
        }
        else{
            console.log("error is connecting to db");
        }
    });   
	
	
	
	
});


app.get('/editInterface',function(req,res){ 
  editInterfaceName = req.query.editInterfaceName;
  res.send("true");
});

app.get("/editflowsretrive",function(req,res){  
     
	 var i_Name = editInterfaceName
     MongoClient.connect(config.mongodburl, function(err, db) {
        if(db){
            var collection = db.collection('flows');
            if(collection){
                collection.find({interface_name : i_Name}).toArray(function (err, result) {
				  if (err) {
					console.log(err);
				  } else if (result.length) {
					  
					for(i=0;i<result.length;i++)
					{
					console.log('Found:', result[i].flowname);
					}
					data = {
						'result' : result,
						'interfaceName' : i_Name
					}
					res.send(data);
				  }
				  else {
					
					console.log('No document(s) found with defined "find" criteria!');
				  }
				 
				})
            }    
        }
        else{
            console.log("error is connecting to db");
        }
    });    
});

app.get('/deleteflow',function(req,res){
 var  flowname = req.query.flowname;
 var  interface_name = req.query.interface_name;
 var  type = req.query.type;
 var Remote_SVN_URL = req.query.Remote_SVN_URL;
 
      MongoClient.connect(config.mongodburl, function(err, db) {
        if(db){
            var collection = db.collection('flows');
            if(collection){
                collection.remove({interface_name : interface_name,flowname:flowname});
				console.log("database entry removed")
            }    
        }
        else{
            console.log("error is connecting to db");
        }
    }); 
	jenkins.job.destroy(type+"/"+flowname, function(err) {
    if (err) throw err;
	  console.log("flow entry removed")
	  res.send("deleted");
    });
	
})
/*app.get('/test',function(req,res){    

fs.readFile(__dirname+'/Change_Sender_ConfigService.xml','UTF-8', function(err, data) {
       if (err) {
           throw err;
       }
       xml = data;
jenkins.job.create("Test_Suite/Change_Sender_ConfigService",xml, function(err){
                                                                        if (err) throw err;
                                                                        console.log("job created");
                                                                        
                                                                    });
})
                                                                    
})*/ 
app.get('/getdevflowscount',function(req,res){
	MongoClient.connect(config.mongodburl, function(err, db) {
		if(db){
			var collection = db.collection('flows');
			if(collection){
				collection.find().toArray(function (err, result) {
					if (err) {
						console.log(err);
					} else if (result.length) {
					  
					//console.log(result.length);
					data = {
						'flowsCount' : result.length
					};
					res.send(data);
					}
				});
			}
		}
	});
});
app.get('/gettestflowscount',function(req,res){
	MongoClient.connect(config.mongodburl, function(err, db) {
		if(db){
			var collection = db.collection('flowslog');
			if(collection){
				 collection.distinct('flowname',{Environment : "test"},function (err, result) {
					if (err) {
						console.log(err);
					} else if (result.length) {
					  
					//console.log(result.length);
					data = {
						'flowsCount' : result.length
					};
					res.send(data);
					}
					else{
					 console.log("in else"+result.length);
					 res.send("no_records");
					 }
				});
			}
		}
	});
});
app.get('/getprodflowscount',function(req,res){
	MongoClient.connect(config.mongodburl, function(err, db) {
		if(db){
			var collection = db.collection('flowslog');
			if(collection){
				 collection.distinct('flowname',{Environment : "prod"},function (err, result) {
					if (err) {
						console.log(err);
					} else if (result.length) {
					  
					console.log("in cond"+result.length);
					data = {
						'flowsCount' : result.length
					};
					res.send(data);
					}
				 else{
					 console.log("in else"+result.length);
					 res.send("no_records");
					 }
				});
			}
		}
	});
});
app.get('/recentjobs',function(req,res){
	var interface_name= req.query.interfacename;
	MongoClient.connect(config.mongodburl, function(err, db) {
		if(db){
			var collection = db.collection('flowslog');
			if(collection){
				collection.find({interface_name : interface_name}).toArray(function (err, result) {
					if (err) {
						console.log(err);
					} else  {
					  
					//console.log(result[0].flowname);
					/* data = {
						'flowsCount' : result.length
					}; */
					res.send(result);
					}
				});
			}
		}
	});
});
app.get('/dashboardrecentjobs',function(req,res){
	console.log('Helo dash jobs');
	MongoClient.connect(config.mongodburl, function(err, db) {
		if(db){
			var collection = db.collection('flowslog');
			if(collection){
				collection.find().toArray(function (err, result) {
					if (err) {
						console.log(err);
					} else{
					  
					//console.log(result[0].flowname);
					/* data = {
						'flowsCount' : result.length
					}; */
					res.send(result);
					}
				});
			}
		}
	});
});
app.get('/recenttestjobs',function(req,res){
	console.log("recenttestjobs");
	var interface_name= req.query.interfacename;
	MongoClient.connect(config.mongodburl, function(err, db) {
		if(db){
			var collection = db.collection('runtest');
			if(collection){
				collection.find({interface_name : interface_name}).toArray(function (err, result) {
					if (err) {
						console.log(err);
					} else  {
					  
					//console.log(result[0].interface_name);
					/* data = {
						'flowsCount' : result.length
					}; */
					res.send(result);
					}
				});
			}
		}
	});
});
app.get('/getinterfaceflowscount',function(req,res){
	var interface2 = req.query.interfacename;
	var successcount=0;
	MongoClient.connect(config.mongodburl, function(err, db) {
		if(db){
			var collection = db.collection('flows');
			if(collection){
				collection.find({interface_name : interface2}).toArray(function (err, result) {
					if (err) {
						console.log(err);
					} else if (result.length) {
					  
					  for(var i=0; i<result.length;i++)
					  {
						  if(result[i].flowstatus=='SUCCESS')
						  {
							  successcount++;
						  }
					  }
					//console.log(result.length);
					data = {
						'successcount' : successcount,
						'flowsCount' : result.length
					};
					res.send(data);
					}
				});
			}
		}
	});
});
app.get('/getinterface_envflowscount',function(req,res){
	var interface2 = req.query.interfacename;
	var successcount=0;
	MongoClient.connect(config.mongodburl, function(err, db) {
		if(db){
			var collection = db.collection('flowslog');
			if(collection){
				collection.find({interface_name : interface2,Environment : "test"}).toArray(function (err, result) {
					if (err) {
						console.log(err);
					} else if (result.length) {
					  
					  for(var i=0; i<result.length;i++)
					  {
						  if(result[i].flowstatus=='SUCCESS')
						  {
							  successcount++;
						  }
					  }
					//console.log(result.length);
					data = {
						'successcount' : successcount,
						'flowsCount' : result.length
					};
					res.send(data);
					}
				});
			}
		}
	});
});

app.get('/createLibraryBuildFolder',function(req,res){
console.log("In libBuild folder creation");
    Library_Name = req.query.Library_Name;
    Library_URL = req.query.Library_URL;
    var svnpassword = req.query.svnpassword;

 
   svnUltimate.commands.checkout( Library_URL, 'C:\\Ruby23\\files\\libsvn_repo', {username: loginuser,	password: svnpassword},function( err ) {
	   if(err == null){
		   console.log("check out completed"); 
console.log(Library_Name);
console.log(Library_URL);
    if (!fs.existsSync('C:\\Ruby23\\files\\LibBuild')){
        fs.mkdirSync('C:\\Ruby23\\files\\LibBuild');        
    }
	

	/*Changes for LibArtifactory.xml file*/
    var data = fs.readFileSync(__dirname+'/librarytemplates/LibArtifactory.xml', 'utf-8');
    var newValue = data.replace(/Library_Name/gim, Library_Name);
    fs.writeFileSync('C:\\Ruby23\\files\\LibBuild\\LibArtifactory.xml',newValue, 'utf-8');
    /*Changes for LibArtifactory.xml file*/
    
    /*Changes for LibraryBuild.xml file*/
     var data = fs.readFileSync(__dirname+'/librarytemplates/LibraryBuild.xml', 'utf-8');
    var newValue = data.replace(/Library_Name/gim, Library_Name);
    fs.writeFileSync('C:\\Ruby23\\files\\LibBuild\\LibraryBuild.xml', newValue, 'utf-8');
    /*Changes for LibraryBuild.xml file*/
    
  

   
	fs1.copySync('C:\\Ruby23\\files\\LibBuild', 'C:\\Ruby23\\files\\libsvn_repo\\Build', { overwrite: true });
	svnUltimate.commands.add('C:\\Ruby23\\files\\libsvn_repo\\Build',function( err ) {
            svnUltimate.commands.update('C:\\Ruby23\\files\\libsvn_repo',function(err){
                svnUltimate.commands.cleanup('C:\\Ruby23\\files\\libsvn_repo',function(err){
                    svnUltimate.commands.commit('C:\\Ruby23\\files\\libsvn_repo','-q',function(err){
                        console.log( "commit complete" );
						setTimeout(function() {
                        fs1.removeSync('C:\\Ruby23\\files\\libsvn_repo');
						fs1.removeSync('C:\\Ruby23\\files\\LibBuild');
						//res.send("created");
						res.redirect('/libInterface');
						         }, 3000);
                    });
                });
            });
        });
	
	

	   }else{
		   console.log(err);
		   res.send("Authentication Failed");
	   }
	   }) ;
	    

})



app.get('/libInterface',function(req,res){
console.log("libcreateInterface");
console.log(Library_Name);

MongoClient.connect(config.mongodburl, function(err, db) {
    if(db){
            var collection = db.collection('CentralizedParameters');
            
           if(collection){
                collection.find({}).toArray(function (finderror, result)
                {
                
                   if(finderror)
                        {
                        console.log("Unable to execute find operation");
                        }
                   else if (result.length)
                        {
                             console.log(result[0].JavaUtilitySVNPath);
                              console.log(result[0].SVNLibraryRootPath);
                               console.log(result[0].WSDLSVNPath);
    
                    var JavaUtilitySVNPath = result[0].JavaUtilitySVNPath;
                    var SVNLibraryRootPath = result[0].SVNLibraryRootPath;
                    var WSDLSVNPath = result[0].WSDLSVNPath;

	
	 if (!fs.existsSync('C:\\Ruby23\\files\\libjob_configfiles')){
		 console.log("created new folder");
        fs.mkdirSync('C:\\Ruby23\\files\\libjob_configfiles');        
        }	else{
			console.log("folder exists");
			rmdirSync('C:\\Ruby23\\files\\libjob_configfiles', function(error){
                if(error){
                    console.log(error);
                }
            });
			console.log("folder removed");
			fs.mkdirSync('C:\\Ruby23\\files\\libjob_configfiles');        
			console.log("Created a new folder after deleting");
		}
		
	/*Changes for Library_Deploy.xml file*/
    var data = fs.readFileSync(__dirname+'/libraryjob_templates/Library_Deploy.xml', 'utf-8');
    var newValue = data.replace(/Library_URL/gim, Library_URL);
	var newValue1 = newValue.replace(/Library_Name/gim, Library_Name);
    fs.writeFileSync('C:\\Ruby23\\files\\libjob_configfiles\\Deploy_'+Library_Name+'.xml',newValue1, 'utf-8');
    /*Changes for Library_Deploy.xml file*/
	
	/*Changes for Library_Build.xml file*/
    var data = fs.readFileSync(__dirname+'/libraryjob_templates/Library_Build.xml', 'utf-8');
    var newValue = data.replace(/Library_URL/gim, Library_URL);
	var newValue1 = newValue.replace(/Library_Name/gim, Library_Name);
	var newValue2 = newValue1.replace(/Java_Utility_SVN_Path/gim, JavaUtilitySVNPath);
    var newValue3 = newValue2.replace(/WSDL_SVN_Path/gim, WSDLSVNPath);
    fs.writeFileSync('C:\\Ruby23\\files\\libjob_configfiles\\'+Library_Name+'_Build.xml',newValue3, 'utf-8');
    /*Changes for Library_Build.xml file*/
	
	
	
	 if (fs.existsSync('C:\\Ruby23\\files\\libjob_configfiles\\'+Library_Name+'_Build.xml')){
       res.redirect('/createlibjob'); 
//res.send("jobfiles created")	   
    }
	
	}
                        else
                        {
                            console.log("no records found");
                        }
    
                })
            }
    }
 });
	
	
});

app.get('/createlibjob',function(req,res){
	console.log("entered createlibjob");   
 fs.readFile(__dirname+'/configfolder.xml','UTF-8', function(err, data) {
	   if (err) {
		   throw err;
	   }
	   xml = data;
	    jenkins.job.exists("LibraryManagement", function(err, exists) {
		    if (exists==false)
			{
				console.log("LibraryManagement need to create");
				jenkins.job.create("LibraryManagement",xml, function(err){
				if (err) throw err;
				console.log("LibraryManagement created");
				
					fs.readFile(__dirname+'/configfolder.xml','UTF-8', function(err, data) {
					if (err) {throw err;}
					 xml1 = data;
						jenkins.job.exists("LibraryManagement/"+Library_Name, function(err, exists) {
							if (exists==false)
							{
								jenkins.job.create("LibraryManagement/"+Library_Name,xml1, function(err){
								if (err) throw err;
								console.log("LibraryManagement/"+Library_Name+" created");
								dir1 = "C:\\Ruby23\\files\\libjob_configfiles";				  
									fs.readdir(dir1, function(err, filenames) {
									if (err) {console.log(err);}
									var  jlength=2;		
										filenames.forEach(function(filename) {
											jlength--;
											console.log(filename);
											if (err) {console.log(err);}
												fs.readFile(dir1+'/'+filename,'UTF-8', function(err, data) {
												if (err) {throw err;}
												var xml2 = data;
													jenkins.job.exists("LibraryManagement/"+Library_Name+"/"+(filename.substr(0,filename.indexOf("."))), function(err, exists) {
														if (exists==false)
														{
															jenkins.job.create("LibraryManagement/"+Library_Name+"/"+(filename.substr(0,filename.indexOf("."))),xml2, function(err){
															if (err) throw err;
															console.log("job created");
																			
															});
														}
														else
														{
															console.log("Job Exists");
														}
													})
																		
																	 
												})
											if(jlength<1)
											{
												var createTime = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
											    var createdate1 = new Date().toDateString();
											    var createDate =createdate1.slice(createdate1.indexOf(" "),createdate1.length);
												
												
												MongoClient.connect(config.mongodburl, function(err, db) {
													if(db){
														var collection = db.collection('svn_library_urls_list');
																			
														if(collection){
															var data = {
																"url_key":Library_Name,
																"url_value":Library_URL,
																"createdDate": createDate,
																"createdtime": createTime,
																"updatedDate":"",
																"updatedTime":"",
																"flowstatus":"",
																"Environment":"dev",
																"By":loginuser
																								
															}
															console.log("Inserting the data -------- "+JSON.stringify(data));
															collection.insert(data);
														}else
														{
															console.log("collection not found");
															db.createCollection("svn_library_urls_list",function(err,res){
																console.log(err);
																console.log("created collection");
															});
															var data = {
																	"url_key":Library_Name,
																	"url_value":Library_URL,
																	"createdDate": createDate,
																	"createdtime": createTime,
																	"updatedDate":"",
																	"flowstatus":"",
																	"updatedTime":"",
																	"Environment":"dev",
																	"By":loginuser
															}
															console.log("Inserting the data -------- "+JSON.stringify(data));
															collection.insert(data);
														}
																			
													}
													else{console.log("error is connecting to db");}
												});	
												setTimeout(function() {
													console.log("library created");
													res.send("created");		
												}, 5000);
											
											}
										
										})
									
									})			  
								})
							}
							else
							{
								dir1 = "C:\\Ruby23\\files\\libjob_configfiles";
								fs.readdir(dir1, function(err, filenames) {
								if (err) {console.log(err);}
								var  jlength=2;		
									filenames.forEach(function(filename) {
										jlength--;
									    console.log(filename);
										if (err) {console.log(err);}
											fs.readFile(dir1+'/'+filename,'UTF-8', function(err, data) {
											if (err) {throw err;}
											var xml2 = data;
												jenkins.job.exists("LibraryManagement/"+Library_Name+"/"+(filename.substr(0,filename.indexOf("."))), function(err, exists) {
													if (exists==false)
													{
														jenkins.job.create("LibraryManagement/"+Library_Name+"/"+(filename.substr(0,filename.indexOf("."))),xml2, function(err){
														if (err) throw err;
														console.log("job created");
																		
														});
													}
													else
													{
													    console.log("Job Exists");
													}
												})
																	
																 
											})
										if(jlength<1)
										{
											var createTime = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
											var createdate1 = new Date().toDateString();
											var createDate =createdate1.slice(createdate1.indexOf(" "),createdate1.length);
											MongoClient.connect(config.mongodburl, function(err, db) {
												if(db){
													var collection = db.collection('svn_library_urls_list');
																		
													if(collection){
														var data = {
															"url_key":Library_Name,
																"url_value":Library_URL,
																"createdDate": createDate,
																"createdtime": createTime,
																"updatedDate":"",
																"updatedTime":"",
																"flowstatus":"",
																"Environment":"dev",
																"By":loginuser
																							
														}
														console.log("Inserting the data -------- "+JSON.stringify(data));
														collection.insert(data);
													}else
													{
														console.log("collection not found");
														db.createCollection("svn_library_urls_list",function(err,res){
															console.log(err);
															console.log("created collection");
														});
														var data = {
																"url_key":Library_Name,
																"url_value":Library_URL,
																"createdDate": createDate,
																"createdtime": createTime,
																"updatedDate":"",
																"updatedTime":"",
																"flowstatus":"",
																"Environment":"dev",
																"By":loginuser
														}
														console.log("Inserting the data -------- "+JSON.stringify(data));
														collection.insert(data);
													}
																		
												}
												else{console.log("error is connecting to db");}
											});	
											setTimeout(function() {
												console.log("library created");
												res.send("created");		
											}, 5000);
										
										}
										
									})
									
									
								})
							}
					 
						})
					 
					})
											    
												 
				
				})
						  
						  
						  
						  
						  
						  
			}
					
			else
			{
			 
			console.log("LibraryManagement folder exist");
			fs.readFile(__dirname+'/configfolder.xml','UTF-8', function(err, data) {
			if (err) {throw err;}
			xml1 = data;
				jenkins.job.exists("LibraryManagement/"+Library_Name, function(err, exists) {
							if (exists==false)
							{
								jenkins.job.create("LibraryManagement/"+Library_Name,xml1, function(err){
								if (err) throw err;
								console.log("LibraryManagement/"+Library_Name+" created");
								dir1 = "C:\\Ruby23\\files\\libjob_configfiles";				  
									fs.readdir(dir1, function(err, filenames) {
									if (err) {console.log(err);}
									var  jlength=2;		
										filenames.forEach(function(filename) {
											jlength--;
											console.log(filename);
											if (err) {console.log(err);}
												fs.readFile(dir1+'/'+filename,'UTF-8', function(err, data) {
												if (err) {throw err;}
												var xml2 = data;
													jenkins.job.exists("LibraryManagement/"+Library_Name+"/"+(filename.substr(0,filename.indexOf("."))), function(err, exists) {
														if (exists==false)
														{
															jenkins.job.create("LibraryManagement/"+Library_Name+"/"+(filename.substr(0,filename.indexOf("."))),xml2, function(err){
															if (err) throw err;
															console.log("job created");
																			
															});
														}
														else
														{
															console.log("Job Exists");
														}
													})
																		
																	 
												})
											if(jlength<1)
											{
												var createTime = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
											var createdate1 = new Date().toDateString();
											var createDate =createdate1.slice(createdate1.indexOf(" "),createdate1.length);
												MongoClient.connect(config.mongodburl, function(err, db) {
													if(db){
														var collection = db.collection('svn_library_urls_list');
																			
														if(collection){
															var data = {
																"url_key":Library_Name,
																"url_value":Library_URL,
																"createdDate": createDate,
																"createdtime": createTime,
																"updatedDate":"",
																"updatedTime":"",
																"flowstatus":"",
																"Environment":"dev",
																"By":loginuser
																								
															}
															console.log("Inserting the data -------- "+JSON.stringify(data));
															collection.insert(data);
														}else
														{
															console.log("collection not found");
															db.createCollection("svn_library_urls_list",function(err,res){
																console.log(err);
																console.log("created collection");
															});
															var data = {
																	"url_key":Library_Name,
																"url_value":Library_URL,
																"createdDate": createDate,
																"createdtime": createTime,
																"updatedDate":"",
																"updatedTime":"",
																"flowstatus":"",
																"Environment":"dev",
																"By":loginuser
															}
															console.log("Inserting the data -------- "+JSON.stringify(data));
															collection.insert(data);
														}
																			
													}
													else{console.log("error is connecting to db");}
												});	
												setTimeout(function() {
													console.log("library created");
													res.send("created");		
												}, 5000);
											
											}
										
										})
									
									})			  
								})
							}
							else
							{
								dir1 = "C:\\Ruby23\\files\\libjob_configfiles";
								fs.readdir(dir1, function(err, filenames) {
								if (err) {console.log(err);}
								var  jlength=2;		
									filenames.forEach(function(filename) {
										jlength--;
									    console.log(filename);
										if (err) {console.log(err);}
											fs.readFile(dir1+'/'+filename,'UTF-8', function(err, data) {
											if (err) {throw err;}
											var xml2 = data;
												jenkins.job.exists("LibraryManagement/"+Library_Name+"/"+(filename.substr(0,filename.indexOf("."))), function(err, exists) {
													if (exists==false)
													{
														jenkins.job.create("LibraryManagement/"+Library_Name+"/"+(filename.substr(0,filename.indexOf("."))),xml2, function(err){
														if (err) throw err;
														console.log("job created");
																		
														});
													}
													else
													{
													    console.log("Job Exists");
													}
												})
																	
																 
											})
										if(jlength<1)
										{
											var createTime = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
											var createdate1 = new Date().toDateString();
											var createDate =createdate1.slice(createdate1.indexOf(" "),createdate1.length);
											MongoClient.connect(config.mongodburl, function(err, db) {
												if(db){
													var collection = db.collection('svn_library_urls_list');
																		
													if(collection){
														var data = {
															"url_key":Library_Name,
																"url_value":Library_URL,
																"createdDate": createDate,
																"createdtime": createTime,
																"updatedDate":"",
																"updatedTime":"",
																"flowstatus":"",
																"Environment":"dev",
																"By":loginuser
																							
														}
														console.log("Inserting the data -------- "+JSON.stringify(data));
														collection.insert(data);
													}else
													{
														console.log("collection not found");
														db.createCollection("svn_library_urls_list",function(err,res){
															console.log(err);
															console.log("created collection");
														});
														var data = {
																"url_key":Library_Name,
																"url_value":Library_URL,
																"createdDate": createDate,
																"createdtime": createTime,
																"updatedDate":"",
																"updatedTime":"",
																"flowstatus":"",
																"Environment":"dev",
																"By":loginuser
														}
														console.log("Inserting the data -------- "+JSON.stringify(data));
														collection.insert(data);
													}
																		
												}
												else{console.log("error is connecting to db");}
											});	
											setTimeout(function() {
												console.log("library created");
												res.send("created");		
											}, 5000);
										
										}
										
									})
									
									
								})
							}
					 
				})		 
					 
					 
			})
		 
			}
						
						
		})
	})
});


app.get("/librarylist",function(req,res){   
     MongoClient.connect(config.mongodburl, function(err, db) {
        if(db){
            var collection = db.collection('svn_library_urls_list');
            if(collection){
                collection.find().toArray(function (err, result) {
				  if (err) {
					console.log(err);
				  } else if (result.length) {
					  
					for(i=0;i<result.length;i++)
					{
					console.log('Found:', result[i].url_key);
					}
					res.send(result);
				  }
				  else {
					
					console.log('No document(s) found with defined "find" criteria!');
				  }
				 
				})
            }    
        }
        else{
            console.log("error is connecting to db");
        }
    });    
});


app.get("/libbuild",function(req,res){
	
data={};
   console.log("entered build"); 
         build_env = req.query.build_env;
         console.log(build_env); 
	     iibhost=req.query.iibhost;

		 IIBNode=req.query.IIBNode;

		 executionGroup=req.query.executionGroup;
		
		//BrokerName=req.query.BrokerName;
		
		svnpassword=req.query.svnpassword;
      
			MongoClient.connect(config.mongodburl, function(err, db) {
				if(db){
					var collection = db.collection('CentralizedParameters');
					if(collection){
						collection.find({}).toArray(function (err, result) {
						  if (err) {
							console.log(err);
						  } else if (result.length) {
							  console.log(result);
							  CentralizedParameters=result;
							  console.log(CentralizedParameters[0].ArtifactoryURL);
							  var collection1 = db.collection('EnvironmentalParameters');
							  collection1.find({build_env:build_env}).toArray(function (err, result1) {
												  if (err) {
													console.log(err);
												  } else if (result1.length) {
													  
													console.log(result1);
													EnvironmentalParameters=result1;
													jenkins.job.get("LibraryManagement/"+Library_Name+"/"+Library_Name+"_Build",({ depth: 2,pretty: 'true'}), function(err, data) {
							                          if (err) throw err;
							
													projectname=data.actions[0].parameterDefinitions[3].defaultParameterValue.value;
													svnrepo=data.actions[0].parameterDefinitions[5].defaultParameterValue.value; 
													if( data.builds == "")
												     {
														 console.log("entered if");
														 build_no=0;
													 }
													else{
													  console.log("entered else");
													  build_no=data.builds[0].number;
													  } 
													  
													 jenkins.job.build({ name: "LibraryManagement/"+Library_Name+"/"+Library_Name+"_Build", parameters: {      		build_env:build_env,
														username:CentralizedParameters[0].username,
														password :CentralizedParameters[0].password,
														toolkithome :EnvironmentalParameters[0].toolkithome,
														svnhost :CentralizedParameters[0].svnhost,
														ArtifactoryURL:CentralizedParameters[0].ArtifactoryURL,
														ArtifactoryUserName : CentralizedParameters[0].ArtifactoryUserName,
														ArtifactoryPassword : CentralizedParameters[0].ArtifactoryPassword,
														projectname :projectname,
														svnrepo:svnrepo,
														svnusername:loginuser,
														svnpassword:svnpassword
								} }, function(err) {
												if (err) console.log(err);
												console.log("build triggered");
												setTimeout(function() {
														executed_job="LibraryManagement/"+Library_Name+"/"+Library_Name+"_Build";
												 res.redirect("/console?Library_Name="+Library_Name);
											}, 10000); 
											//res.send("triggered");
											});  
													  
													  
													  
													  
													  
													})
													
													
													}
													else {
							
														console.log('No document(s) found with defined "find" criteria!');
														}
				
								})
				
				
							}
							else {
							
							console.log('No document(s) found with defined "find" criteria!');
						  }
				
						})
				
					}
				
				}
				else{
					console.log("error is connecting to db");
				}
			
            })
			

})

app.get('/viewLibrarypage',function(req,res){
	Library_Name = req.query.Library_Name;
MongoClient.connect(config.mongodburl, function(err, db) {
		if(db){
			var collection = db.collection('svn_library_urls_list');
			if(collection){
				collection.find({url_key : Library_Name}).toArray(function (err, result) {
					if (err) {
						console.log(err);
					} else if (result.length) {
					  Library_URL = result[0].url_value;
					console.log(Library_URL);
					res.send('nameReceived');
					}
				});
			}
		}
	});

});
app.get('/getLibName',function(req,res){
	console.log('Requested Libname ==> '+Library_Name);
	res.send(Library_Name);
});

app.get("/libdeploy",function(req,res){
	//data={};
   console.log("entered deploy"); 
         build_env = req.query.build_env;
         console.log(build_env); 
	     iibhost=req.query.iibhost;

		 IIBNode=req.query.IIBNode;

		 executionGroup=req.query.executionGroup;
		
	//	BrokerName=req.query.BrokerName;
		
		svnpassword=req.query.svnpassword;
      
			MongoClient.connect(config.mongodburl, function(err, db) {
				if(db){
					var collection = db.collection('CentralizedParameters');
					if(collection){
						collection.find({}).toArray(function (err, result) {
						  if (err) {
							console.log(err);
						  } else if (result.length) {
							  console.log(result);
							  CentralizedParameters=result;
							  console.log(CentralizedParameters[0].ArtifactoryURL);
							  var collection1 = db.collection('EnvironmentalParameters');
							  collection1.find({build_env:build_env}).toArray(function (err, result1) {
												  if (err) {
													console.log(err);
												  } else if (result1.length) {
													  
													console.log(result1);
													EnvironmentalParameters=result1;
													
													jenkins.job.get("LibraryManagement/"+Library_Name+"/"+"Deploy_"+Library_Name,({ depth: 2,pretty: 'true'}), function(err, data) {
							                          if (err) throw err;
												
													if( data.builds == "")
												     {
														 console.log("entered if");
														 build_no=0;
													 }
													else{
													  console.log("entered else");
													  build_no=data.builds[0].number;
													  } 
													  svnUltimate1(Library_URL, 'HEAD', function(err, info) {
													  if(err) {throw err; }
										
													  console.log(info.lastChangedRev);
													  artifactory_number=info.lastChangedRev; 
													 jenkins.job.build({ name: "LibraryManagement/"+Library_Name+"/"+"Deploy_"+Library_Name, parameters: {        
													       // build_env:build_env,
															username:CentralizedParameters[0].username,
															password:CentralizedParameters[0].password,
															artifactory_number:artifactory_number,
															ArtifactoryURL : CentralizedParameters[0].ArtifactoryURL,
															mqsiprofile:EnvironmentalParameters[0].mqsiprofile,
															iibhost: iibhost,
															IIBNode:  IIBNode,
															executionGroup :executionGroup,
															deployment_path:EnvironmentalParameters[0].deployment_path,
															ArtifactoryUserName : CentralizedParameters[0].ArtifactoryUserName,
															ArtifactoryPassword : CentralizedParameters[0].ArtifactoryPassword,
															svnusername:loginuser,
															svnpassword:svnpassword
								} }, function(err) {
												if (err) console.log(err);
												console.log("deploy triggered");
												//res.send("triggered");
												 setTimeout(function() {
														executed_job="LibraryManagement/"+Library_Name+"/"+"Deploy_"+Library_Name;
												 res.redirect("/console?Library_Name="+Library_Name);
											}, 10000);
											});   
													  
													})  
													  
													  
													  
													})
													
													
													}
													else {
							
														console.log('No document(s) found with defined "find" criteria!');
														}
				
								})
				
				
							}
							else {
							
							console.log('No document(s) found with defined "find" criteria!');
						  }
				
						})
				
					}
				
				}
				else{
					console.log("error is connecting to db");
				}
			
            })
			
	
})
app.get('/recentlibjobs',function(req,res){
	console.log("recentlibjobs");
	var url_key= req.query.url_key;
	MongoClient.connect(config.mongodburl, function(err, db) {
		if(db){
			var collection = db.collection('librarylog');
			if(collection){
				collection.find({url_key : url_key}).toArray(function (err, result) {
					if (err) {
						console.log(err);
					} else if (result.length) {
					  
					console.log(result[0].url_key);
					/* data = {
						'flowsCount' : result.length
					}; */
					res.send(result);
					}
					else
					{
						res.send("no_records");
					}
				});
			}
		}
	});
});


app.get('/recentdeploy',function(req,res){
	var interface_name= req.query.interface_name;
	var flowname= req.query.flowname;
	var build_env= req.query.build_env
	MongoClient.connect(config.mongodburl, function(err, db) {
		if(db){
			var collection = db.collection('flowslog');
			if(collection){
				//db.flowslog.find({interface_name : "Test3",flowname : "Test3_Sender",Environment: "test"}).sort({"updatedDate": -1,"updatedTime": -1}).limit(1)
				collection.find({interface_name : interface_name,flowname : flowname,Environment: build_env}).sort({"updatedDate": -1,"updatedTime": -1}).limit(1).toArray(function (err, result) {
					if (err) {
						console.log(err);
					} else if (result.length) {
					  
					console.log(result[0].Environment);
					/* data = {
						'flowsCount' : result.length
					}; */
					res.send(result);
					}
					else
					{
						res.send("no_record")
					}
				});
			}
		}
	});
	
	
})


app.get('/promote', function (req, res) {
	data={};
   console.log("entered promote"); 
console.log(loginuser);
//console.log(password);
         build_env = req.query.build_env;
         console.log(build_env); 
	     iibhost=req.query.iibhost;

		 IIBNode=req.query.IIBNode;

		 executionGroup=req.query.executionGroup;
		
		BrokerName=req.query.BrokerName;
		
		svnpassword=req.query.svnpassword;
      
					MongoClient.connect(config.mongodburl, function(err, db) {
				if(db){
					var collection = db.collection('CentralizedParameters');
					if(collection){
						collection.find({}).toArray(function (err, result) {
						  if (err) {
							console.log(err);
						  } else if (result.length) {
							  console.log(result);
							  CentralizedParameters=result;
							  console.log(CentralizedParameters[0].ArtifactoryURL);
															   MongoClient.connect(config.mongodburl, function(err, db) {
										if(db){
											var collection = db.collection('EnvironmentalParameters');
											if(collection){
												collection.find({build_env:build_env}).toArray(function (err, result) {
												  if (err) {
													console.log(err);
												  } else if (result.length) {
													  
													console.log(result);
													EnvironmentalParameters=result;
				jenkins.job.get(folder+"/"+flowName+"/"+flowName+"_Build",({ depth: 2,pretty: 'true'}), function(err, data) {
							  if (err) throw err;
							 console.log('job', data.actions[0].parameterDefinitions[9].defaultParameterValue.value);
							 projectname=data.actions[0].parameterDefinitions[8].defaultParameterValue.value;
							 messageflowname=data.actions[0].parameterDefinitions[9].defaultParameterValue.value;
							 svnrepo=data.actions[0].parameterDefinitions[10].defaultParameterValue.value; 
							  if( data.builds == "")
												     {
														 console.log("entered if");
														 build_no=0;
													 }
												  else{
													  console.log("entered else");
													  build_no=data.builds[0].number;
													  } 
							  console.log('job', projectname);
							  if(folder=="Transform")
							  {
								 // svnUltimate.util.getRevision( svnrepo, function( err, revision ) {
				      // console.log( "Head revision=" + revision );
					  // artifactory_number=revision;
					  svnUltimate1(svnrepo, 'HEAD', function(err, info) {
                          if(err) {
                            throw err;
                          }
                          console.log(info.lastChangedRev);
                          artifactory_number=info.lastChangedRev;
					    jenkins.job.build({ name: folder+"/"+flowName+"/Library_Detection", parameters: { 
										username :CentralizedParameters[0].username,
										password : CentralizedParameters[0].password,
										iibhost  : iibhost,
										mqsiprofile :  EnvironmentalParameters[0].mqsiprofile,
										IIBNode: IIBNode,
										executionGroup:executionGroup,
										svnhost:CentralizedParameters[0].svnhost,
										svnrepo:svnrepo,
										svnusername:loginuser,
										svnpassword:svnpassword
								} }, function(err) {
												if (err) console.log(err);
												console.log("build triggered");
												setTimeout(function() {
														executed_job=folder+"/"+flowName+"/Library_Detection";
												 res.redirect("/console");
											}, 11000);
											}); 
					   
			         }); 
							  }
							  else
							  {
							   jenkins.job.get(folder+"/"+flowName+"/Create_Config_Services",({ depth: 2,pretty: 'true'}), function(err, data) {
							  if (err) throw err;
							 console.log('job', data.actions[0].parameterDefinitions[5].defaultParameterValue.value);
							 Config_Service=data.actions[0].parameterDefinitions[5].defaultParameterValue.value;
							 
				//svnUltimate.util.getRevision( svnrepo, function( err, revision ) {
				      // console.log( "Head revision=" + revision );
					 //  artifactory_number=revision;
					 svnUltimate1(svnrepo, 'HEAD', function(err, info) {
                          if(err) {
                            throw err;
                          }
                          console.log(info.lastChangedRev);
                          artifactory_number=info.lastChangedRev;
					    jenkins.job.build({ name: folder+"/"+flowName+"/Library_Detection", parameters: { 
						                username :CentralizedParameters[0].username,
										password : CentralizedParameters[0].password,
										iibhost  : iibhost,
										mqsiprofile :  EnvironmentalParameters[0].mqsiprofile,
										IIBNode: IIBNode,
										executionGroup:executionGroup,
										svnhost:CentralizedParameters[0].svnhost,
										svnrepo:svnrepo,
										svnusername:loginuser,
										svnpassword:svnpassword
								} }, function(err) {
												if (err) console.log(err);
												console.log("build triggered");
												setTimeout(function() {
														executed_job=folder+"/"+flowName+"/Library_Detection";
												 res.redirect("/console");
											}, 11000);
											}); 
					   
			         });   
							 
							 
							 
							 
							  }); 
							  }
							  
							  
							  
							}); 
												  }
												  else {
													
													console.log('No document(s) found with defined "find" criteria!');
												  }
												 
												})
											}    
										}
										else{
											console.log("error is connecting to db");
										}
									}); 
						  }
						  else {
							
							console.log('No document(s) found with defined "find" criteria!');
						  }
						 
						})
					}    
				}
				else{
					console.log("error is connecting to db");
				}
			});   
					
});


app.get('/recentflowjobs',function(req,res){
	var interfacename = req.query.interface_name;
	var flowname = req.query.flowname
	console.log("flowjobslog-----"+interfacename+flowname)
	MongoClient.connect(config.mongodburl, function(err, db) {
		if(db){
			var collection = db.collection('flowslog');
			if(collection){
				collection.find({interface_name : interfacename,flowname:flowname}).toArray(function (err, result) {
					if (err) {
						console.log(err);
					} else if (result.length) {
					
					res.send(result);
					}
					else{console.log("no_records")}
				});
			}
		}
	});
});

app.get('/svnassociation',function(req,res){
	var interfacename = req.query.interface_name;
	var flowname = req.query.flowname;
	var Remote_SVN_URL = req.query.Remote_SVN_URL;
	
	
	MongoClient.connect(config.mongodburl, function(err, db) {
															 if(db){
																		var collection = db.collection('flows');
																		
										if(collection){
											var createTime = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
											var createdate1 = new Date().toDateString();
											var createDate =createdate1.slice(createdate1.indexOf(" "),createdate1.length);
											
											var data = {
															"interface_name":interface_name,
															"flowname":flowname,
															"svn_url": Remote_SVN_URL,
															"createdDate": createDate,
															"createdtime": createTime,
															"updatedDate":"",
															"updatedTime":"",
															"Environment":"dev",
															"By":loginuser
														}
														console.log("Inserting the data -------- "+JSON.stringify(data));
														collection.insert(data);
														res.send("inserted association");
										}
									}
	});		
});

app.get('/editlibraryname',function(req,res){ 
  editLibraryName = req.query.editLibraryName;
  console.log(editLibraryName);
  res.send("true");
});

app.get('/editLibrarydetails',function(req,res){ 
var l_Name = editLibraryName
     MongoClient.connect(config.mongodburl, function(err, db) {
        if(db){
            var collection = db.collection('svn_library_urls_list');
            if(collection){
                collection.find({url_key : l_Name}).toArray(function (err, result) {
				  if (err) {
					console.log(err);
				  } else if (result.length) {
					  
					for(i=0;i<result.length;i++)
					{
					console.log('Found:', result[i].url_value);
					}
					data = {
						'result' : result,
						'LibraryName' : l_Name
					}
					res.send(data);
				  }
				  else {
					
					console.log('No document(s) found with defined "find" criteria!');
				  }
				 
				})
            }    
        }
        else{
            console.log("error is connecting to db");
        }
    });    
});

app.get('/deletelibrary',function(req,res){
 var  library_name = req.query.library_name;
 
      MongoClient.connect(config.mongodburl, function(err, db) {
        if(db){
            var collection = db.collection('svn_library_urls_list');
            if(collection){
                collection.remove({url_key : library_name});
				console.log("database entry removed")
            }    
        }
        else{
            console.log("error is connecting to db");
        }
    }); 
	jenkins.job.destroy("LibraryManagement/"+library_name, function(err) {
    if (err) throw err;
	  console.log("flow entry removed")
	  res.send("deleted");
    });
	
})
