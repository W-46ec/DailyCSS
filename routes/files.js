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

//获取文件真实类型
var getFileType = function(typeCode){
	var ret = false;
	switch (typeCode){
		case 'ffd8ffe0':	//jpg
			ret = 'jpg';
			break;
		case 'ffd8ffe1':	//jpg
			ret = 'jpg';
			break;
		case '89504e47':	//png
			ret = 'png';
			break;
		default:	//unknow
			ret = null;
			break;
	}
	return ret;
}

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
			var chunks = [];
			var size = 0;
			req.on('data', function(chunk){
				chunks.push(chunk);
				size += chunk.length;
			});
			req.on('end', function(){
				var buffer = Buffer.concat(chunks , size);
				var rems = [];
				//根据\r\n分离数据和报头
				for(var i = 0; i < buffer.length; i++){
					var v = buffer[i];
					var v2 = buffer[i+1];
					if(v == 13 && v2 == 10){
						rems.push(i);
					}
				}
				var nbuf = buffer.slice(rems[3] + 2, rems[rems.length - 2]);
				var newBuf = nbuf.slice(0, 4);
				var head_1 = newBuf[0].toString(16);
				var head_2 = newBuf[1].toString(16);
				var head_3 = newBuf[2].toString(16);
				var head_4 = newBuf[3].toString(16);
				var typeCode = head_1 + head_2 + head_3 + head_4;
				if(getFileType(typeCode) === 'jpg' || 
					getFileType(typeCode) === 'png'){
					mdb.getFile(decoded.username, function(err, result){
						if(err){
							res.json({
								code: 500,
								msg: 'Error'
							});
						}
						if(result.length != 0){
							if(fs.existsSync(path.join(
									'./public/',
									result[0].filename.split('/').slice(1).join('\\')
								))){
								console.log("Remove:" + path.join(
									'./public/',
									result[0].filename.split('/').slice(1).join('\\')
								));
								fs.unlinkSync(path.join(
									'./public/',
									result[0].filename.split('/').slice(1).join('\\')
								));
							}
						}
						var fileid = md5(uuid.v4());
						var filename = path.join(
							uploadFolder, 
							fileid + 
							decoded.username + '.' + 
							getFileType(typeCode)
						);
						fs.writeFileSync(filename, nbuf);
						var query = {
							username: decoded.username,
							filename: filename.replace(/\\/g, '/').replace(/public/g, '')
						};
						mdb.uploadFiles(query, function(err, result){
							if(err){
								res.json({
									code: 500,
									msg: 'Error'
								});
							}
							if(result.result.n === 1){
								res.json({
									code: 200,
									data: filename.replace(/\\/g, '/').replace(/public/g, ''),
									msg: 'success'
								});
							} else {
								res.json({
									code: 80011,
									msg: 'failed'
								});
							}
						});
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