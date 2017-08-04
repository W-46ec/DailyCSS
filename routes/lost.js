var express = require('express');
var uuid = require('uuid');
var sha256 = require('sha256');
var jwt = require('jsonwebtoken');

var mdb = require('../tools/db.js');
var auth = require('../tools/auth.js');
var mail = require('../tools/mail.js');

var router = express.Router();

var verificationCode = [];

/* Lost listing. */

//验证用户名邮箱 & 生成验证码
router.post('/verifyuser', function(req, res, next){
	mdb.findUser(req.body.username, function(err, result){
		if(result.length === 0){
			res.json({
				code: 100010,
				msg: '用户名不存在'
			});
		} else {
			if(result[0].email === req.body.email){
				var code = uuid.v4().split('').slice(-6).join('');
				var verification = {
					username: result[0].username,
					email: result[0].email,
					code: code,
					date: +(new Date())
				};
				for(var i = 0; i < verificationCode.length; i++){
					if(verificationCode[i].date + 600000 < +(new Date())){	//10min
						verificationCode.splice(i,1);
						i-=1;
					}
				}
				if(verificationCode.some(e => 
					e.username === verification.username)){
					for(var j = 0; j < verificationCode.length; j++){
						if(verificationCode[j].username === verification.username){
							verificationCode[j].code = verification.code;
							verificationCode[j].date = verification.date;
						}
					}
					console.log("update:\n");	//test
					console.log(verificationCode);	//test
				} else {
					verificationCode.push(verification);
					console.log("push:\n");	//test
					console.log(verificationCode);	//test
				}
				res.json({
					code: 200,
					msg: '操作成功'
				});
			} else {
				res.json({
					code: 100011,
					msg: '邮箱不正确'
				});
			}
		}
	});
});

//发送验证码
router.post('/sendcode', function(req, res, next){
	if(verificationCode.some(e => e.username === req.body.username)){
		for(var i = 0; i < verificationCode.length; i++){
			if(verificationCode[i].username === req.body.username){
				var msg = "<p>您的验证码为:" + 
				verificationCode[i].code + 
				"。请于10分钟内完成验证</p>";
				mail.sendEmail(verificationCode[i].email, msg, function(err, info){
					if(err){
						res.json({
							code: 100012,
							msg: '邮件发送失败'
						});
					} else {
						res.json({
							code: 200,
							msg: '发送成功'
						});
					}
				});
				return;
			}
		}
	} else {
		res.json({
			code: 500,
			msg: 'Error'
		});
	}
});

//核实验证码
router.post('/verifycode', function(req, res, next){
	for(var j = 0; j < verificationCode.length; j++){
		if(verificationCode[j].date + 600000 < +(new Date())){	//10min
			verificationCode.splice(j,1);
			j-=1;
		}
	}
	// console.log("verificationCode:\n\n");	//test
	// console.log(verificationCode);	//test
	if(verificationCode.some(e => e.username === req.body.username)){
		for(var i = 0; i < verificationCode.length; i++){
			if(verificationCode[i].username === req.body.username){
				if(verificationCode[i].email === req.body.email &&
					verificationCode[i].code === req.body.code){
					var token = auth.registerToken({
						username: verificationCode[i].username
					});
					verificationCode.splice(i,1);
					// console.log("verificationCode:\n\n");	//test
					// console.log(verificationCode);	//test
					res.setHeader("auth", token);
					res.json({
						code: 200,
						auth: token,
						msg: '验证成功'
					});
				} else {
					res.json({
						code: 100013,
						msg: '验证码不正确'
					});
				}
				return;
			}
		}
	} else {
		res.json({
			code: 100014,
			msg: '验证信息过期'
		});
	}
});

//重置密码
router.post('/updatepwd', function(req, res, next){
	if(req.headers["auth"] === undefined){
			res.json({
			code: 100015,
			msg: "无法找到Token"
		});
	} else {
		jwt.verify(req.headers["auth"], auth.key, function(err, decoded){
			if(err){
				res.json({
					code: 100016,
					msg: "Token过期"
				});
			} else {
				if(req.body.pwd === req.body.reconfirmpwd &&
					decoded.status === 1){
					var salt = sha256(uuid.v4());
					var pwd = sha256(req.body.pwd + salt);
					var newPwd = {
						salt: salt,
						pwd: pwd
					};
					mdb.updatePersonalDetail(decoded.username, newPwd, function(err, result){
						if(err || result.result.nModified === 0){
							res.json({
								code: 500,
								msg: "Error"
							});
						} else {
							//console.log(result.result.nModified);	//test
							res.json({
								code: 200,
								msg: "重置成功"
							});
						}
					});
				} else {
					res.json({
						code: 100017,
						msg: "参数错误"
					});
				}
			}
		});
	}
});

module.exports = router;