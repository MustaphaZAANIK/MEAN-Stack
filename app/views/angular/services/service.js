
myApp.service("cartService",function($http){

	var main = this ;

	this.userFirstName ;

	// USER PROFILE PAGE
	this.dashboardApi = function(){
		return $http.get("/user/dashboard");
	}
	
	// USER LOGIN
	this.loginApi = function(data){

		return $http.post("/user/login",data);
	}

	// USER SIGNUP
	this.signupApi = function(data){      

		return $http.post('/user/signup',data);
	}

	// CREATE A PRODUCT
	this.postProdApi = function(data){
		
		return $http.post('/product/create',data);
	}

	// GET ALL PRODUCTS
	this.getAllApi = function(){
		
		return $http.get('/product/all');
	}

	// GET ONE PRODUCT
	this.getProdApi = function(productId){
		
		return $http.get("/product/"+productId+"");
	}

	// EDIT PRODUCT
	this.editProdApi = function(productId,data){
		
		return $http.put('/product/edit/'+productId+'',data);
	}

	// DELETE PRODUCT
	this.deleteProdApi = function(productId){
		
		return $http.post('/product/delete/'+productId+'');
	}

	// VIEW ITEMS IN CART
	this.getCartApi = function(){
		
		console.log("get all cart ran");
		
		return $http.get('/cart/all');
	}

		// ADD TO CART
	this.postCartApi = function(productId,data){
		
		return $http.post('/cart/add/'+''+productId+'',data);
	}

		// DELETE FROM CART
	this.deleteCartApi = function(productId,data){
		
		return $http.post('/cart/delete/'+''+productId+'',data);
	}

	// TO SEND PASSWORD RESET EMAIL
	this.postResetApi = function(data){
	
		return $http.post('/forgotPass',data);
	}

	// TO UPDATE PASSWORD
	this.updatePasswordApi = function(info){
		return $http.post('/password/update',info);
	}

})