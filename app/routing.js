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
var client;
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
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
	 interface_name = req.query.interface_name;
     flowname = req.query.flowname;	
	 folder = req.query.folder;
	 Remote_SVN_URL = req.query.Remote_SVN_URL;
	 
 
	 console.log(Remote_SVN_URL);
	
	  /* rmdir(__dirname+'/job_configfiles', function(error){
                if(error){
                    console.log(error);
                }
            }); */	
	 if (!fs.existsSync(__dirname+'/job_configfiles')){
		 console.log("created new folder");
        fs.mkdirSync(__dirname+'/job_configfiles');        
        }	else{
			console.log("folder exists");
			rmdirSync(__dirname+'/job_configfiles', function(error){
                if(error){
                    console.log(error);
                }
            });
			console.log("folder removed");
			fs.mkdirSync(__dirname+'/job_configfiles');        
			console.log("Created a new folder after deleting");
		}
		if(!(folder == 'Transform')){
			/*Changes for Create_config_job.xml file*/
			var data = fs.readFileSync(__dirname+'/job_templates/Create_Config_Services.xml', 'utf-8');
			var newValue = data.replace(/Remote_SVN_URL/gim, Remote_SVN_URL);
			var newValue1 = newValue.replace(/TCPIPServer_Command/gim, TCPIPServer_Command);
			fs.writeFileSync(__dirname+'/job_configfiles/Create_Config_Services.xml',newValue1, 'utf-8');
			/*Changes for Create_config_job.xml file*/
		}else{
			console.log("Folder is "+folder+". So, skipped creating this job Create_Config_job");
		}
	
		
	/*Changes for Create_Queues.xml file*/
    var data = fs.readFileSync(__dirname+'/job_templates/Create_Queues.xml', 'utf-8');
    var newValue = data.replace(/Remote_SVN_URL/gim, Remote_SVN_URL);
	var newValue1 = newValue.replace(/Flow_Name/gim, flowname);
	var newValue2 = newValue1.replace(/Flow_Type/gim, folder);
    fs.writeFileSync(__dirname+'/job_configfiles/Create_Queues.xml',newValue2, 'utf-8');
    /*Changes for Create_Queues.xml file*/
	
	/*Changes for Deploy_to_test.xml file*/
    var data = fs.readFileSync(__dirname+'/job_templates/Deploy_to_test.xml', 'utf-8');
    var newValue = data.replace(/Remote_SVN_URL/gim, Remote_SVN_URL);
    var newValue1 = newValue.replace(/Flow_Name/gim, flowname);
    var newValue2 = newValue1.replace(/Flow_Type/gim, folder);
    fs.writeFileSync(__dirname+'/job_configfiles/Deploy.xml',newValue2, 'utf-8');
    /*Changes for Deploy_to_test.xml file*/
	
	/*Changes for Flow_name_Build.xml file*/
    var data = fs.readFileSync(__dirname+'/job_templates/Flow_name_Build.xml', 'utf-8');
    var newValue = data.replace(/Remote_SVN_URL/gim, Remote_SVN_URL);
	var newValue1 = newValue.replace(/Flow_Name/gim, flowname);
	var newValue2 = newValue1.replace(/Flow_Type/gim, folder);
    fs.writeFileSync(__dirname+'/job_configfiles/'+flowname+'_Build.xml',newValue2, 'utf-8');
    /*Changes for Flow_name_Build.xml file*/
	
	/*Changes for Library_Detection.xml file*/
    var data = fs.readFileSync(__dirname+'/job_templates/Library_Detection.xml', 'utf-8');
    var newValue = data.replace(/Remote_SVN_URL/gim, Remote_SVN_URL);
	var newValue1 = newValue.replace(/Flow_Name/gim, flowname);
	var newValue2 = newValue1.replace(/Flow_Type/gim, folder);
    fs.writeFileSync(__dirname+'/job_configfiles/Library_Detection.xml',newValue2, 'utf-8');
    /*Changes for Library_Detection.xml file*/
	
	/*Changes for Rollback_test.xml file*/
    var data = fs.readFileSync(__dirname+'/job_templates/Rollback_test.xml', 'utf-8');
	var newValue = data.replace(/Remote_SVN_URL/gim, Remote_SVN_URL);
    var newValue1 = newValue.replace(/TCPIPServer_Command/gim, TCPIPServer_Command);
    var newValue2 = newValue1.replace(/Flow_Name/gim, flowname);
	var newValue3 = newValue2.replace(/Flow_Type/gim, folder);
    fs.writeFileSync(__dirname+'/job_configfiles/Rollback_Decomission.xml',newValue3, 'utf-8');
    /*Changes for Rollback_test.xml file*/
	
	
	 if (fs.existsSync(__dirname+'/job_configfiles/'+flowname+'_Build.xml')){
       res.redirect('/createjob');      
    }
	 
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
																		dir1 = __dirname+"/job_configfiles";
					
					fs.readdir(dir1, function(err, filenames) {
						if (err) {
							console.log(err);
						}
						
						filenames.forEach(function(filename) {
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
						});
						
					});
											});
											}
											else
											{
												dir1 = __dirname+"/job_configfiles";
					
					fs.readdir(dir1, function(err, filenames) {
						if (err) {
							console.log(err);
						}
						
						filenames.forEach(function(filename) {
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
                                                       dir1 = __dirname+"/job_configfiles";
    
    fs.readdir(dir1, function(err, filenames) {
        if (err) {
            console.log(err);
        }
        
        filenames.forEach(function(filename) {
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
        });
        
    });
                            });
							}
							else
							{
								dir1 = __dirname+"/job_configfiles";
    
    fs.readdir(dir1, function(err, filenames) {
        if (err) {
            console.log(err);
        }
        
        filenames.forEach(function(filename) {
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
        });
        
    });
							}
							})
                            
                            });
                            //});		
    }
    


});
console.log("flow created");
 MongoClient.connect(config.mongodburl, function(err, db) {
				 if(db){
							var collection = db.collection('flows');
							
							if(collection){
								var data = {
												"interface_name":interface_name,
												"flowname":flowname
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
								var data = {
												"interface_name":interface_name,
												"flowname":flowname
											}
											console.log("Inserting the data -------- "+JSON.stringify(data));
											collection.insert(data);
						}
							
						}
				else{console.log("error is connecting to db");}
		});	
});
res.send("created");     
}) ; 

app.get("/createBuildFolder",function(req,res){
    console.log("In Build folder creation");
  var  flowname = req.query.flowname;
  var  type = req.query.type;
  var  Remote_SVN_URL = req.query.Remote_SVN_URL;
  var s_flow = flowname.split("_");
  var Split_Flow = s_flow[0]+'.'+s_flow[1];
//  var  TCPIPServer_Command = req.query.TCPIPServer_Command;
  
   svnUltimate.commands.checkout( Remote_SVN_URL, 'C:\\Ruby23\\files\\svn_repo', function( err ) {
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
    var newValue = data.replace(/Flow_Name/gim, flowname);
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
                        fs1.removeSync('C:\\Ruby23\\files\\svn_repo');
						fs1.removeSync('C:\\Ruby23\\files\\Build');
						res.send("created");
						
                    });
                });
            });
        });
	
	
}) ;
				
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
    
     MongoClient.connect(config.mongodburl, function(err, db) {
        if(db){
            var collection = db.collection('interfaces');
            if(collection){
                var data = {
                    "interface_name":interface_name
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
	io.on('connection',function(client1){
		client = client1;
	});
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
console.log(req.query.username);
         build_env = req.query.build_env;
         console.log(build_env); 
	     iibhost=req.query.iibhost;

		 IIBNode=req.query.IIBNode;

		 executionGroup=req.query.executionGroup;
		
		BrokerName=req.query.BrokerName;
      
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
							  
							   jenkins.job.get(folder+"/"+flowName+"/Create_Config_Services",({ depth: 2,pretty: 'true'}), function(err, data) {
							  if (err) throw err;
							 console.log('job', data.actions[0].parameterDefinitions[5].defaultParameterValue.value);
							 Config_Service=data.actions[0].parameterDefinitions[5].defaultParameterValue.value;
							 
				svnUltimate.util.getRevision( svnrepo, function( err, revision ) {
				       console.log( "Head revision=" + revision );
					   artifactory_number=revision;
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
														svnrepo:svnrepo
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
console.log("entered console with nextbuild_no ==> "+nextbuild_no);
   var uri=executed_job;
   console.log("uri : "+uri);
   if(client){
   console.log("Connected succesfully to the socket ..."+client);
  
 
     var log = jenkins.build.logStream(uri, nextbuild_no);
      console.log("log data  ..."+log.toString());
    

 
 log.on('data', function(text) {
    console.log("BEFOR TEXT ****************** "+text)  
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
 console.log('end');
// socket.emit('end', end);
 jenkins.job.get(uri,({ depth: 2,pretty: 'true'}), function(err, data) {
							  if (err) throw err;
							 jobdata=data;
							  console.log('job status'+ data.builds[0].result+" build number  "+data.builds[0].number);
							// res.send(data);
							if(data.builds[0].result=="SUCCESS" || data.builds[0].result=="UNSTABLE")
							//	if(data.builds[0].result=="FAILURE" || data.builds[0].result=="UNSTABLE")
							{
								current_job=uri;
								console.log(current_job);
								if(current_job==folder+"/"+flowName+"/Deploy" || current_job==folder+"/"+flowName+"/"+"Rollback_Decomission")
								{
									res.send("JObs Executed")
								}
								else{
									res.redirect('/build1');
								}
								
								
							}
							else
                            {
                                console.log(uri+"FAILED");
                                res.send(uri+"_job_FAILED");
                            }
}); 

});    
}
});

app.get('/build1', function (req, res) {
	
	if(current_job==folder+"/"+flowName+"/"+flowName+"_Build")
	{
		next_job=folder+"/"+flowName+"/Library_Detection";
		params={
			username :CentralizedParameters[0].username,
			password : CentralizedParameters[0].password,
			iibhost  : EnvironmentalParameters[0].iibhost,
			mqsiprofile :  EnvironmentalParameters[0].mqsiprofile,
			IIBNode: EnvironmentalParameters[0].IIBNode,
			executionGroup:EnvironmentalParameters[0].executionGroup,
			svnhost:CentralizedParameters[0].svnhost,
			svnrepo:svnrepo

		       }
			   
	}
	if(current_job==folder+"/"+flowName+"/Library_Detection")
	{
		next_job=folder+"/"+flowName+"/Create_Config_Services";
		params={
			build_env:build_env,
			username:CentralizedParameters[0].username,
			password :CentralizedParameters[0].password,
			iibhost : EnvironmentalParameters[0].iibhost,
			deployment_path:EnvironmentalParameters[0].deployment_path,
			Config_Service:Config_Service,
			mqsiprofile :EnvironmentalParameters[0].mqsiprofile,
			IIBNode:  EnvironmentalParameters[0].IIBNode,
			executionGroup :EnvironmentalParameters[0].executionGroup
		}
		                 
	}
	if(current_job==folder+"/"+flowName+"/Create_Config_Services")
	{
		next_job=folder+"/"+flowName+"/Create_Queues";
		params={
			build_env :build_env,
			username:CentralizedParameters[0].username,
			password:CentralizedParameters[0].password,
			BrokerName :EnvironmentalParameters[0].BrokerName,
			deployment_path:EnvironmentalParameters[0].deployment_path,
			iibhost: EnvironmentalParameters[0].iibhost

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
			iibhost: EnvironmentalParameters[0].iibhost,
			IIBNode:  EnvironmentalParameters[0].IIBNode,
			executionGroup :EnvironmentalParameters[0].executionGroup,
			deployment_path:EnvironmentalParameters[0].deployment_path,
			ArtifactoryUserName : CentralizedParameters[0].ArtifactoryUserName,
            ArtifactoryPassword : CentralizedParameters[0].ArtifactoryPassword
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
					"SVNPassword":SVNPassword					
                }
				collection.remove();
                console.log("Inserting the data -------- "+JSON.stringify(data));
                collection.insert(data);
            }    
        }
        else{
            console.log("error is connecting to db");
        }
    });    
    res.send("CentralizedParameters_saved");
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
                collection.insert(data);
            }    
        }
        else{
            console.log("error is connecting to db");
        }
    });    
    res.send("EnvironmentalParameters_saved");
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
    var build_env = req.query.build_env;
    var iibhost = req.query.iibhost;
    var IIBNode = req.query.IIBNode;
    var executionGroup = req.query.executionGroup;
    var BrokerName = req.query.BrokerName;
    var target = req.query.target;
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
                    jenkins.job.get(folder+"/"+flowName+"/Create_Config_Services",({ depth: 2,pretty: 'true'}), function(err, data) {
                              if (err) throw err;
                             console.log('job', data.actions[0].parameterDefinitions[5].defaultParameterValue.value);
                    Config_Service=data.actions[0].parameterDefinitions[5].defaultParameterValue.value;
                    
                    jenkins.job.get(folder+"/"+flowName+"/"+flowName+"_Build",({ depth: 2,pretty: 'true'}), function(err, data) {
                              if (err) throw err;
                             console.log('job', data.actions[0].parameterDefinitions[9].defaultParameterValue.value);
                             svnrepo=data.actions[0].parameterDefinitions[11].defaultParameterValue.value; 
                             
                svnUltimate.util.getRevision( svnrepo, function( err, revision ) {
                       console.log( "Head revision=" + revision );
                       artifactory_number=revision;
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
            target:target} }, function(err) {
                                                if (err) console.log(err);
                                                console.log("rollback job triggered");
                                                setTimeout(function() {
												 executed_job=folder+"/"+flowName+"/"+"Rollback_Decomission";
												 res.redirect("/console");
											}, 10000);
                                            }); 
					   });											
                    })
                    
                    })
                    
                    })
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
