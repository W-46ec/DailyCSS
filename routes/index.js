var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var sha256 = require('sha256');
var mdb = require('../tools/db.js');
var auth = require('../tools/auth.js');
var mail = require('../tools/mail.js');
var config = require('../tools/config.js');

var DB_CONN_STR = 'mongodb://localhost:27017/dailycss';
var MongoClient = require('mongodb').MongoClient;
var selectCount = require('../tools/db').selectCount;
var selectAllDailyCss = require('../tools/db').selectAllDailyCss;
var selectFavorite = require('../tools/db').selectFavorite;

//var urlConfig = 'http://xxx:3000';

var register = [];
var sentList = [];

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
			selectAllDailyCss(db, function(data){
				selectFavorite(db, checkdata, function(result){
					console.log(data+"123");
					if(data.length === 0){
						data[a] = [];
					}
					res.json({
						code:200,
						favorite:result,
						dailyCss:data[a],
						msg:'Welcome!'
					});
					console.log(result);
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
			for(var j = 0; j < sentList.length; j++){
				if(sentList[j].date + 120000 < +(new Date())){	//2min
					sentList.splice(j, 1);
					j-=1;
				}
			}
			if(Object.keys(registerInfo).some(e => registerInfo[e] === '' ||
				registerInfo.pwd != registerInfo.reconfirmpwd)){
				res.json({
					code: 90011,
					msg: '参数错误'
				});
			} else {
				if(sentList.length != 0 &&
					sentList.some(e => {
						if(e.email === registerInfo.email &&
							e.date + config.registerEmailFrequency > +(new Date())){
							return true;
						}
					})){	//2min
					res.json({
						code: 90016,
						msg: '请于2分钟后再尝试'
					});
				} else {
					register.push(registerInfo);
					var sent = {
						email: registerInfo.email,
						date: +(new Date())
					};
					sentList.push(sent);
					var regToken = auth.registerToken(registerInfo);
					var href = config.urlConfig + "/register?Token=" + regToken;
					var a = "<a href=\"" + href + "\">" + href + "</a>";
					var msg = "<p>请于10分钟内完成验证</p><br>" + a;
					mail.sendEmail(registerInfo.email, msg, function(err, info){
						if(err) {
							res.json({
								code: 90015,
								msg: '邮件发送失败'
							});
						} else {
							res.json({
								code: 200,
								msg: 'sent successfully'
							});
						}
					});
				}
			}
		} else {
			res.json({
				code: 90010,
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
				res.header('Content-Type', "text/html");
				res.render('msg', {code: 403, msg: '授权失败'});
			} else {
				for(var i = 0; i < register.length; i++){
					if(register[i].username === decoded.username &&
						decoded.status === 1){
						mdb.addUser(register[i], function(err, result){
							if(err){
								res.header('Content-Type', "text/html");
								res.render('msg', {code: 500, msg: 'Error'});
								return;
							}
							mdb.addReminder(decoded.username, function(err2, result2){
								if(err2){
									res.header('Content-Type', "text/html");
									res.render('msg', {code: 500, msg: 'Error'});
									return;
								}
								register.splice(i,1);
								var rToken = auth.token(decoded.username);
								res.setHeader("auth", rToken);
								res.header('Content-Type', "text/html");
								res.render('msg', {code: 200, msg: '注册成功'});
							});
						});
						return;
					}
				}
				res.header('Content-Type', "text/html");
				res.render('msg', {code: 90014, msg: '授权过期'});
			}
		});
	} else {
		res.header('Content-Type', "text/html");
		res.render('msg', {code: 403, msg: '参数错误'});
	}
});

module.exports = router;