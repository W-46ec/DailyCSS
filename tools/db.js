var sha256 = require('sha256');
var uuid = require('uuid');

var mongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://127.0.0.1:27017/dailycss';

var tbUser = 'users';
var tbReminder = 'reminder';

//查找用户
var findUser = function(username, callback){
	mongoClient.connect(DB_CONN_STR,function(err,db){
		var collection = db.collection(tbUser);
		var whereStr = {"username": username};
		collection.find(whereStr).toArray(function(err, result){
			callback(err, result);
		});
	});
}

//添加用户
var addUser = function(query, callback){
	mongoClient.connect(DB_CONN_STR,function(err,db){
		var collection = db.collection(tbUser);
		var username = query.username;
		var salt = sha256(uuid.v4());
		var pwd = sha256(query.pwd + salt);
		var blog = query.blog;
		var email = query.email;
		var date = new Date().toLocaleString();
		var data = [{
			username: username, 
			pwd: pwd, 
			salt: salt,
			blog: blog,
			email: email,
			date: date
		}];
		collection.insert(data,function(err,result){
			callback(err, result);
			db.close();
		});
	});
}

var addReminder = function(username, callback){
	mongoClient.connect(DB_CONN_STR,function(err,db){
		var collection = db.collection(tbReminder);
		var data = [{
			username: username,
			id: "1"
		}, {
			username: username,
			id: "2"
		}, {
			username: username,
			id: "3"
		}, {
			username: username,
			id: "4"
		}, {
			username: username,
			id: "5"
		}];
		collection.insert(data, {multi:true}, function(err,result){
			callback(err, result);
			db.close();
		});
	});
}

// //修改密码	已废弃
// var updatePwd = function(query, callback){
// 	mongoClient.connect(DB_CONN_STR,function(err,db){
// 		var collection = db.collection(tbUser);
// 		var whereStr = {"username": query.username};
// 		var salt = sha256(uuid.v4());
// 		var pwd = sha256(query.pwd + salt);
// 		var updateStr = {$set: {
// 			pwd: pwd, 
// 			salt: salt
// 		}};
// 		collection.update(whereStr, updateStr, function(err,result){
// 			callback(err, result);
// 			db.close();
// 		})
// 	});
// }

//修改个人信息
var updatePersonalDetail = function(username, update, callback){
	mongoClient.connect(DB_CONN_STR,function(err,db){
		var collection = db.collection(tbUser);
		var whereStr = {"username": username};
		var updateStr = {$set: update};
		collection.update(whereStr, updateStr, function(err,result){
			callback(err, result);
			db.close();
		})
	});
}

module.exports = {
	findUser: findUser,
	addUser: addUser,
	addReminder: addReminder,
	updatePersonalDetail: updatePersonalDetail
}