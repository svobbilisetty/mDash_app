var express = require('express');
var http = require('http');
var fs=require('fs');
var app = express();
var path = require('path');
var MongoClient = require('mongodb').MongoClient;
var body = require('body-parser');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var nodemailer = require('nodemailer');
var rmdirSync = require('rmdir-sync');
var request1 = require('request');
var dir = './Build';
var Client = require('svn-spawn');
var config = require('./public/serverHost.json');
var jenkinsapi = require('jenkins-api');
var jenkins1 = jenkinsapi.init(config.jenkinurl);
var zipFolder = require('zip-folder');
console.log(config.jenkinurl);
var jenkins = require('jenkins')({ baseUrl: config.jenkinurl});
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');
app.use(body.json());
server.listen(9003);
var fs1 = require('fs-extra'); 
var svnUltimate = require('node-svn-ultimate');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/buildtest1', function (req, res) {
	
   console.log("entered buildtest1"); 
   
       		jenkins.job.build({ name: "christus/demo", parameters: {env : "Dev"} }, function(err) {
						if (err) console.log(err);
						console.log("build triggered");
						setTimeout(function() {
                   //console.log('Blah blah blah blah extra-blah');
				   res.redirect("/console1");
                 }, 10000);
						
					});           
					}); 
					
app.get('/console1', function (req, res) {    
//var nextbuild_no = req.query.nextbuild_no;
console.log("entered console1");
 //io.on('connection', function (socket) {
 //  console.log("Connected succesfully to the socket ...");
  
 
     var log = jenkins.build.logStream("christus/demo", 153);
      console.log("Connected succesfully to the socket ..."+log.toString());
    

 
 log.on('data', function(text) {
    console.log("BEFOR TEXT ****************** "+text)  
    var news1 ='';
     news1 = text;
    // Send news on the socket
  //socket.emit('news', news);

  
});

log.on('error', function(err) {
 console.log('error', err);
  counter="1";  
 var news1 ='';
  news1 = err;
      // Send news on the socket
 //  socket.emit('news', news);

});

log.on('end', function(end) {
 console.log('end');
//socket.emit('end', end);
 //socket.removeAllListeners("news");
 jenkins.job.get("christus/demo",({ depth: 2,pretty: 'true'}), function(err, data) {
							  if (err) throw err;
							 jobdata=data;
							  console.log('job status'+ data.builds[0].result+" build number  "+data.builds[0].number);
							// res.send(data);
							if(data.builds[0].result=="SUCCESS")
							{
								jenkins.job.build({ name: "democreatejob", parameters: {env : "Dev"} }, function(err) {
										if (err) console.log(err);
										console.log("build triggered another job");
										
									});
							}
}); 

});
    
//});
});

app.get('/revisionno', function (req, res) {
	
   console.log("entered revisionno"); 
   
						svnUltimate.util.getRevision( 'file:///E:/SVN_repository/branches/mDash/Transform', function( err, revision ) {
				console.log( "Head revision=" + revision );
			} );   


require('svn-info')('file:///E:/SVN_repository/branches/mDash/Sender/', 'HEAD', function(err, info) {
  if(err) {
    throw err;
  }
  console.log(info);
});			

})