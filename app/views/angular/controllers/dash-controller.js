

myApp.controller("DashController",["$http",'$location','cartService','$rootScope','SweetAlert',
	function($http,$location,cartService,$rootScope,SweetAlert){
	
	var main = this ; 

	this.userProducts = [];
	this.productAvail;
	this.recentProduct;
	this.userName;

	$rootScope.showHome =false; 
	$rootScope.showCart =true; 
	$rootScope.showLogout =true;

	this.showForm = false;

	this.getDashboard = function(){
		

		cartService.dashboardApi()
		.then(function successCallback(response){
			console.log(response);

			var dashData = response.data.data;
			
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

				cartService.userFirstName = dashData.firstName ;
				 main.userName = cartService.userFirstName;
				 // console.log(main.userName);

				if(dashData.dashProduct != null){
					main.productAvail = true;
					console.log("products available");

				  main.recentProduct = dashData.dashProduct;
				  console.log(main.recentProduct);
					
				}

				else {

					console.log("No products");
					main.productAvail = false;
				}
			}

			}, function errorCallback(reason){
				console.log(reason);
				alert("Error in Post");
		})
	};

	this.getDashboard();


	this.addToCart = function(){
		
		var toCart = {
			alertMessage : true,
			itemCount : null // RANDOM VALUE TO CHECK REFERENCE OF THE VIEW
		};

		cartService.postCartApi(main.recentProduct._id,toCart)
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
	}
		
}])