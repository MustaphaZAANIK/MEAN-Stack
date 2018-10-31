
// defining a mongoose schema 
// including the module

var mongoose = require('mongoose');
// declare schema object.
var Schema = mongoose.Schema;


var cartContent = new Schema({

	productId : {type:mongoose.Schema.Types.ObjectId},
	productName:{type:String,default:'',required:true},
	category  : {type:String,default:''},
	price     : {type:Number,default:0,required:true},
	number	: 	{type:Number,default:1,required:true}

})


var userSchema = new Schema({

	firstName  			: {type:String,default:'',required:true},
	lastName  			: {type:String,default:'',required:true},
	email	  			: {type:String,default:'',required:true},
	password			: {type:String,default:'',required:true},
	phone	  			: {type:Number,default:'',require:true},

	cart 				: [cartContent]

},{timestamps:true});



// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
