var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var DB_CONN_STR = 'mongodb://localhost:27017/dailycss';
var MongoClient = require('mongodb').MongoClient;
var auth = require('../tools/auth.js');


var selectOneDailyCss = require('../tools/db').selectOneDailyCss;
var insertComment = require('../tools/db').insertComment;
var selectComment = require('../tools/db').selectComment;
var updateComment = require('../tools/db').updateComment;
var countComment = require('../tools/db').countComment;




router.post('/',function(req, res, next){
	var id = req.query.id;
	var comment = req.body.comment.replace(/(\n|\r\n)/g,"<br />");
	var commentator = jwt.verify(res.headers["auth"], auth.key).username;
	// var commentator = req.body.username;
	var date = new Date().toLocaleString();
 
	MongoClient.connect(DB_CONN_STR, function(err, db) {
		selectOneDailyCss(db, id, function(result){
			var content = result[0].content;
			var author = result[0].username;
			var status = "1";
			var data = {
				id,
				commentator,
				comment,
				date,
				author,
				status
			};
			insertComment(db, data,  function(result) {
				res.json({
					code:200,
					msg:'Comment Succeed',
				});
				db.close();
			})
		});
	}) 
})		//添加评论


router.get('/', function(req, res, next){
	var id = req.query.id;
	var username = jwt.verify(req.headers["auth"], auth.key);
	// var username = "lin"; 

	MongoClient.connect(DB_CONN_STR, function(err, db){
		selectOneDailyCss(db, id, function(b){
			var author = b[0].username;
			if(username ===author){
				console.log("123");
				updateComment(db, id, username, function(a){
					selectComment(db, id, function(result){
						res.json({
							code:200,
							data:result,
							dailyCss:b[0],
							msg:'成功查看评论'	
						});
						db.close();
					});
				});
			} else {
				selectComment(db, id, function(result){
					result = result.reverse();
					res.json({
						code:200,
						data:result,
						dailyCss:b[0],
						msg:'成功查看评论'	
					})
					db.close();
				})				
			}
		})
	})
})		//查看评论
 

router.get('/count', function(req, res, next){
	var username = jwt.verify(req.headers["auth"], auth.key);
	// var author = "zxc110";

	MongoClient.connect(DB_CONN_STR, function(err, db){
		countComment(db, author, function(result){
			var i , j = 0;
			for(i = 0; i < result.length; i++){
				if(result[i].status === "1" ){
					j++;
				}
			}
			res.json({
				code:200,
				data:j,
				msg:'未查看评论总数'
			})
			db.close();
		})
	})

})		//未查看评论个数

module.exports = router;