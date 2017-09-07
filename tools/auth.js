var sha256 = require('sha256');
var uuid = require('uuid');
var jwt = require('jsonwebtoken');

var config = require('../tools/config.js');

//生成Token
var token = function(username){
	var payload = {
		username: username
	};
	return jwt.sign(payload, config.key, config.expires);	//10min
}

//生成用于注册或找回密码的Token
var registerToken = function(info){
	var payload = {
		username: info.username,
		status: 1
	};
	return jwt.sign(payload, config.key, config.expires);	//10min
}

module.exports = {
	key: config.key,
	token: token,
	registerToken: registerToken
}