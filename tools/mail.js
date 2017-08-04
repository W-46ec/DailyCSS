var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
	//service: 'qq'
	service: '163',
	port: 465, // SMTP 端口
	secureConnection: true, // 使用 SSL
	auth: {
		user: '13322892832@163.com',
		//smtp授权码
		//pass: 'xnaihffehduahfig'	//QQ
		pass: 'xnaihffehduahfi1'	//163
	}
});

//发送邮件
var sendEmail = function(mail, msg, cb){
	var mailOptions = {
		from: '13322892832@163.com', // 发件地址
		to: mail, // 收件列表
		subject: 'Daily CSS 验证码', // 标题
		html: msg // html 内容
	};
	transporter.sendMail(mailOptions, function(error, info){
		cb(error, info);
	});
}

module.exports = {
	sendEmail: sendEmail
}