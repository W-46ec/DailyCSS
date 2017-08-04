var sha256 = require('sha256');
var uuid = require('uuid');
var jwt = require('jsonwebtoken');

var key = sha256(uuid.v4() + (+(new Date())).toString());

//生成Token
var token = function(username){
	var payload = {
		username: username
	};
	return jwt.sign(payload, key, {expiresIn: '600000'});	//10min
}

//生成用于注册或找回密码的Token
var registerToken = function(info){
	var payload = {
		username: info.username,
		status: 1
	};
	return jwt.sign(payload, key, {expiresIn: '600000'});	//10min
}

module.exports = {
	key: key,
	token: token,
	registerToken: registerToken
}