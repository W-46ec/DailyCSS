var sha256 = require('sha256');
var uuid = require('uuid');

var mongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://127.0.0.1:27017/dailycss';

var tbUser = 'users';
var tbReminder = 'reminder';

//获取所有用户
var findAllUser = function(callback){
    mongoClient.connect(DB_CONN_STR, function(err, db){
        var collection = db.collection(tbUser);
        collection.find().toArray(function(err, result){
            callback(err, result);
        });
    });
}

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

//初始化备忘录
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


var insertDailyCss = function(db, data, cb){  
    var collection = db.collection('dailyCss');

    collection.insert(data, function(err, result){
        if(err){
            console.log('Error'+err);
            return;
        }
        cb(result);
    })
};  //新增DailyCss


var selectOneDailyCss = function(db, id, cb){
    var collection = db.collection('dailyCss');
    var whereStr = {"id":id};

    collection.find(whereStr).toArray(function(err, result) {
        if(err)
        {
        console.log('Error:'+ err);
        return;
        }     
        cb(result);
    });
};   //查询OneDailyCss


var selectCount = function(db, cb){
    var collection = db.collection('dailyCss');
    
    collection.find().count(function(err, result) {
        if(err)
        {
        console.log('Error:'+ err);
        return;
        }     
        cb(result);
    });
};  //查询DailyCss总数


var selectAllDailyCss = function(db, cb){
    var collection = db.collection('dailyCss');

    var whereStr = {"username":{$gte:""}};
    collection.find(whereStr).toArray(function(err, result) {
        if(err){
            console.log('Error' + err);
            return;
        }
        cb(result);
    });
}   //查询AllDailyCss


var insertComment = function(db, data, cb){
    var collection = db.collection('comment');

    collection.insert(data, function(err, result){
        if(err){
            console.log('Error' + err);
            return;
        }
        cb(result);
    })
};  //新增评论


var selectComment = function(db, id, cb) {  
  var collection = db.collection('comment');
  
  var whereStr = {
      id:id
    };

  collection.find(whereStr).toArray(function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }     
    cb(result);
  });
};  //查询评论


var countComment = function(db, author, cb) {  
  var collection = db.collection('comment');
  
  var whereStr = {
      author:author
    };

  collection.find(whereStr).toArray(function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }     
    cb(result);
  });
};  //统计评论 


var updateComment = function(db, id, username, cb){
    var collection = db.collection('comment');

    var whereStr = {
        "id":id,
        "author":username
    };
    var updateStr = {$set: {"status": "0"}};

    collection.update(whereStr, updateStr, {
        multi: true
    }, function(err, result) {
        if(err){
        console.log('Error:'+ err);
        return;
        }
        console.log(result)
        cb(result);
    });
}   //更新评论


var insertFavorite = function(db, data, cb){
    var collection = db.collection('usersFavorite')

    collection.insert(data, function(err, result){
        if(err){
            console.log('Error' + err);
            return;
        }
        cb(result);
    })
};  //新增收藏


var selectFavorite = function(db, data, cb){
    var collection = db.collection('usersFavorite');

    var whereStr = data;
    collection.find(whereStr).toArray(function(err, result){
        if(err)
        {
        console.log('Error:'+ err);
        return;
        }     
        cb(result);
    });
}   //查询收藏


var delectFavorite = function(db, username, id, cb){
    var collection = db.collection('usersFavorite');

    var whereStr = {"username":username, "id":id};

    collection.remove(whereStr, function(err, result){
        if(err){
            console.log('Error' + err);
            return;
        }
        cb(result);
    })
}   //删除收藏


var selectMemo = function(db, username, cb){
    collection = db.collection('reminder');

    var whereStr = {"username":username};

    collection.find(whereStr).toArray(function(err, result){
        if(err)
        {
        console.log('Error:'+ err);
        return;
        }     
        cb(result);
    });


}   //查询备忘录


var insertMemo = function(db, data, cb){
    var collection = db.collection('reminder')

    collection.insert(data, function(err, result){
        if(err){
            console.log('Error' + err);
            return;
        }
        cb(result);
    })

}   //测试


var updateMemo = function(db, id, username, data, cb){
    var collection = db.collection('reminder');

    var whereStr = {"id":id, "username":username};
    var updateStr = {$set: data};

    collection.update(whereStr, updateStr, function(err, result) {
        if(err){
        console.log('Error:'+ err);
        return;
        }     
        cb(result);
    });
}   //更新备忘录


var someDailyCss = function(db, idArray, cb){
    var collection = db.collection('dailyCss');
    var whereStr = {'$or':idArray};

    collection.find(whereStr).limit(6).toArray(function(err, result) {
        if(err)
        {
        console.log('Error:'+ err);
        return;
        }     
        cb(result);
    });   
}   //查询未看评论的DailyCss


var selectSomeDailyCss = function(db, num, ID, author, cb){
    var collection = db.collection("dailyCss");
    num = 6 - num;
    var whereStr = {"id":{"$not":{"$in":ID}}, "username":author};
    collection.find(whereStr).limit(num).toArray(function(err, result){
        if(err){
            console.log('Error' + err);
            return;
        }
        cb(result);
    });

}   //查询一看评论的DailyCss





module.exports = {
	findUser: findUser,
	addUser: addUser,
	addReminder: addReminder,
	updatePersonalDetail: updatePersonalDetail,

    insertDailyCss: insertDailyCss,
    selectOneDailyCss:selectOneDailyCss,
    selectSomeDailyCss:selectSomeDailyCss,
    selectAllDailyCss:selectAllDailyCss,
    someDailyCss:someDailyCss,
    selectCount:selectCount,

    insertComment:insertComment,
    selectComment:selectComment,
    updateComment:updateComment,
    countComment:countComment,

    insertFavorite:insertFavorite,
    selectFavorite:selectFavorite,
    delectFavorite:delectFavorite,

    updateMemo:updateMemo,
    selectMemo:selectMemo,
    insertMemo:insertMemo

}


