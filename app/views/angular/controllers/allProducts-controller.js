myApp.controller("AllProdController",["$http",'$location','cartService','$rootScope','SweetAlert',
	function($http,$location,cartService,$rootScope,SweetAlert){
	
	var main = this;
	
	this.emptyProducts = false;
	$rootScope.showHome =true;
	$rootScope.showCart =true;
	$rootScope.showLogout =true;
	
	this.allProducts = [];

	this.getAllProducts = function(){
	
		cartService.getAllApi()
		.then(function successCallback(response){
			console.log(response);

			if(response.data.status ==200 && response.data.userLog == false){
				
				SweetAlert.swal("Info!",""+response.data.message+"", "info");

				$location.path('/');
			}	

			 else if(response.data.status == 200){

			 	//DISPLAYING LATEST PRODUCTS USING ARRAY'S REVERSE METHOD
					main.allProducts = response.data.data.reverse();
					if(main.allProducts.length == 0){
						main.emptyProducts = true;
					}
				
			}

			else{

				console.log("I worked");
				SweetAlert.swal({

				   title: ""+response.data.message+"",
				   type: "info",
				   showCancelButton: false,
				   confirmButtonColor: "##5cb85c",confirmButtonText: "Got it!",
				   closeOnConfirm: true}, 
					function(){ 
				   		$location.path('/');
				   		
					});
								
			}


			}, function errorCallback(reason){
				console.log(reason);
				alert("Error in Login-Post");
			})
	};

	this.getAllProducts();
}])
