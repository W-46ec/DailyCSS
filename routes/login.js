var express = require('express');
var sha256 = require('sha256');
var jwt = require('jsonwebtoken');

var mdb = require('../tools/db.js');
var auth = require('../tools/auth.js');
var mail = require('../tools/mail.js');

var router = express.Router();

var onLine = [];

/* Login listing. */

//登陆操作
router.post('/login', function(req, res, next) {
	mdb.findUser(req.body.username, function(err, result){
		if(err){
			res.json({
				code: 500,
				msg: 'Error'
			});
			return;
		}
		if(result.length === 0){
			res.json({
				code: 40010, 
				msg: 'Username does not exist!'
			});
		} else {
			var pwdSalt = sha256(req.body.pwd + result[0].salt);
			if(result[0].pwd === pwdSalt){
				var head = auth.token(req.body.username);
				res.setHeader("auth", head);
				if(onLine.some(e => {
					return e.username === req.body.username;
				})){
					for(var i = 0; i < onLine.length; i++){
						if(onLine[i].username === req.body.username){
							onLine[i].iat = +(new Date());
						}
					}
					console.log("onLine:\n");	//test
					console.log(onLine);	//test
				} else {
					onLine.push({
						username: req.body.username,
						iat: +(new Date())
					});
					console.log("push");	//test
					console.log("onLine:\n");	//test
					console.log(onLine);	//test
				}

				res.json({
					code: 200, 
					auth: head,
					msg: 'Welcome!'
				});
			} else {
				res.json({
					code: 40011, 
					msg: 'Wrong password!'
				});
			}
		}
	});
});

//登陆检测 & 在线统计
router.get('/*', function(req, res, next) {
	if(req.headers["auth"] === undefined){
			res.json({
			code: 40016,
			msg: "未登录或Token过期"
		});
	} else {
		jwt.verify(req.headers["auth"], auth.key, function(err, decoded){
			if(err){
				res.json({
					code: 40016,
					msg: "未登录或Token过期"
				});
			} else {
				var newHead = auth.token(decoded.username);
				res.setHeader("auth", newHead);
				if(onLine.some(e => {
					return e.username === decoded.username;
				})){
					for(var i = 0; i < onLine.length; i++){
						if(onLine[i].username === decoded.username){
							onLine[i].iat = +(new Date());
						}
					}
					console.log("onLine:\n");	//test
					console.log(onLine);	//test
				} else {
					onLine.push({
						username: decoded.username,
						iat: +(new Date())
					});
					console.log("push");	//test
					console.log("onLine:\n");	//test
					console.log(onLine);	//test
				}
				next();
			}
		});
	}
});

//登陆测试路由
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

//注销
router.get('/logout', function(req, res, next) {
	jwt.verify(req.headers["auth"], auth.key, function(err, decoded){
		if(err){
			res.json({
				code: 40016,
				msg: 'Invalid Token'
			});
		} else {
			onLine.map(e => {
				if(e.username === decoded.username){
					e.iat = 0;
				}
			});
			console.log("logout:\n\n");	//test
			console.log(onLine);	//test
			res.json({
				code: 200,
				msg: "logout"
			});
		}
	});
});

//获取个人信息
router.get('/personaldetail', function(req, res, next){
	jwt.verify(req.headers["auth"], auth.key, function(err, decoded){
		if(err){
			res.json({
				code: 403,
				msg: "authorized fail"
			});
		} else {
			mdb.findUser(decoded.username, function(err, result){
				if(err){
					res.json({
						code: 500, 
						msg: 'Error'
					});
					return;
				}
				if(result.length === 0){
					res.json({
						code: 500, 
						msg: 'Error'
					});
					return;
				} else {
					res.json({
						code: 200,
						data: {
							username: result[0].username,
							blog: result[0].blog,
							email: result[0].email
						},
						msg: 'personaldetail'
					});
				}
			});
		}
	});
});

//更改个人信息
router.post('/updateblog', function(req, res, next){
	jwt.verify(req.headers["auth"], auth.key, function(err, decoded){
		if(err){
			res.json({
				code: 403,
				msg: "authorized fail"
			});
		} else {
			var blog = {
				blog: req.body.blog
			};
			mdb.updatePersonalDetail(decoded.username, blog, function(err, result){
				if(err){
					res.json({
						code: 500, 
						msg: 'Error'
					});
					return;
				} else {
					res.json({
						code: 200,
						msg: 'success'
					});
				}
			});
		}
	});
});

//获取在线人数
router.get('/getonline', function(req, res, next){
	var ret = onLine.filter(e => {
		if(e.iat + 300 * 1000 > +(new Date())){
			return e;
		}
	});
	res.json({
		code: 200,
		data: ret,
		number: ret.length,
		msg: '在线人数'
	});
});

module.exports = router;