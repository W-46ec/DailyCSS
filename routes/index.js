var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var sha256 = require('sha256');
var mdb = require('../tools/db.js');
var auth = require('../tools/auth.js');
var mail = require('../tools/mail.js');

var DB_CONN_STR = 'mongodb://localhost:27017/dailycss';
var MongoClient = require('mongodb').MongoClient;
var selectCount = require('../tools/db').selectCount;
var selectAllDailyCss = require('../tools/db').selectAllDailyCss;
var selectFavorite = require('../tools/db').selectFavorite;

var register = [];

router.get('/',function(req, res, next){
	
	if(req.headers["auth"] === undefined){
		var username = ' ';
		
	} else {
		var username = jwt.verify(req.headers["auth"], auth.key).username;
		
	}

	var checkdata =	{
		username
	};

	MongoClient.connect(DB_CONN_STR, function(err, db) {
		selectCount(db, function(count) {
			var a = Math.round(Math.random()*(count - 1) + 0);
			console.log(a);
			selectAllDailyCss(db, function(data){
				selectFavorite(db, checkdata, function(result){
					res.json({
						code:200,
						favorite:result,
						dailyCss:data[a],
						msg:'Welcome!'
					});
					db.close();
				})
			})
		});
	})
})		//查看首页


//点击注册按钮
router.post('/register', function(req, res, next) {
	var registerInfo = {
		username: req.body.username,
		pwd: req.body.pwd,
		reconfirmpwd: req.body.reconfirmpwd,
		email: req.body.email,
		blog: req.body.blog,
		date: +(new Date())
	};
	mdb.findUser(registerInfo.username, function(err, result){
		if(err){
			res.json({
				code: 500,
				msg: 'Error'
			});
			return;
		}
		if(result.length === 0){
			for(var i = 0; i < register.length; i++){
				if(register[i].username === registerInfo.username){
					res.json({
						code: 90010,
						msg: '用户名已存在'
					});
					return;
				}
				if(register[i].date + 600000 < +(new Date())){	//10min
					register.splice(i,1);
					i-=1;
				}
			}
			if(Object.keys(registerInfo).some(e => registerInfo[e] === '' ||
				registerInfo.pwd != registerInfo.reconfirmpwd)){
				res.json({
					code: 90011,
					msg: '参数错误'
				});
			} else {
				register.push(registerInfo);
				var regToken = auth.registerToken(registerInfo);
				var href = "http://127.0.0.1:3000/register?Token=" + regToken;
				var a = "<a href=\"" + href + "\">" + href + "</a>";
				var msg = "<p>请于10分钟内完成验证</p><br>" + a;
				mail.sendEmail(registerInfo.email, msg, function(err, info){
					if(err) {
						res.json({
							code: 500,
							msg: 'Error'
						});
					} else {
						res.json({
							code: 200,
							msg: 'sent successfully'
						});
					}
				});
			}
		} else {
			res.json({
				code: 403,
				msg: '用户名已存在'
			});
		}
	});
});

//点击验证链接
router.get('/register', function(req, res, next){
	if(req.query.Token){
		jwt.verify(req.query.Token, auth.key, function(err, decoded){
			if(err){
				res.json({
					code: 403,
					msg: '授权失败'
				});
			} else {
				for(var i = 0; i < register.length; i++){
					if(register[i].username === decoded.username ||
						decoded.status === 1){
						mdb.addUser(register[i], function(err, result){
							if(err){
								res.json({
									code: 500,
									msg: 'Error'
								});
								return;
							}
							mdb.addReminder(decoded.username, function(err2, result2){
								if(err2){
									res.json({
										code: 500,
										msg: 'Error'
									});
									return;
								}
								register.splice(i,1);
								var rToken = auth.token(decoded.username);
								res.setHeader("auth", rToken);
								res.json({
									code: 200,
									msg: '注册成功'
								});
							});
						});
						return;
					}
				}
				res.json({
					code: 90014,
					msg: '授权过期'
				});
			}
		});
	} else {
		res.json({
			code: 403,
			msg: '参数错误'
		});
	}
});


module.exports = router;
