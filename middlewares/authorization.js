

var mongoose = require('mongoose');
var productModel = mongoose.model('Product');
var userModel = mongoose.model('User');

var responseGenerator = require("./../libs/responseGenerator");

//	MIDDLEWARE TO CHECK IF USER IS LOGGED IN
module.exports.checkLogin = function(req,res,next){

	if(!req.session.user){

		console.log("PLease login ran");		
		res.status(200).send({"userLog":false,"message":"Please Log in"});
	}

	else{
		console.log("ELSE worked");

		next();
	}

};

//	MIDDLEWARE TO Logout *LOGGED IN USER* FROM ENTERING SIGNUP PAGE 
module.exports.isLoggedIn = function(req,res,next){
	
	if(req.session.loginStatus){

		console.log("Logged in user trying to signup");
		
		req.session.destroy(function(err){
        
        	res.status(200).send({"loggedIn":true,"message":"Your session will be lost"});

      	});
	}

	else{

		next();
	}

};

// MIDDLEWARE TO CHECK IF MAIL IS SENT, ONLY THEN GIVE ACCESS TO UPDATE PASSWORD
module.exports.isMailSent = function(req,res,next){

	if(!req.session.sentMail){
		
		res.status(200).send(
			{"mailLog":false,
			"message":"Please visit forgot password screen to make this action!"
			}
		);
	}

	else{
	
		next();
	}

};
