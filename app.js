var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var login = require('./routes/login');
var lost = require('./routes/lost');
var files = require('./routes/files');
var comment = require('./routes/comment');
var person = require('./routes/person');
var dailycss = require('./routes/dailycss');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('*', function(req, res, next){
		// 设置跨域访问
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With, auth");
		res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
		res.header("X-Powered-By",' NIGHTCH@EXPRESS'); 
		res.header("Content-Type", "application/json;charset=utf-8");
		res.header("Cache-Control", "no-cache, no-store, must-revalidate");

		if(req.method === "OPTIONS") {
			res.sendStatus(200);
		} else {
			
			 next();
		}
}); 

app.use('/', index);
app.use('/lost', lost);
app.use('/user', login);
app.use('/user/files', files);
app.use('/user/comment', comment);
app.use('/user/person', person);
app.use('/user/dailycss', dailycss);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
