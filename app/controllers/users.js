
var mongoose = require('mongoose');
var express = require('express');
 
var userModel = mongoose.model('User');
var productModel = mongoose.model('Product');
var userRouter  = express.Router();
var responseGenerator = require("./../../libs/responseGenerator");

var crypto = require("./../../libs/crypto");
var key = "Crypto-Key";
var auth = require("./../../middlewares/authorization");


module.exports.controllerFunction = function(app) {

  //-----API TO LOGOUT USER -----
    userRouter.get('/logout',function(req,res){
      
      req.session.destroy(function(err){
        
        res.redirect('/');

      });

    });


    // -------API TO GET DASHBOARD ---------

     userRouter.get('/dashboard',auth.checkLogin,function(req,res){

        // GET RECENTLY ADDED PRODUCT USING SORT & LIMIT AND POPULATING OWNER'S FIELD WITH FIRSTNAME
        
        productModel.findOne({})
        .sort({'createdAt':-1})
        .limit(1)
        .populate({path:'owner',select:'firstName -_id'})
        .exec(function(err,product){

        if(err){
            var myResponse = responseGenerator.generate(true,err,500,null);
                res.send(myResponse);
            }

            else if(product && product!==null){

                req.session.user.dashProduct = product ;
                delete req.session.user.password ;

                var myResponse = responseGenerator.generate(
                  false,"Retrieved successfully",200,req.session.user);

                res.send(myResponse);
            }

            else{
              req.session.user.dashProduct = product;
              delete req.session.user.password ;

              var myResponse = responseGenerator.generate(
                false,"Retrieved successfully",200,req.session.user);

                res.send(myResponse);
            }
        })


    });

      
     // -------- API TO SIGNUP USER ---------

    userRouter.post('/signup',auth.isLoggedIn,function(req,res){

        var signupInfo = {};

      if(req.body.firstname!=undefined && req.body.lastname!=undefined && req.body.password!=undefined && 
          req.body.email!=undefined){     

        userModel.findOne({"email":req.body.email},function(err,user){
           
            if(err){
                    var myResponse = responseGenerator.generate(true,err,500,null);
                    res.send(myResponse);
            }
            else if(user && user!==null){
                
                signupInfo.alreadyPresent = true;
                 var myResponse = responseGenerator.generate(false,"Email already in use",200,signupInfo);
                 res.send(myResponse);
            }

            else{
                 
                 var newUser = new userModel({

                    username    : req.body.firstname+' '+req.body.lastname,
                    firstName   : req.body.firstname,
                    lastName    : req.body.lastname,
                    email       : req.body.email,
                    phone       : req.body.phone
                }); 

                newUser.password = crypto.encrypt(key,req.body.password);

                newUser.save(function(err,result){
                  
                  if(err){
                        var myResponse = responseGenerator.generate(true,"Check paramaters",500,null);
                        res.send(myResponse);
                    }

                    else{

                    req.session.user = newUser;
                    req.session.loginStatus = true;

                    delete req.session.user.password ;
                        
                    var myResponse = responseGenerator.generate(
                      false,"Signed up successfully",200,req.session.user);
                     res.send(myResponse);

                    }

                });
            }
        })
      }

      else{
          var myResponse = responseGenerator.generate(true,"Parameter missing",500,null);
          res.send(myResponse);
      }

    });


    // ------API TO LOGIN ----------

    userRouter.post('/login',function(req,res){
       
        if(req.body.email != undefined && req.body.password != undefined){

             var mailId = req.body.email;
            var verifyPassword = crypto.encrypt(key,req.body.password);


             userModel.findOne({"email":mailId,"password":verifyPassword},{password:0}
              ,function(err,foundUser){
                    if(err){

                        res.send(err);
                    }
                    else if(foundUser == null){ 
                            console.log("error working");
                            var myResponse = responseGenerator.generate(
                              true,"Enter valid credentials",500,null);
                            res.send(myResponse);                   
                    }

                    else{          
                         req.session.user = foundUser;
                         foundUser.loginStatus = true ;
                         req.session.loginStatus = true;
                         
                         delete req.session.user.password ;

                          var myResponse = responseGenerator.generate(
                            false,"Success",200,foundUser);
                          res.send(myResponse);                       
                    }
            });
              
        }  

        else{

            var myResponse = responseGenerator.generate(
              true,"Some paramater is missing",500,null);
            
            res.send(myResponse);
        }

    });


    // now making it global to app using a middleware
    // think of this as naming your api 

    app.use('/user', userRouter);

 
} //end contoller code
