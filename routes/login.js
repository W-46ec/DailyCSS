var express = require('express');
var sha256 = require('sha256');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');

var mdb = require('../tools/db.js');
var auth = require('../tools/auth.js');
var mail = require('../tools/mail.js');

var router = express.Router();

var onLine = [];

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
			//HMACSHA256方式加盐
			var pwdSalt = crypto.pbkdf2Sync(
				req.body.pwd,
				result[0].salt,
				4096,	//迭代次数
				256,	//生成密码长度
				'sha256'
			).toString('hex');
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
				} else {
					onLine.push({
						username: req.body.username,
						iat: +(new Date())
					});
				}

				res.json({
					code: 200,
					username: req.body.username,
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

//登陆过滤 & 在线统计 （GET）
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
				//暂时不用每次请求都更换Token
				//var newHead = auth.token(decoded.username);
				//res.setHeader("auth", newHead);
				res.setHeader("auth", req.headers["auth"]);
				if(onLine.some(e => {
					return e.username === decoded.username;
				})){
					for(var i = 0; i < onLine.length; i++){
						if(onLine[i].username === decoded.username){
							onLine[i].iat = +(new Date());
						}
					}
				} else {
					onLine.push({
						username: decoded.username,
						iat: +(new Date())
					});
				}
				next();
			}
		});
	}
});

//登陆过滤 & 在线统计 （POST）
router.post('/*', function(req, res, next) {
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
				//暂时不用每次请求都更换Token
				//var newHead = auth.token(decoded.username);
				//res.setHeader("auth", newHead);
				res.setHeader("auth", req.headers["auth"]);
				if(onLine.some(e => {
					return e.username === decoded.username;
				})){
					for(var i = 0; i < onLine.length; i++){
						if(onLine[i].username === decoded.username){
							onLine[i].iat = +(new Date());
						}
					}
				} else {
					onLine.push({
						username: decoded.username,
						iat: +(new Date())
					});
				}
				next();
			}
		});
	}
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
			res.json({
				code: 200,
				msg: "logout"
			});
		}
	});
});

//获取在线人数
router.get('/getonline', function(req, res, next){
	jwt.verify(req.headers["auth"], auth.key, function(err, decoded){
		if(err){
			res.json({
				code: 40016,
				msg: "未登录或Token过期"
			});
		} else {
			mdb.findAllUser(function(err, result){
				if(err){
					res.json({
						code: 500,
						msg: 'Error'
					});
					return;
				}
				var number = 0;
				var list = result.map(e => {
					let s = 1;
					for(var i = 0; i < onLine.length; i++){
						if(e.username === onLine[i].username){
							s = 0;
							if(onLine[i].iat + 300 * 1000 > +(new Date())){
								onLine[i].status = 1;
								number++;
								return onLine[i];
							} else {
								onLine[i].status = 0;
								return onLine[i];
							}
						} 
					}
					if(s){
						return {
							username: e.username,
							iat: 0,
							status: 0
						}
					}
				}).sort(function(a, b){
					return b.iat - a.iat;
				});
				for(var j = 0; j < list.length; j++){
					if(list.username === decoded.username){
						list.unshift(list.splice(j, 1));
						break;
					}
				}
				res.json({
					code: 200,
					data: list,
					number: number,
					msg: '在线人数'
				});
			});
		}
	});
});

module.exports = router;