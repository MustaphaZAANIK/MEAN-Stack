

var mongoose = require('mongoose');
var express = require('express');
 
var userModel = mongoose.model('User');
var productModel = mongoose.model('Product');
var cartRouter  = express.Router();
var responseGenerator = require("./../../libs/responseGenerator");

var crypto = require("./../../libs/crypto");
var key = "Crypto-Key";
var auth = require("./../../middlewares/authorization");
var async = require("async");



module.exports.controllerFunction = function(app){
	
	//helper variables	
	var ourInfo = {};

	//---------- API TO GET ALL CART PRODUCTS ---------------

	cartRouter.get('/all',auth.checkLogin,function(req,res){

		//FIND USER BY ID AND GET CART FIELD AS RETURN
		userModel.find({"_id":req.session.user._id},
			{cart:1,firstName:1},function(err,items){

			if(err){
				var myResponse = responseGenerator.generate(true,err,500,null);
                res.send(myResponse);
			}

			else if(items[0].cart.length === 0 || items[0].cart == null){

				 ourInfo.inCart = false;
				var myResponse = responseGenerator.generate(false,"Pas d'offres pour le moment",200,ourInfo);
                res.send(myResponse);
			}

			else{
				
				 console.log("attribute is " +items[0].cart);
				var myResponse = responseGenerator.generate(false,"Succès",200,items);
                res.send(myResponse);
			}

		})
	});

	//------API TO ADD TO CART--------------

	cartRouter.post('/add/:id',auth.checkLogin,function(req,res){

			// HELPER VARIABLES TO DISTINGUISH DATA SENT FROM DIFFERENT VIEWS
			var itemCount = req.body.itemCount;
			var alertMessage = req.body.alertMessage;

		
		userModel.find({"_id":req.session.user._id},function(err,user){
				if(err){
					console.log("pas d'utilisateur trouvé");
				}
				else{

					console.log("je suis le premier utilisateur "+user);
				}

					//SKELETON OF CART SCHEMA
					var cartItem = {
						 	productId : mongoose.Types.ObjectId(req.params.id),
							productName: '',
							category  :  '',
							price     : 0,
							number	: 	1
						};
					
					var newOne = user[0];

					// ARRAY.SOME() TO CHECK IF PRODUCT ALREADY PRESENT IN CART ARRAY
					var toCheckCart = user[0].cart.some(function(elem){

	           			return elem.productId.toString() === req.params.id ;

	 	        	})
					            

				// IF ITEM ALREADY EXISTS, THEN ALERT --> FOR DASHBOARD

				if(toCheckCart == true && alertMessage==true){

						var myResponse = responseGenerator.generate(
							false,"Offre déja consultée!!!",200,true);
					     res.send(myResponse);
				}

				else{

					var getProduct = function(callback){

						productModel.find({"_id":req.params.id},function(err,item){
							if(err){
								var myResponse = responseGenerator.generate(true,err,500,null);
				                callback(myResponse);	
							}
							else{
								 
								callback(null,item[0]);
							}
						})
					};

					var addToCart = function(arg1,callback){
						
						// IDENTIFYING VALUE FROM FRONTEND --> DASHBOARD PAGE
						
						if(itemCount == null){
							console.log("ajouter des demandes");

							var cartItem = {
							 	productId : mongoose.Types.ObjectId(req.params.id),
								productName: arg1.productName,
								category  :  arg1.category,
								price     : arg1.price,
								number	: 	1
							};
							newOne.cart.push(cartItem);
						}

						else{

							// IDENTIFYING VALUE FROM FRONTEND --> CART-PAGE AND INCREASING IT
							itemCount ++ ;

							for(var i=0;i<newOne.cart.length;i++){
	            			
		            			if(newOne.cart[i].productId.toString()==req.params.id){

		              			  newOne.cart[i].category = arg1.category;
		              			  newOne.cart[i].price = arg1.price;
		              			  newOne.cart[i].productName = arg1.productName;
		              			  newOne.cart[i].number = itemCount ;
		            			}
        					}

						}

						
						userModel.findOneAndUpdate({"_id":req.session.user._id},
							newOne,
							{new:true},function(err,finalUser){

							if(err){
								var myResponse = responseGenerator.generate(true,err,500,null);
			                	callback(myResponse);
							}
							else{
								 console.log("utilisateur modifié" + finalUser);
								callback(null,finalUser);
							}
						})
						
					};

					//GET PRODUCT AND ADD TO CART OPERATIONS USING ASYNC.WATERFALL
					async.waterfall([
						getProduct,
						addToCart],function(err,result){

							if(err){
									var myResponse = responseGenerator.generate(true,err,500,null);
					                res.send(myResponse);
			            	}
			           		 
			           		else{
									// console.log("waterfall"+result);
									 req.session.user.addedToCart = true;
									req.session.user.cart = result.cart;

									delete req.session.user.password;
								
								var myResponse = responseGenerator.generate(
									false,"Offre ajoutée !!!",200,req.session.user);
					                res.send(myResponse);
			            	}
					})
				}
			})

		});


	// -------API TO DELETE FROM CART-----------

	cartRouter.post('/delete/:id',auth.checkLogin,function(req,res){

		if(req.body.toReduce == true){

				var findUser = function(callback){
					userModel.findOne({"_id":req.session.user._id},function(err,singleUser){
						if(err){
							var myResponse = responseGenerator.generate(true,err,500,null);
			               	callback(myResponse);
						}

						else{
							console.log("utilisateur est "+singleUser);
							callback(null,singleUser);
							
						}
					})
				};

				var updateUser = function(arg1,callback){

						for(var i=0;i<arg1.cart.length;i++){
							
							//IF ITEM EXISTS IN CART, DECREASE THE COUNT

		            		if(arg1.cart[i].productId==req.params.id){
		            				
		            			arg1.cart[i].number--;
		        			
		        			}
		        		}

		        		userModel.findOneAndUpdate({"_id":req.session.user._id},
		        			arg1,
		        			{new:true},function(err,updatedUser){
							
							if(err){
								var myResponse = responseGenerator.generate(true,err,500,null);
				               	callback(myResponse);
							}

							else{
								console.log(updatedUser);
								callback(null,updatedUser);
								
							}
						})
				};

				async.waterfall([
						findUser,
						updateUser],function(err,result){

							if(err){
								var myResponse = responseGenerator.generate(true,err,500,null);
				                res.send(myResponse);
			            	}
			           		 
			           		else{
									// console.log("delete waterfall "+result);
									req.session.user.cart = result.cart ;
									req.session.user.productDel = false;

									delete req.session.user.password;

									var myResponse = responseGenerator.generate(
										false,"réduit",200,req.session.user);
						               
						            res.send(myResponse);
			            	}
				})

		}

		else{
				//FIND USER AND PULL/REMOVE PRODUCT FROM CART 
				userModel.update({"_id":req.session.user._id},
					{$pull:{cart:{"productId":req.params.id}}},function(err,user){

					if(err){
							var myResponse = responseGenerator.generate(true,err,500,null);
			               	res.send(myResponse);
					}
					else{
							ourInfo.productDel = true;
							
							var myResponse = responseGenerator.generate(
								false,"offre supprimée!",200,ourInfo);
							res.send(myResponse);
					}
				})
		} 	
			
	});

	 app.use('/cart', cartRouter);
}