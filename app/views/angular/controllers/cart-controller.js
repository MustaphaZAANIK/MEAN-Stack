

myApp.controller("cartController",["$http",'$location','cartService','$rootScope','SweetAlert',
	function($http,$location,cartService,$rootScope,SweetAlert){
	
	var main = this ;

	this.firstName;
	this.cartTotal = 0;

	this.cartItems=[];
	this.showCartIcon = true;

	$rootScope.showHome =true;
	$rootScope.showCart =false; 
	$rootScope.showLogout =true;

	// FUNCTION TO GET ALL CART PRODUCTS
	this.getAllCart = function(){

		cartService.getCartApi()
		.then(function successCallback(response){

			//ASSIGNING THE RESPONSE FROM BACKEND TO A VARIABLE FOR CODE CLARITY
			var cartData = response.data.data;
			
			if(response.data.userLog == false){
				
				SweetAlert.swal({
					
				   title: ""+response.data.message+"",
				   type: "info",
				   showCancelButton: false,
				   confirmButtonColor: "#5cb85c",confirmButtonText: "Got it!",
				   closeOnConfirm: true}, 
					function(){ 
				   		$location.path('/');
				   		
				});
			}

			else{

				//IF NO PRODUCTS ARE IN CART, SHOW CART ICON
				if(cartData.inCart == false){
					
					main.showCartIcon = true;

				}

				else if(cartData[0].cart.length>0){

					main.showAsset = true;
					main.firstName = cartData[0].firstName;
					main.showCartIcon = false;
					cart = cartData[0].cart ;
					main.cartItems = cart;

					for(var i=0;i<main.cartItems.length;i++){
						
						main.cartTotal += ((main.cartItems[i].number)*(main.cartItems[i].price));

					}
				}

				else{

					main.cartTotal = 0;
				}
			}


		}, function errorCallback(reason){
				console.log(reason);
				alert("Error in Login-Post");
			})
	};

	this.getAllCart();

	
		// FUNCTION TO DELETE ITEM FROM CART

	this.deleteItem = function(id,index,value){
	
		//REDUCE PRODUCT-QUANTITY OR DELETE FROM CART BASED ON "VALUE"
		var toCartDelete = {
			toReduce : value
		}

		cartService.deleteCartApi(id,toCartDelete)
		.then(function successCallback(response){
			console.log(response);

			//ASSIGNING THE DATA FROM BACKEND TO A VARIABLE FOR CODE CLARITY
			var mainData = response.data.data;

			if(response.data.status ==200 && mainData.productDel == false){

				console.log(main.cartItems[index]);
				main.cartItems[index] = mainData.cart[index];
				
				main.cartTotal -= main.cartItems[index].price;
			}


			else if(response.data.status ==200 && mainData.productDel == true){
			
					SweetAlert.swal({
						
					   title: "Done!",
					   text:""+response.data.message+"",
					   type: "success",
					   showCancelButton: false,
					   confirmButtonColor: "#de463b",confirmButtonText: "Ok!",
					   closseOnConfirm: true}, 
						function(){ 
					   		

	   					main.cartTotal -= (main.cartItems[index].number * main.cartItems[index].price);

	   					//REMOVE ITEM FROM CART USING ARRAY'S SPLICE METHOD
		   					main.cartItems.splice(index,1);
		   					
		   					if(main.cartItems.length>=1){
								
								main.showCartIcon = false;
							}
	   				
	   						else{

	   							main.cartTotal = 0;
	   							main.showCartIcon = true;
	   						}
	   				});
			}

				
		}, function errorCallback(reason){
			console.log(reason);
			alert("Error in Login-Post");
		})
	};


	// FUNCTION TO INCREASE ITEM IN CART
	this.incQuantity = function(productId,index,count){
		console.log(count);

		var toCart = {
			alertMessage : false,
			itemCount : count 	//ASSIGNING SOME VALUE TO INCREMENT QUANTITY
		};
		
		cartService.postCartApi(productId,toCart)
		.then(function successCallback(response){
			 
			if(response.data.status==200 && response.data.data ==false){
				alert(response.data.message);
			}
			else if(response.data.status ==200){
				main.cartItems[index] = response.data.data.cart[index];

				main.cartTotal += main.cartItems[index].price;

			}
		
		}, function errorCallback(reason){
			console.log(reason);
			alert("Error in Post");
		})
	};
}])