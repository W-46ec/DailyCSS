var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
	service: 'qq',
	port: 465, // SMTP 端口
	secureConnection: true, // 使用 SSL
	auth: {
		user: '3206434808@qq.com',
		pass: 'qkhoobpspuxodeda'
	}
});

//发送邮件
var sendEmail = function(mail, msg, cb){
	var mailOptions = {
		from: '3206434808@qq.com',
		to: mail,
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