var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	"userId":String,
	"userName":String,
	"userPwd":String,
	"orderList":Array,
	"cartList":[
		{
			"productId":String,
			"productName":String,
			"salePrice":String,
			"checked":String,
			"productNum":String,
			"productImage":String
		}
	],
	"addressList":[
		{
			"addressId":String,
			"userName":String,
			"streetName":String,
			"postCode":Number,
			"tel":Number,
			"isDefault":Boolean
		}
	]
});

module.exports = mongoose.model('User',userSchema);