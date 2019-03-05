var express = require('express');
var router = express.Router();

var User = require('./../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//登陆接口
router.post('/login', function(req, res, next) {
	var param = {
		userName: req.body.userName,
		userPwd: req.body.userPwd
	}

	User.findOne(param, (err,doc) => {
		if(err){
			res.json({
				status: "1",
				msg: err.message
			})
		}
		else{
			if(doc){
				res.cookie("userId",doc.userId,{
					path: '/',
					maxAge: 1000*60*60
				});
				res.cookie("userName",doc.userName,{
					path: '/',
					maxAge: 1000*60*60
				});
				// req.session.user = doc;

				res.json({
					status: "0",
					msg: '',
					result: {
						userName: doc.userName
					}
				})
			}
			else{
				res.json({
					status: "1",
					msg: "账号密码错误"
				})
			}
		}
	})
})

// 登出接口
router.post("/logout", function(req, res, next) {
	res.cookie("userId", "", {
		path: '/',
		maxAge: -1
	});
	res.cookie("userName", "", {
		path: '/',
		maxAge: -1
	});
	res.json({
		status: "0",
		msg: '',
		result: ''
	})
})

//校验登陆
router.get("/checkLogin", function(req, res, next) {
	if(req.cookies.userId){
		res.json({
			status: '0',
			msg: '',
			result:  req.cookies.userName
		})
	}else{
		res.json({
			status: '1',
			msg: '未登录',
			result:  ''
		})
	}
})

// 查询当前用户的购物车数据加载
router.get("/cartList", function(req, res, next) {
	var userId = req.cookies.userId;
	User.findOne({userId:userId}, (err,doc) => {
		if(err){
			res.json({
				status: "1",
				msg: err.message,
				result: ''
			})
		}else{
			if(doc){
				res.json({
					status: "0",
					msg: '',
					result: doc.cartList
				})
			}
		}
	})
})

//购物车删除
router.post("/cart/del", function(req, res, next) {
	var userId = req.cookies.userId,productId = req.body.productId;
	User.update({
		userId:userId
	},{
		$pull:{
			'cartList':{
				'productId':productId
			}
		}
	}, (err,doc) => {
		if(err){
			res.json({
				status: '1',
				msg: err.message,
				result: ''
			})
		}else{
			res.json({
				status: '0',
				msg: '',
				result: 'success'
			})
		}
	});
})

module.exports = router;
