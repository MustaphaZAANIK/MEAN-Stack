
myApp.controller("SignupController",["$http",'$location','cartService','SweetAlert',
	function($http,$location,cartService,SweetAlert){
	
	var main = this ; 

	this.firstname;	
	this.lastname;
	this.email;
	this.email2;
	this.password;
	
	// FUNCTION TO SIGNUP USER
	this.submitSignup = function(){
	
		var signupData = {

			firstname : main.firstname,
			lastname: main.lastname,
			email: main.email,
			password: main.password,
			phone: main.phone
		};

		cartService.signupApi(signupData)
		.then(function successCallback(response){
			console.log(response);

			//IF ALREADY LOGGED IN USER TRIES TO SIGN UP, GO TO LOGIN SCREEN
			if(response.data.loggedIn == true || response.data.loggedIn != undefined){

				SweetAlert.swal({
				   title: "Access denied",
				   text:""+response.data.message+"",
				   type: "info",
				   confirmButtonColor: "#de463b",confirmButtonText: "Ok",
				   closeOnConfirm: true}, 
					function(){ 
			
				   		$location.path('/');
			
			   	});
			
			}

			else{

				// IF EMAIL IS NEW > REDIRECT TO DASHBOARD
				if(response.data.status == 200 && response.data.data.alreadyPresent !== true){
					$location.path('/user/dashboard'); 
				}

				else{
					SweetAlert.swal({
						title:"OOPS!",
					  	text: ""+response.data.message+"",
					   	type: "info",
					   	showCancelButton: false,
					   	confirmButtonColor: "#de463b",confirmButtonText: "OK!",
					   	closeOnConfirm: true});
				}
			}		

		}, function errorCallback(reason){
				console.log(reason);
				console.log("Error in Post");
			})
	}
}])