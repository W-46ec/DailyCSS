var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var uuid = require('uuid');
var auth = require('../tools/auth.js');


var DB_CONN_STR = 'mongodb://localhost:27017/dailycss';
var MongoClient = require('mongodb').MongoClient;

var insertDailyCss = require('../tools/db').insertDailyCss;
var selectOneDailyCss = require('../tools/db').selectOneDailyCss;
var selectFavorite = require('../tools/db').selectFavorite;
var insertFavorite = require('../tools/db').insertFavorite;
var delectFavorite = require('../tools/db').delectFavorite;


router.post('/submit', function(req, res, next){
	var username = jwt.verify(req.headers["auth"], auth.key).username;
	var content = req.body.dailycss.replace(/(\n|\r\n)/g,"<br />");
	var date = new Date().toLocaleString();
	var id = uuid();

	var data = {
		username,
		content,
		date,
		id
	};

  MongoClient.connect(DB_CONN_STR, function(err, db) {
    insertDailyCss(db, data,  function(result) {
		res.json({
			code:200,
			msg:'Insert Succeed',
		});
		
		db.close();
     });
  }) 
})		//添加dailyCss 


router.get('/collect', function(req, res, next){
	var id = req.query.id;
	var username = jwt.verify(req.headers["auth"], auth.key).username;

	var checkData = {
		id:id,
		username:username
	};

	MongoClient.connect(DB_CONN_STR, function(err, db){
		selectOneDailyCss(db, id, function(result){
			var content = result[0].content;
			var author = result[0].username;
			var data = {
				id,
				username,
				author,
				content
			};
			selectFavorite(db, checkData, function(a){
				if(Object.keys(a).length === 0){
					insertFavorite(db, data, function(end){
						res.json({
						code:200,
						msg:'收藏成功'
						});
						db.close();
					});
				} else {
					res.json({
						code:403,
						msg:'已收藏过该dailyCss'
					})
				}
			})
		})
	})
})		//收藏dailyCss	


router.get('/delete',function(req, res, next){
	var username = jwt.verify(req.headers["auth"], auth.key).username;
	var id = req.query.id;
	MongoClient.connect(DB_CONN_STR, function(err, db) {
		delectFavorite(db, username, id, function(result) {
			res.json({
				code:200,
				msg:'删除收藏成功'
			});
			db.close();
		});
	}) 


})      //删除收藏dailyCss

module.exports = router;