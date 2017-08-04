var express = require('express');
var multer  = require('multer');
var fs = require('fs');
var jwt = require('jsonwebtoken');
var path = require('path');

var auth = require('../tools/auth.js');

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
			var storage = multer.diskStorage({
				destination: function (req, file, cb) {
					cb(null, uploadFolder);
				},
				filename: function(req, file, cb){
					var fileFormat = (file.originalname).split(".");
					cb(
						null, 
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
						if(fs.existsSync(path.join(uploadFolder, decoded.username + '.jpg')) &&
							fileType === 'png'){
							fs.renameSync(
								path.join(uploadFolder, decoded.username + '.jpg'),
								path.join(uploadFolder, decoded.username + '.png')
							);
						} else if(fs.existsSync(path.join(uploadFolder, decoded.username + '.png')) &&
							fileType === 'jpg'){
							fs.renameSync(
								path.join(uploadFolder, decoded.username + '.png'),
								path.join(uploadFolder, decoded.username + '.jpg')
							);
						}
						cb(null, true);
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
					res.send({
						code: 200,
						msg: 'success'
					});
				}
			});
		}
	});
});

//获取头像URL列表（部分）
router.post('/getfiles', function(req, res, next){
	var ret = req.body.usernames.map(e => {
		if(fs.existsSync(path.join('./public/upload', e + ".jpg"))){
			return path.join('./public/upload', e + ".jpg");
		} else if(fs.existsSync(path.join('./public/upload', e + ".png"))){
			return path.join('./public/upload', e + ".png");
		} else {
			return undefined;
		}
	});
	res.json({
		code: 200,
		data: ret,
		msg: "files"
	});
});

//获取全部用户的头像URL列表（备用）
router.get('/getallfiles', function(req, res, next){
	fs.readdir(uploadFolder, function(err, files){
		if(err){
			res.json({
				code: 500,
				msg: 'Error'
			});
		} else {
			res.json({
				code: 200,
				data: files.map(e => path.join('./public/upload', e)),
				msg: 'success'
			});
		}
	});
});

module.exports = router;