// defining a mongoose schema 
// including the module


var mongoose = require('mongoose');
// declare schema object.
var Schema = mongoose.Schema;

var productSchema = new Schema({

	owner				: {type:mongoose.Schema.Types.ObjectId,ref:"User"},
	phone				: {type:Number,default:0,required:true},
	email  		: {type:String,required:true},
	productName  		: {type:String,default:'',required:true},
	category			: {type:String,default:'',required:true},
	price				: {type:Number,default:0,required:true},
	color				: {type:String,default:'',required:true},
	additionalInfo		: {type:String,default:'',required:true},
	availableIn	  		: {type:Number,default:1,required:true},

},{timestamps:true});



// create the model for products and expose it to our app
module.exports = mongoose.model('Product', productSchema);
