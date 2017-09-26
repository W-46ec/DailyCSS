var express = require('express');
var jwt = require('jsonwebtoken');

var DB_CONN_STR = 'mongodb://localhost:27017/dailycss';
var MongoClient = require('mongodb').MongoClient;

var mdb = require('../tools/db.js');
var auth = require('../tools/auth.js');


var selectMemo = require('../tools/db').selectMemo;
var updateMemo = require('../tools/db').updateMemo;
var countComment = require('../tools/db').countComment;
var someDailyCss = require('../tools/db').someDailyCss;
var selectSomeDailyCss = require('../tools/db').selectSomeDailyCss;
var seeOther = require('../tools/db').seeOther;

var router = express.Router();

router.get('/memo', function(req, res, next){

	if ("username" in req.query){
		var username = req.query.username
	} else {
		var username = jwt.verify(req.headers["auth"], auth.key).username;
	}

	MongoClient.connect(DB_CONN_STR, function(err, db){
		selectMemo(db, username, function(result){
			res.json({
				code:200,
				data:result,
				msg:'成功查看备忘录'	
			})
			db.close();
		})
	})
})		//查看备忘录



router.post('/memo', function(req, res, next){
	var id = req.body.id;
	var time = req.body.time;
	var thing = req.body.thing.replace(/(\n|\r\n)/g,"<br />");
	var username = jwt.verify(req.headers["auth"], auth.key).username;
	// var username = 'honor';

	var data = {
		time,
		thing,
	}

	MongoClient.connect(DB_CONN_STR, function(err, db){
		updateMemo(db, id, username, data, function(result){
			res.json({
				code:200,
				msg:"成功更新备忘录"
			});
			db.close();
		});
	})
})		//修改备忘录


router.get('/display', function(req, res, next){
	var author = jwt.verify(req.headers["auth"], auth.key).username;
	var id = req.query.	;
	if (("username" in req.query && !(req.query.username === author)) || id === '0'){
		if(!id){
			var author = req.query.username;
		};
		MongoClient.connect(DB_CONN_STR, function(err, db){
			seeOther(db, author, function(result){
				result = result.reverse();
				res.json({
					code:200,
					data:result,
					msg:'查看他人资料'
				});
			});
		})
	} else {
		MongoClient.connect(DB_CONN_STR, function(err, db){
			countComment(db, author, function(result){
				var idArray = [];
				var ID = [];
				var i, sum = 0 ;
				for(i = 0; i < result.length; i++){
					if( result[i].status === "1" ){
						idArray.push({"id":result[i].id});
						ID.push(result[i].id);
					}
				}

				ID = ID.reduce((acc, cur) => {
					if(!acc.includes(cur))	acc.push(cur);
					return acc;
				},[]);
				console.log(idArray);
				
				sum = ID.length;
				someDailyCss(db, idArray, function(result){
					if(sum > 6){
						console.log(idArray);
						res.json({
						code:200,
						data:result,
						msg:'未查看评论的DailyCss超过6条'
						});
					}else {
						selectSomeDailyCss(db, sum, ID, author, function(end){
							end = end.reverse();
							console.log(idArray);
							res.json({
								code:200,
								data:result,
								last:end,
								msg:'未查看评论的DailyCss未超过6条'
							});
						});
					};
				});
			});
		});
	}
})		//一些展示神奇的东西 0


//获取个人信息
router.get('/personaldetail', function(req, res, next){
	jwt.verify(req.headers["auth"], auth.key, function(err, decoded){
		if(err){
			res.json({
				code: 70010,
				msg: "Invalid token"
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

//更改个人博客
router.post('/updateblog', function(req, res, next){
	jwt.verify(req.headers["auth"], auth.key, function(err, decoded){
		if(err){
			res.json({
				code: 70010,
				msg: "Invalid token"
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

module.exports = router;