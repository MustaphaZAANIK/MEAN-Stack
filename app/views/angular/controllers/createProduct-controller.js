myApp
.controller("CreateProdController",["$http",'$location','cartService','$timeout','$rootScope','SweetAlert',
	function($http,$location,cartService,$timeout,$rootScope,SweetAlert){
	

	var main = this;

	this.alerts = false;
	this.alertText = '';
	
	this.productName;
	this.category;
	this.price;
	this.addInfo;
	this.availIn;

	$rootScope.showHome =true; 
	$rootScope.showCart =true; 
	$rootScope.showLogout =true;

	this.submitCreate = function(){
			
		var createdData = {

				productName  		: main.productName,
				category			: main.category,
				price				: main.price,
				color				: main.color,
				addInfo				: main.addInfo,
				availIn	  			: main.availIn
		};

		cartService.postProdApi(createdData)
		.then(function successCallback(response){

			if(response.data.status == 200){

				//ALERT MESSAGES USING $TIMEOUT (Experimental-Usage)
				function alertShow(){

	      			main.alerts = true;
	      			main.alertText = response.data.message;
	      			$timeout(function() {
	         			main.alerts = false;
	         			$location.path('/user/dashboard');
	      			}, 1500);

   				};

   				alertShow();
			}

			else{

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


			}, function errorCallback(reason){
				console.log(reason);
				alert("Error in Login-Post");
			})
		}
	}
])