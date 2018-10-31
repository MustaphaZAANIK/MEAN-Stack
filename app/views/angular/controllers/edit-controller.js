

myApp.controller("EditDeleteController",
	["$http",'$location','cartService','SweetAlert','$rootScope','$routeParams',
	function($http,$location,cartService,SweetAlert,$rootScope,$routeParams){
	
	var main = this ;

	
	this.product = {};
	this.productId = $routeParams.id;
	this.checkUser ;

	// SHOW/HIDE EDIT FORM
	this.showForm = false;

	// SHOW/HIDE PRODUCT DETAILS
	this.showProduct = true;

	$rootScope.showHome =true; 
	$rootScope.showCart =true; 
	$rootScope.showLogout =true;

	// FUNCTION TO GET ALL PRODUCTS
	this.getOneProduct=function(){
		
		cartService.getProdApi(main.productId)
		.then(function successCallback(response){
			console.log(response);

			var responseData = response.data.data ;
			
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

				main.product = responseData;
				main.checkUser = responseData.owner.firstName ;
				 // console.log(main.product);
				
			}

		}, function errorCallback(reason){
				console.log(reason);
				alert("Error in Post");
			})
	};

	this.getOneProduct();

	// FUNCTION THAT HAS THE LOGIC FOR DELETING A PRODUCT ALONG WITH SWEETALERTS!
	this.sweetDeleteFunction = function(){
		cartService.deleteProdApi(main.productId)
		.then(function successCallback(response){
	

			if(response.data.userLog == false){
				SweetAlert.swal("Info!",""+response.data.message+"", "info");
				$location.path('/');
			}

			else{

				if(response.data.data === true){
					console.log("delete true");
					SweetAlert.swal({
					
				   title: ""+response.data.message+"",
				   type: "success",
				   showCancelButton: false,
				   confirmButtonColor: "#5cb85c",confirmButtonText: "Got it!",
				   closeOnConfirm: true}, 
					function(){ 
				   		$location.path('/product/all');
				   		
					});
					
				}

				else{

					SweetAlert.swal("Sorry!", ""+response.data.message+"", "error");
				}
			}

		}, function errorCallback(reason){
				console.log(reason);
				alert("Error in Post");
			})
					
	};

	this.deleteProduct = function(){

		//SWEET ALERT CONTENT WITH CALLBACK FUNCTION AS ONE OF THE ARGUMENT
		SweetAlert.swal({
		   title: "Are you sure?",
		   text: "You will not be able to recover the product!",
		   type: "warning",
		   showCancelButton: true,
		   confirmButtonColor: "#DD6B55",confirmButtonText: "Yes, delete it!",
		   cancelButtonText: "No, Don't delete!",
		   closeOnConfirm: false,
		   closeOnCancel: false }, 
			function(isConfirm){ 
		   		if (isConfirm) {
		   			
		   			//CALLING THE DELETE LOGIC FUNCTION
		   			main.sweetDeleteFunction();
				}
		     
		   		else{
		      		SweetAlert.swal("Phew!","The Product is safe :)", "info");	
		   		}
		});
	
	};

	// FUNCTION TO SHOW AND HIDE FORM
	this.showHide = function(){

		if(main.checkUser == cartService.userFirstName){

			main.showForm = true;
			main.showProduct = false;
		}

		else{

			SweetAlert.swal({
					
				   title: "Sorry",
				   text: "Only Product's Owner has been granted this action",
				   type: "info",
				   showCancelButton: false,
				   confirmButtonColor: "#de463b",confirmButtonText: "I understand!",
				   closeOnConfirm: true});

		}
	};
	
	//FUNCTION TO EDIT A PRODUCT
	this.editProduct = function(){

			var toEditData = {

				productName  		: main.product.productName,
				category			: main.product.category,
				price				: main.product.price,
				color				: main.product.color,
				additionalInfo		: main.product.additionalInfo,
				availableIn	  		: main.product.availableIn
			}

			cartService.editProdApi(main.productId,toEditData)
			.then(function successCallback(response){
				console.log(response);

				if(response.data.userLog == false){
					
					SweetAlert.swal({
					
					   title: ""+response.data.message+"",
					   type: "info",
					   showCancelButton: false,
					   confirmButtonColor: "#5cb85c",confirmButtonText: "Ok!",
					   closeOnConfirm: true}, 
						function(){ 
					   		$location.path('/');
				   		
					});
				}

				else{

					main.product = response.data.data;
					main.showForm = false;
					main.showProduct = true;
					$location.path('/product/all');
					 
				}

			}, function errorCallback(reason){
					console.log(reason);
					alert("Error in Post");
				})
	};

	this.addToCart = function(){
			
			var toCart = {
				alertMessage : true,
				itemCount : null // RANDOM VALUE TO CHECK REFERENCE OF THE VIEW IN BACKEND
			};
	
			cartService.postCartApi(main.productId,toCart)
			.then(function successCallback(response){
				 console.log(response);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
				 
				 //IF PRODUCT ALREADY EXISTS

				if(response.data.status==200 && response.data.data==true){

					SweetAlert.swal({
					
				   title: "Hey!",
				   text: ""+response.data.message+"",
				   type: "info",
				   showCancelButton: false,
				   confirmButtonColor: "#5cb85c",confirmButtonText: "Ok!",
				   closeOnConfirm: true});

				}
				
				//IF PRODUCT IS ADDED TO CART 
				else if(response.data.status==200 && response.data.data.addedToCart==true){

					SweetAlert.swal({				
					   	title: "Success",
					   	text: ""+response.data.message+"",
					   	type: "success",
					   	showCancelButton: false,
					   	confirmButtonColor: "#5cb85c",confirmButtonText: "Ok!",
					   	closeOnConfirm: true}, 
						function(){ 
					   		$location.path('/cart/all');
				   		
					});

				} 
			
			}, function errorCallback(reason){
				console.log(reason);
				alert("Error in Post");
			})
	};
	
}])