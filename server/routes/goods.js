var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');
var User = require('../models/user');

//连接NMongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/db_demo');

mongoose.connection.on("connected", ()=>{
	console.log("MongoDB connected success.");
});

mongoose.connection.on("error", ()=>{
	console.log("MongoDB connected fail.");
});

mongoose.connection.on("disconnected", ()=>{
	console.log("MongoDB connected disconnected.");
});

// 查询商品列表数据
router.get("/list", (req, res, next)=>{
	let page = parseInt(req.param("page"));
	let pageSize = parseInt(req.param("pageSize"));
	let priceLevel = req.param("priceLevel");
	let sort = req.param("sort");
	let skip = (page-1)*pageSize;
	let params = {};
	var priceGt = '',priceLte = '';
	if(priceLevel != 'all'){
		switch (priceLevel) {
			case '0':
				priceGt = 0;
				priceLte = 100;
				break;
			case '1':
				priceGt = 100;
				priceLte = 500;
				break;
			case '2':
				priceGt = 500;
				priceLte = 1000;
				break;
			case '3':
				priceGt = 1000;
				priceLte = 5000;
				break;
			default:
				// statements_def
				break;
		}
		params = {
			salePrice:{
				$gt:priceGt,
				$lte:priceLte
			}
		}
	}
	
	let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
	goodsModel.sort({'salePrice':sort});
	goodsModel.exec((err,doc)=>{
		if(err){
			res.json({
				status:'1',
				msg:err.message
			});
		}else{
			res.json({
				status:'0',
				msg:'',
				result:{
					count:doc.length,
					list:doc
				}
			});
		}
	});
});

//加入到购物车
router.post("/addCart", (req,res,next)=>{
	var userId = '100000077',productId = req.body.productId;

	User.findOne({
		userId: userId
	}, (err, userDoc) => {
		if(err){
			res.json({
				status: "1",
				msg: err.message
			})
		}else{
			if(userDoc){
				let goodsItem = '';
				userDoc.cartList.forEach( function(element, index) {
					if(element.productId == productId){
						goodsItem = element;
						element.productNum ++;
					}
				});

				if(goodsItem){
					userDoc.save((err2,doc2) => {
						if(err2){
							res.json({
								status: "1",
								msg: err2.message
							})
						}else{
							res.json({
								status: "0",
								msg: '',
								result: 'success'
							})
						}
					})
				}else{
					Goods.findOne({
						productId:productId
					}, (err1, doc) => {
						if(err1){
							res.json({
								status: "1",
								msg: err1.message
							})
						}else{
							if(doc){
								var obj = doc.toObject();
								obj.productNum = 1;
								obj.checked = 1;
								userDoc.cartList.push(obj);
								userDoc.save((err2,doc2) => {
									if(err2){
										res.json({
											status: "1",
											msg: err2.message
										})
									}else{
										res.json({
											status: "0",
											msg: '',
											result: 'success'
										})
									}
								})
							}
						}
					})
				}
			}
		}
	})
})

module.exports = router;