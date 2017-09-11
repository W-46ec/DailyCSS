var express = require('express');
var multer  = require('multer');
var fs = require('fs');
var jwt = require('jsonwebtoken');
var path = require('path');
var md5 = require('md5');
var uuid = require('uuid');

var auth = require('../tools/auth.js');
var mdb = require('../tools/db.js');

var router = express.Router();

var uploadFolder = './public/upload/';

//上传头像
router.post('/upload', function(req, res, next){
	jwt.verify(req.headers["auth"], auth.key, function(err, decoded){
		if(err){
			res.json({
				code: 80010,
				msg: 'Invalid token'
			});
			return;
		} else {
			//文件存放路径 & 命名
			var filename = '';
			var fileid = md5(uuid.v4());
			var storage = multer.diskStorage({
				destination: function (req, file, cb) {
					cb(null, uploadFolder);
				},
				filename: function(req, file, cb){
					var fileFormat = (file.originalname).split(".");
					cb(
						null,
						fileid + 
						decoded.username + 
						"." + 
						fileFormat[fileFormat.length - 1]
					);
				}
			});
			//文件类型过滤
			var upload = multer({
				storage: storage,
				fileFilter: function(req, file, cb){
					var fileFormat = (file.originalname).split(".");
					var fileType = fileFormat[fileFormat.length - 1];
					if((file.mimetype === 'image/jpeg' || 
						file.mimetype === 'image/png') &&
						(fileType === 'jpg' || 
						fileType === 'png')){
						mdb.getFile(decoded.username, function(err, result){
							if(err){
								res.json({
									code: 500,
									msg: 'Error'
								});
							}
							if(fs.existsSync(result[0].filename)){
								fs.unlinkSync(result[0].filename);
							}
							filename = path.join(uploadFolder, fileid + decoded.username + '.' + fileType);
							cb(null, true);
						});
					} else {
						cb(new Error('Reject!'));
					}
				}
			}).single('profilephoto');
			upload(req, res, function(err){
				if(err){
					res.json({
						code: 80011,
						msg: 'failed'
					});
				} else {
					var query = {
						username: decoded.username,
						filename: filename
					};
					mdb.uploadFiles(query, function(err, result){
						if(err){
							res.json({
								code: 500,
								msg: 'Error'
							});
						}
						if(result.result.n === 1){
							res.send({
								code: 200,
								msg: 'success'
							});
						} else {
							res.json({
								code: 80011,
								msg: 'failed'
							});
						}
					});
				}
			});
		}
	});
});

//获取头像URL列表（部分）
router.post('/getfiles', function(req, res, next){
	var data = [];
	req.body.usernames.forEach(e => {
		data.push({
			username: e,
			filename: null
		});
	});
	mdb.findAllFiles(function(err, result){
		if(err){
			res.json({
				code: 500,
				msg: 'Error'
			});
		}
		for(var i = 0; i < data.length; i++){
			for(var j = 0; j < result.length; j++){
				if(data[i].username === result[j].username){
					data[i].filename = result[j].filename;
					break;
				}
			}
		}
		res.json({
			code: 200,
			data: data,
			msg: "files"
		});
	});
});

//获取全部用户的头像URL列表（备用）
router.get('/getallfiles', function(req, res, next){
	mdb.findAllFiles(function(err, result){
		if(err){
			res.json({
				code: 500,
				msg: 'Error'
			});
		}
		var data = [];
		result.map(e => {
			data.push({
				username: e.username,
				filename: e.filename
			});
		});
		res.json({
			code: 200,
			data: data,
			msg: "success"
		});
	});
});

module.exports = router;