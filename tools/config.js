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

// //数据库表名设置
// var mdbTable = {
// 	tbUser: 'users',
// 	tbReminder: 'reminder',
// 	tbFiles:'files'
// };


//developer mode
var key = "key";	//Token 解密密钥
var expires = {};	//Token过期时间
var registerExpires = {};	//注册Token过期时间

var urlConfig = 'http://39.108.117.83:3000';	//邮箱URL

var registerEmailFrequency = 5000;	//邮件发送频率限制

//数据库表名设置
var mdbTable = {
	tbUser: 'users',
	tbReminder: 'reminder',
	tbFiles:'files'
};

module.exports = {
	key: key,
	expires: expires,
	registerExpires: registerExpires,
	urlConfig: urlConfig,
	registerEmailFrequency: registerEmailFrequency,
	mdbTable: mdbTable
}