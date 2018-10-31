
var mongoose = require('mongoose');
var express = require('express');

var userModel = mongoose.model('User');

var productModel = mongoose.model('Product');
var productRouter  = express.Router();
var responseGenerator = require("./../../libs/responseGenerator");
var auth = require("./../../middlewares/authorization");
var async = require("async");


module.exports.controllerFunction = function(app) {

		// OBJECT fOR HELPER VARIABLES
		
		var forInfo={};

	
	//-----API TO GET ALL PRODUCTS ----------

	productRouter.get('/all',auth.checkLogin,function(req,res){
		
		productModel.find({}).populate("owner", "firstName").exec(function(err,product){
			if(err){
				var myResponse = responseGenerator.generate(true,err,500,null);
                    res.send(myResponse);
			}

			else{
				console.log(product);

				var myResponse = responseGenerator.generate(
					false,"Offre ajoutée",200,product);

				res.send(myResponse);
  			}
  		});

	});


			// -------API TO CREATE A PRODUCT -------

    productRouter.post('/create',auth.checkLogin, function(req,res){
    	console.log(req.file);
    	userModel.findOne({"email":req.session.user.email},function(err,user){
  			console.log('this is me' + req.session.user.email);
  			req.body.phone =  req.session.user.phone;
  			req.body.email =  req.session.user.email;
    		if(err){
    			 var myResponse = responseGenerator.generate(true,err,500,null);
                    res.send(myResponse);
    		}
    		else{
    			
     			if(req.body.productName!=undefined && req.body.category!=undefined && req.body.color!=undefined &&
     				  req.body.addInfo!=undefined && req.body.availIn!=undefined){     
     				console.log('this is email ' + req.body.phone);
	             	var newProduct = new productModel({
	             		
	             		owner				: user,
	             		phone				: req.body.phone,
	             		email				: req.body.email,
			            productName  		: req.body.productName,
						category			: req.body.category,
						price				: req.body.price,
						color				: req.body.color,
						additionalInfo		: req.body.addInfo,
						availableIn	  		: req.body.availIn
	            	});

		    
	            	newProduct.save(function(err,result){       		

			           	if(err){
			           		var myResponse = responseGenerator.generate(true,err,500,null);
				                res.send(myResponse);
		             	}

		             	else{
			             		
		             	//POPULATING FIRSTNAME OF USER  INSIDE OWNER FIELD 
		          
		           			productModel.findOne({"owner":user._id},
		           			{"owner":1,"_id":0}).populate('owner', 'firstName')
		           			.exec(function(err,popProduct){
		           					
		           				if(err){
	            						var myResponse = responseGenerator.generate(
	            							true,err,500,null);

				                   		res.send(myResponse); 
				                 }

		            			else{
		            				
		            				newProduct.owner = popProduct.owner;
				           			
				           			var myResponse = responseGenerator.generate(
				           				false,"Offre ajoutée",200,newProduct);

					                 res.send(myResponse);
					             }
					        }); //Findone ends
	            			
	            		}	            			
	            			
	            	});	//Save ends  	
						
				}

		        else{
		             var myResponse = responseGenerator.generate(
		             	true,"Compléter les champs svp",500,null);

		              res.send(myResponse);
		        }
		    }
		});


    });//end post create


    // -------GET PARTICULAR PRODUCT ---------

   	productRouter.get('/:id',auth.checkLogin,function(req,res){
		console.log("get all working");

		// IDENTIFYING PRODUCT WITH REQ.PARAMS AND POPULATING IT WITH 
		// ITS OWNER'S FIRSTNAME FIELD

		productModel.findOne({"_id":req.params.id})
		.populate({path:'owner',select:'firstName -_id'})
		.exec(function(err,product){
			if(err){
				var myResponse = responseGenerator.generate(true,err,500,null);
                    res.send(myResponse);
			}

			else{

				var myResponse = responseGenerator.generate(
					false,"Offre trouvée",200,product);

				res.send(myResponse);
  			}
  		});

	});

   // ------API TO DELETE A PARTICULAR PRODUCT --------
   	productRouter.post('/delete/:id',auth.checkLogin,function(req,res){

	   	//EXPERIMENTAL USAGE OF ASYNC -BELOW 

	   	var getProduct = function(callback){

			productModel.findOne({"_id":req.params.id})
			.populate({path:'owner',select:'firstName -_id'})
			.exec(function(err,product){

				if(err){
					var myResponse = responseGenerator.generate(true,err,500,null);
		                   callback(myResponse);			
				}
				else{
					// console.log("series-1");
					callback(null,product);
				}
			})
		};

		var getUser = function(arg1,callback){

			userModel.findOne({"_id":req.session.user._id},function(err,user){

				if(err){
					var myResponse = responseGenerator.generate(true,err,500,null);
		                    callback(myResponse);			
				}
				else{
					// console.log("series-2");
					callback(null,arg1,user);
				}
			})
		};

		var checkAuthorityAndDelete = function(arg1,arg2,callback){

			// IF CURRENT PRODUCT'S OWNER IS CURRENT USER, THEN DELETE

			if(arg1.owner.firstName == arg2.firstName){
				console.log("Checkauthority..you are allowed to delete");

				productModel.remove({"_id":req.params.id},function(err,product){
							
					if(err){
							var myResponse = responseGenerator.generate(true,err,500,null);
		             		callback(myResponse);
					}

					else{

						forInfo.authCheck = true;
						var myResponse = responseGenerator.generate(
							false,"Suppression réussie",200,forInfo.authCheck);

						callback(null,myResponse);
		  			}
		  		});


			}
		 	else{
		 			// console.log("Checkauthority..not allowed to delete");

		  		forInfo.authCheck = false;

		  		var myResponse = responseGenerator.generate(
		  			false,"Vous ne pouvez pas supprimer une offre qui n'est pas la tienne",200,
		  			forInfo.authCheck);

					callback(null,myResponse);
		  	}
		};


		// ASYNC Waterfall TO RUN ONE DB OPERATION AFTER ANOTHER 
		// AND ALSO FOR CODE READABILITY
		async.waterfall([
			getProduct,
			getUser,
			checkAuthorityAndDelete
			],function(err,results){
				if(err){
					res.send(err)
				}
				else{

					if(forInfo.authCheck == true){
						console.log("Inside waterfall will delete from cart")
						 
						 // IF USER IS AUTHORIZED, DELETE FROM CART OF ALL USERS
						userModel.update({},
							{$pull:{"cart":{"productId":req.params.id}}},
							{multi:true},function(err,iter){
								if(err){
									res.send(err);
								}
								else{
									res.send(results);
								}
						})
					}

					else{

						res.send(results);
					}

				}		
		 	}) // ASYNC WATERFALL ENDS
		

	});


   	// ------API TO EDIT A PRODUCT ------------

	productRouter.put('/edit/:id',auth.checkLogin,function(req,res){
			// console.log("get all working");

			var update = req.body ;

		var getProduct = function(callback){

			productModel.findOne({"_id":req.params.id})
			.populate({path:'owner',select:'firstName -_id'})
			.exec(function(err,product){

				if(err){
					var myResponse = responseGenerator.generate(true,err,500,null);
		                   callback(myResponse);			
				}
				else{
					// console.log("series-1");
					callback(null,product);
				}
			})
		};

		var getUser = function(arg1,callback){

			userModel.findOne({"_id":req.session.user._id},function(err,user){

				if(err){
					var myResponse = responseGenerator.generate(true,err,500,null);
		                    callback(myResponse);			
				}
				else{
					// console.log("series-2");
					callback(null,arg1,user);
				}
			})
		};

		var checkAuthorityAndEdit = function(arg1,arg2,callback){
			

			// IF PRODUCT'S OWNER IS CURRENT USER THEN DELETE
			if(arg1.owner.firstName == arg2.firstName){
				console.log("Checkauthority..you are allowed to delete");

				productModel.findByIdAndUpdate({"_id":req.params.id},update,{new:true},
					function(err,product){
							
					if(err){
							var myResponse = responseGenerator.generate(true,err,500,null);
		             		callback(myResponse);
					}

					else{

						//HELPER VALUE FOR EDIT AUTHORITY
						forInfo.authEditCheck = true;

						var myResponse = responseGenerator.generate(
							false,"offre modifiée",200,forInfo.authEditCheck);

						callback(null,myResponse);
		  			}
		  		});


			}
		 	else{
		 			// console.log("Checkauthority..not allowed to delete");

	  			forInfo.authEditCheck = false;

	  			var myResponse = responseGenerator.generate(
	  				false,"Vous ne pouvez pas modifier une offre qui n'est pas la tienne",200,
	  				forInfo.authEditCheck);

				callback(null,myResponse);
		  	}
		};

			//*GET PRODUCT, GET USER AND CHECK CURRENT USER'S AUTHORITY* OPERATIONS
			//  USING WATERFALL
			async.waterfall([
			getProduct,
			getUser,
			checkAuthorityAndEdit
			],function(err,results){
				if(err){
					res.send(err)
				}
				else{


					if(forInfo.authEditCheck == true){
						
						// console.log("Inside waterfall edit from cart")
					
						//STORING UPDATED-VALUES IN AN OBJECT TO BE USED WITH $SET(Mongoose)			
						var updateObj = {$set: {}};
						for(var param in req.body) {
  							updateObj.$set['cart.$.'+param] = req.body[param];
 						}
						
						//UPDATING CART OF ALL-USERS WITH THIS EDITED-PRODUCT
						 userModel.update({"cart.productId":req.params.id}, 
						 	updateObj,{multi:true},function(err,iter){
								if(err){
									res.send(err);
								}
								else{

								// UPDATE OPERATOR - RETURNS THE NUMBER OF ITEMS MODIFIED
									res.send(results);
								}
						})					 
						 
					}

					else{
						//IF NOT AUTHORIZED, SEND ALERT MESSAGE
						res.send(results);
					}

				}		
		 	}) // ASYNC WATERFALL ENDS

	});

    // this should be the last line
    // now making it global to app using a middleware
    // think of this as naming your api 

    app.use('/product', productRouter);
 
} //end contoller code
