var sha256 = require('sha256');
var uuid = require('uuid');

// var key = sha256(uuid.v4() + (+(new Date())).toString());
// var expires = {
// 	expiresIn: '600000'
// };
// var registerExpires = {
// 	expiresIn: '600000'
// };

// var urlConfig = 'http://xxx:3000';

// var registerEmailFrequency = 120000;


//developer mode
var key = "key";	//Token 解密密钥
var expires = {};	//Token过期时间
var registerExpires = {};	//注册Token过期时间

var urlConfig = 'http://39.108.117.83:3000';	//邮箱URL

var registerEmailFrequency = 5000;	//邮件发送频率限制

module.exports = {
	key: key,
	expires: expires,
	urlConfig: urlConfig,
	registerEmailFrequency: registerEmailFrequency
}