

myApp.controller("ForgotController",["$http",'$location','cartService','$rootScope','SweetAlert',
	function($http,$location,cartService,$rootScope,SweetAlert){
	
	var main = this ;

	this.email ;
	this.emailForReset;
	this.newPassword;

	// LOADER WHILE WAITING FOR RESPONSE
	this.showAlert = false;


	 // RESET PASSWORD FUNCTION
	 
	this.resetPass = function(email){

		var emailToSent = {
			email : main.emailForReset
		};

		
		cartService.postResetApi(emailToSent)
		.then(function successCallback(response){
			console.log(response);
			
			main.showAlert = false;
			if(response.data.status ==200 && response.data.data ==true){
				
				SweetAlert.swal({
					title:"Email-Sent",
				  	text: ""+response.data.message+"",
				   	type: "success",
				   	showCancelButton: false,
				   	confirmButtonColor: "#5cb85c",confirmButtonText: "Ok!",
				   	closeOnConfirm: true});
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

		}, function errorCallback(reason){
			console.log(reason);
			alert("Error in Login-Post");
		})
	};


	// UPDATE PASSWORD FUNCTION

	this.updatePassword = function(){

		var infoToUpdate = {

			password:main.newPassword
		};

		cartService.updatePasswordApi(infoToUpdate)
		.then(function successCallback(response){
			console.log(response);
			main.showAlert = true;
			
			if(response.data.mailLog ==false){
				main.showAlert = false;
				SweetAlert.swal({
					title:"Access denied",
				  	text: ""+response.data.message+"",
				   	type: "error",
				   	showCancelButton: false,
				   	confirmButtonColor: "#de463b",confirmButtonText: "Ok!",
				   	closeOnConfirm: true},
				   	function(){
				   		$location.path('/password/forgot');
				});
			}
			else{
				
				if(response.data.status ==200){
					main.showAlert = false;
					SweetAlert.swal({
						title:"Heeee-haaaa!!",
					  	text: ""+response.data.message+"",
					   	type: "success",
					   	showCancelButton: false,
					   	confirmButtonColor: "#5cb85c",confirmButtonText: "Ok",
					   	closeOnConfirm: true},
					   	function(){
					   		$location.path('/');
					});
				}

				else{

					alert(response.data.message);
				}
			}

		}, function errorCallback(reason){
			console.log(reason);
			alert("Error in Login-Post");
		})
	};
}])