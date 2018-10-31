var express = require('express');
var app = express();
var mongoose = require('mongoose');
var logger = require('morgan');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');


app.use(logger('dev'));
app.use(bodyParser.json({limit:'10mb',extended:true}));
app.use(bodyParser.urlencoded({limit:'10mb',extended:true}));

app.use(cookieParser());

app.use(session({
  name :'myCustomCookie',
  secret: 'mySecret', // encryption key 
  resave: true,
  httpOnly : true,  // to prevent cookie-forgery
  saveUninitialized: true,
  cookie: { secure: false }  // make true incase of SSL certificate
}));


//built-in Node-module to get path.No installation required
var path = require("path");

// accessing public directory
app.use(express.static(__dirname +'/app/views'));

//Establishing database connection
// USING MLAB'S DATABASE ACCOUNT -For HEROKU Purpose
// var dbPath = "mongodb://rahul09:rahul@ds133296.mlab.com:33296/shopcart";
var dbPath = "mongodb://localhost:27017/test-store"
// For EDWISOR assignment - purpose > uncomment this line
// var dbPath = "mongodb://localhost/shopCart";
db = mongoose.connect(dbPath);

mongoose.connection.once('open',function(){
	console.log(dbPath);
	console.log("Success! Database connection open");
});


// fs module, by default module for file management in nodejs
var fs = require('fs');

// include all our model files
fs.readdirSync('./app/models').forEach(function(file){
	// check if the file is js or not
	if(file.indexOf('.js'))
		// if it is js then include the file from that folder into our express app using require
		require('./app/models/'+file);

});// end for each

// include controllers
fs.readdirSync('./app/controllers').forEach(function(file){
	if(file.indexOf('.js')){
		// include a file as a route variable
		var route = require('./app/controllers/'+file);
		//call controller function of each file and pass your app instance to it
		route.controllerFunction(app)

	}

});//end for each


app.get('*',function(request,response,next){
		
	response.status = 404 ;

	//similar to next(err) i.e calling error

	next("Error in path");
});


//Error handling Middleware

app.use(function(err,req,res,next){
	console.log("Custom Error handler used");
	if(res.status == 404){
		res.send("Invalid Path. Kindly make sure your URL is right");
	}
	else{
		res.send(err);
	}
});  


// PORT DECLARATION
var port = process.env.PORT || 3000 ;


app.listen(port, function () {
  console.log('Example app listening on port 3000!');
});
