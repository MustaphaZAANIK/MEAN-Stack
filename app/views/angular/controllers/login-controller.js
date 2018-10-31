

myApp.controller("LoginController",["$http",'$location','cartService','$rootScope','SweetAlert',
	function($http,$location,cartService,$rootScope,SweetAlert){
	
	var main = this ; 

	this.email ;
	this.emailForReset;
	this.password;

	// HIDING NAVBAR-links FOR LOGIN-PAGE
	$rootScope.showHome =false; 
	$rootScope.showCart =false; 
	$rootScope.showLogout =false;  

	this.submitLogin = function(){

		var loginData = {
			
			email: main.email,
			password:main.password
		}

		cartService.loginApi(loginData)
		.then(function successCallback(response){
			// console.log(response);

			if(response.data.status == 200){
				
				$location.path('/user/dashboard');

			}

			else{

				SweetAlert.swal({
					title:"OOPS!",
				  	text: ""+response.data.message+"",
				   	type: "error",
				   	showCancelButton: false,
				   	confirmButtonColor: "#de463b",confirmButtonText: "Got it!",
				   	closeOnConfirm: true});
				
			}


			}, function  errorCallback(reason){
				console.log(reason);
				alert("Error in Login-Post");
			})
	};

	
}])