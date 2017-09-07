var sha256 = require('sha256');
var uuid = require('uuid');

var key = sha256(uuid.v4() + (+(new Date())).toString());
var expires = {
	expiresIn: '600000'
};

var urlConfig = 'http://xxx:3000';

var registerEmailFrequency = 120000;


//developer mode
// var key = "key";
// var expires = {};

// var urlConfig = 'http://127.0.0.1:3000';

// var registerEmailFrequency = 0;

module.exports = {
	key: key,
	expires: expires,
	urlConfig: urlConfig,
	registerEmailFrequency: registerEmailFrequency
}