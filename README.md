# Daily CSS 接口文档

[TOC]

## 接口约定

1. 所有接口均采用GET或POST方式

## 接口详情


### 首页

<br/>

#### 登陆

接口名称：/

接口类型：POST

是否需要Token：否

示例URL：http://127.0.0.1:3000

<br/>

**无请求参数列表**


<br/>
**响应参数列表**
|参数|含义|类型|备注|
|---|
|code|状态值|number|
|favorite|收藏的dailyCss||
|dailyCss|随机显示的dailyCss|
|msg|消息|string||


<br/>
**响应示例**
```json
	{
		"code":200,
		"favorite":[],		
		"dailyCss": {
        "_id": "5982940f00d6960df4180b6a",
        "username": "zxc110",
        "content": "早上下雨",
        "date": "2017-08-03 11:10:07",
        "id": "d70174a8-ece5-45eb-9f62-80a7853941dc"
    }
		"msg":"Welcome!"
	}
```

<br/>
**状态码详细定义**
|状态码|含义|消息|
|---|
|200|登陆成功|Welcome!|


### 登陆模块

<br/>

#### 登陆

接口名称：/user/login

接口类型：POST

是否需要Token：否

示例URL：http://127.0.0.1:3000/user/login

<br/>

**请求参数列表**
|参数|含义|类型|备注|
|---|
|username|用户名|string||
|pwd|密码|string||

<br/>
**响应参数列表**
|参数|含义|类型|备注|
|---|
|code|状态值|number||
|msg|消息|string||
|auth|授权码（Token）|string|登陆成功后才会获得|
|username|用户名|string|登陆成功后才会获得|

<br/>
**响应示例**
```json
	{
		"code":200,
		"auth":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNTAxNzI4MjIzLCJleHAiOjE1MDE3Mjg4MjN9.QjF4hsExvsBnpZwNajopLrklm3MXyMGxRzq6qFGBoFQ",
		"msg":"Welcome!"
	}
```

<br/>
**状态码详细定义**
|状态码|含义|消息|
|---|
|500|服务器错误|Error|
|40010|用户名不存在|Username does not exist!|
|40011|密码错误|Wrong password!|
|200|登陆成功|Welcome!|

<br/>
#### 注销

接口名称：/user/logout

接口类型：POST

是否需要Token：否

示例URL：http://127.0.0.1:3000/user/logout

<br/>
**响应参数列表**
|参数|含义|类型|备注|
|---|
|code|状态值|number||
|msg|消息|string||

<br/>
**响应示例**
```json
	{
		"code":200,
		"msg":"logout"
	}
```

<br/>
**状态码详细定义**
|状态码|含义|消息|
|---|
|200|注销成功|logout|
|40016|非法Token|Invalid Token|

### 注册模块

<br/>
#### 点击注册按钮

接口名称：/register

接口类型：POST

是否需要Token：否

示例URL：http://127.0.0.1:3000/register

<br/>
**请求参数列表**
|参数|含义|类型|备注|
|---|
|username|用户名|string||
|pwd|密码|string||
|reconfirmpwd|确认密码|string||
|email|邮箱|string||
|blog|个人博客|string||

<br/>
**响应参数列表**
|参数|含义|类型|备注|
|---|
|code|状态值|number||
|msg|消息|string||

<br/>
**响应示例**
```json
	{
		"code":200,
		"msg":"sent successfully"
	}
```

<br/>
**状态码详细定义**
|状态码|含义|消息|
|---|
|500|服务器错误|Error|
|90010|用户名已存在|用户名已存在|
|90011|参数错误|参数错误|
|90015|邮件发送失败|邮件发送失败|
|90016|邮件发送过于频繁|请于2分钟后再尝试|
|200|邮件发送成功|sent successfully|


<br/>
#### 点击验证链接

接口名称：/register

接口类型：GET

是否需要Token：否

示例URL：http://127.0.0.1:3000/register

<br/>
**请求参数列表**
|参数|含义|类型|备注|
|---|
|Token|授权码|string|已经拼接好在URL里|

<br/>
**响应参数列表**
|参数|含义|类型|备注|
|---|
|code|状态值|number||
|msg|消息|string||

<br/>
**响应示例**
```json
	{
		"code":200,
		"msg":"success"
	}
```

<br/>
**状态码详细定义**
|状态码|含义|消息|
|---|
|90012|授权失败|授权失败|
|90013|参数错误|参数错误|
|90014|授权过期|授权过期|
|200|注册成功|success|


### 找回密码模块

<br/>
#### 验证用户名邮箱

接口名称：/lost/verifyuser

接口类型：POST

是否需要Token：否

示例URL：http://127.0.0.1:3000/lost/verifyuser

<br/>
**请求参数列表**
|参数|含义|类型|备注|
|---|
|username|用户名|string||
|email|邮箱|string||

<br/>
**响应参数列表**
|参数|含义|类型|备注|
|---|
|code|状态值|number||
|msg|消息|string||

<br/>
**响应示例**
```json
	{
		"code":200,
		"msg":"操作成功"
	}
```

<br/>
**状态码详细定义**
|状态码|含义|消息|
|---|
|100010|用户名不存在|用户名不存在|
|100011|邮箱不正确|邮箱不正确|
|200|操作成功|操作成功|


<br/>
#### 发送验证码

接口名称：/lost/sendcode

接口类型：POST

是否需要Token：否

示例URL：http://127.0.0.1:3000/lost/sendcode

<br/>
**请求参数列表**
|参数|含义|类型|备注|
|---|
|username|用户名|string||
|email|邮箱|string||

<br/>
**响应参数列表**
|参数|含义|类型|备注|
|---|
|code|状态值|number||
|msg|消息|string||

<br/>
**响应示例**
```json
	{
		"code":200,
		"msg":"操作成功"
	}
```

<br/>
**状态码详细定义**
|状态码|含义|消息|
|---|
|500|服务器错误|Error|
|100012|邮件发送失败|邮件发送失败|
|100018|邮件发送过于频繁|请于1分钟后再尝试|
|200|发送成功|发送成功|


<br/>
#### 核实验证码

接口名称：/lost/verifycode

接口类型：POST

是否需要Token：否

示例URL：http://127.0.0.1:3000/lost/verifycode

<br/>
**请求参数列表**
|参数|含义|类型|备注|
|---|
|username|用户名|string||
|email|邮箱|string||
|code|验证码|string|

<br/>
**响应参数列表**
|参数|含义|类型|备注|
|---|
|code|状态值|number||
|msg|消息|string||
|auth|授权码（Token）|string|验证成功后才可获得|

<br/>
**响应示例**
```json
	{
		"code":200,
		"msg":"验证成功"
	}
```

<br/>
**状态码详细定义**
|状态码|含义|消息|
|---|
|100013|验证码不正确|验证码不正确|
|100014|验证信息过期|验证信息过期|
|200|验证成功|验证成功|


<br/>
#### 重置密码

接口名称：/lost/updatepwd

接口类型：POST

是否需要Token：是

示例URL：http://127.0.0.1:3000/lost/updatepwd

<br/>
**请求参数列表**
|参数|含义|类型|备注|
|---|
|pwd|密码|string||
|reconfirmpwd|确认密码|string||

<br/>
**响应参数列表**
|参数|含义|类型|备注|
|---|
|code|状态值|number||
|msg|消息|string||

<br/>
**响应示例**
```json
	{
		"code":100015,
		"msg":"无法找到Token"
	}
```

<br/>
**状态码详细定义**
|状态码|含义|消息|
|---|
|500|服务器错误|Error|
|100015|无法找到Token|无法找到Token|
|100016|验证信息过期|Token过期|
|100017|参数错误|参数错误|
|200|重置成功|重置成功|

### Daily CSS模块

<br/>
#### 添加dailyCss
接口名称：/user/dailycss/submit

接口类型：POST

是否需要Token：是

示例URL：http://127.0.0.1:3000/user/daiilcss/submit

<br/>
**参数列表**
|参数|含义|类型|备注|
|---|
|dailycss|dailycss内容|string||

<br/>
**响应参数列表**
|参数|含义|类型|备注|
|---|
|code|状态值|number||
|msg|消息|string||

<br/>
**响应示例**
```json
	{
	    "code": 200,
	    "msg": "Insert Succeed"
	}
```

<br/>
**状态码详细定义**
|状态码|含义|消息|
|---|
|200|请求成功|Insert Succeed|

#### 收藏dailyCss
接口名称：/user/dailycss/collect

接口类型：GET

是否需要Token：是

示例URL：http://127.0.0.1:3000/user/dailycss/collect?id=xxx

<br/>
**参数列表**
|参数|含义|类型|备注|
|---|
|id|连接dailycss|string||

<br/>
**响应参数列表**
|参数|含义|类型|备注|
|---|
|code|状态值|number||
|msg|消息|string||

<br/>
**响应示例**
```json
	{
	    "code": 200,
	    "msg": "收藏成功"
	}
```

<br/>
**状态码详细定义**
|状态码|含义|消息|
|---|
|200|请求成功|收藏成功|
|403|收藏失败|已收藏过该dailyCss|

#### 删除dailyCss
接口名称：/user/dailycss/delete

接口类型：GET

是否需要Token：是

示例URL：http://127.0.0.1:3000/user/dailycss/delete?id=xxx

<br/>
**参数列表**
|参数|含义|类型|备注|
|---|
|id|连接dailycss|string||

<br/>
**响应参数列表**
|参数|含义|类型|备注|
|---|
|code|状态值|number||
|msg|消息|string||

<br/>
**响应示例**
```json
	{
	    "code": 200,
	    "msg": "删除收藏成功"
	}
```

<br/>
**状态码详细定义**
|状态码|含义|消息|
|---|
|200|请求成功|删除收藏成功|


### 评论模块
<br/>
#### 添加评论
接口名称：/user/comment

接口类型：POST

是否需要Token：是

示例URL：http://127.0.0.1:3000/user/comment?id=xxx

<br/>
**参数列表**
|参数|含义|类型|备注|
|---|
|comment|评论内容|string||
|id|连接DailyCss|string|
<br/>
**响应参数列表**
|参数|含义|类型|备注|
|---|
|code|状态值|number||
|msg|消息|string||

<br/>
**响应示例**
```json
	{
	    "code": 200,
	    "msg": "Comment Succeed"
	}
```

<br/>
**状态码详细定义**
|状态码|含义|消息|
|---|
|200|请求成功|Comment Succeed|

#### 查看评论
接口名称：/user/comment

接口类型：GET

是否需要Token：是

示例URL：http://127.0.0.1:3000/user/comment?id=xxx

<br/>
**参数列表**
|参数|含义|类型|备注|
|---|
|id|连接DailyCss|string|
<br/>
**响应参数列表**
|参数|含义|类型|备注|
|---|
|code|状态值|number||
|data|评论内容|string
|dailyCss|被评论内容|string
|msg|消息|string||

<br/>
**响应示例**
```json
	{
	    "code": 200,
	    "data":[{
		    "_id": "5982c9e1b73b0d36b43943dc",
		    "id": "d70174a8-ece5-45eb-9f62-80a7853941dc",
            "commentator": "honor",
            "comment": "花菜是菜花",
            "date": "2017-08-03 14:59:45",
            "author": "zxc110",
            "status": "1"
	    },
	    ……],
	    "dailyCss": {
        "_id": "5982940f00d6960df4180b6a",
        "username": "zxc110",
        "content": "早上下雨",
        "date": "2017-08-03 11:10:07",
        "id": "d70174a8-ece5-45eb-9f62-80a7853941dc"
    },
	    "msg": "Comment Succeed"
	}
```
<br/>
**状态码详细定义**
|状态码|含义|消息|
|---|
|200|请求成功|Comment Succeed|

#### 未查看评论个数
接口名称：/user/comment

接口类型：GET

是否需要Token：是

示例URL：http://127.0.0.1:3000/user/count

<br/>
**无请求参数列表**

<br/>
**响应参数列表**
|参数|含义|类型|备注|
|---|
|data|未查看评论的总数|number|

<br/>
**响应示例**
```json
	{
	    "code": 200,
	    "data":3	
	    "msg": "未查看评论总数"
	}
```
<br/>
**状态码详细定义**
|状态码|含义|消息|
|---|
|200|请求成功|Comment Succeed|

### 个人信息模块

#### 查看备忘录

接口名称：/user/person/memo

接口类型：GET

是否需要Token：是

示例URL：http://127.0.0.1:3000/user/person/memo?username=xxx

<br/>
**无请求参数列表**

<br/>
**响应参数列表**
|参数|含义|类型|备注|
|---|
|code|状态值|number||
|data|数据|object||
|msg|消息|string||

<br/>
**响应示例**
```json
	{
	    "code": 200,
	    "data": [
	        {
            "_id": "598297c8f8c0f220980a5f79",
            "id": "5",
            "username": "honor",
            "time": "周四",
            "thing": "睡觉"
        }],
	    "msg": "成功查看备忘录"
	}
```

<br/>
**状态码详细定义**
|状态码|含义|消息|
|---|
|200|请求成功|成功查看备忘录|

#### 修改备忘录

接口名称：/user/person/memo

接口类型：POST

是否需要Token：是

示例URL：http://127.0.0.1:3000/user/person/memo?username=xxx

<br/>
**请求参数列表**
|参数|含义|类型|备注|
|---|
|id|第几条便签|number||
|time|时间|string||
|thing|做什么|string||
<br/>
**响应参数列表**
|参数|含义|类型|备注|
|---|
|code|状态值|number||
|data|数据|object||
|msg|消息|string||

<br/>
**响应示例**
```json
	{
	    "code": 200,
	    "data": [
				"code":200,
				"msg":"成功更新备忘录"
        }],
	    "msg": "成功更新备忘录"
	}
```

<br/>
**状态码详细定义**
|状态码|含义|消息|
|---|
|200|请求成功|成功更新备忘录|


<br/>
#### 获取个人资料

接口名称：/user/person/personaldetail

接口类型：GET

是否需要Token：是

示例URL：http://127.0.0.1:3000/user/person/personaldetail

<br/>
**无请求参数列表**

<br/>
**响应参数列表**
|参数|含义|类型|备注|
|---|
|code|状态值|number||
|data|数据|object||
|msg|消息|string||

<br/>
**响应示例**
```json
	{
	    "code": 200,
	    "data": {
	        "username": "admin",
	        "blog": "admin.blog",
	        "email": "admin@css.com"
	    },
	    "msg": "personaldetail"
	}
```

<br/>
**状态码详细定义**
|状态码|含义|消息|
|---|
|500|服务器错误|Error|
|70010|Token不合法或过期|Invalid token|
|200|请求成功|personaldetail|


<br/>
#### 更改个人博客

接口名称：/person/updateblog

接口类型：POST

是否需要Token：是

示例URL：http://127.0.0.1:3000/person/updateblog

<br/>
**请求参数列表**
|参数|含义|类型|备注|
|---|
|blog|博客|string|更新后的博客|

<br/>
**响应参数列表**
|参数|含义|类型|备注|
|---|
|code|状态值|number||
|msg|消息|string||

<br/>
**响应示例**
```json
	{
		"code":200,
		"msg":"success"
	}
```

<br/>
**状态码详细定义**
|状态码|含义|消息|
|---|
|500|服务器错误|Error|
|70010|Token不合法或过期|Invalid token|
|200|修改成功|success|

### 头像传输模块


<br/>
#### 上传头像

接口名称：/user/files/upload

接口类型：POST

是否需要Token：是

示例URL：http://127.0.0.1:3000/user/files/upload

<br/>
**请求参数列表**
|参数|含义|类型|备注|
|---|
|profilephoto|图像文件||仅限jpg和png格式|

<br/>
**响应参数列表**
|参数|含义|类型|备注|
|---|
|code|状态值|number||
|msg|消息|string||

<br/>
**响应示例**
```json
	{
		"code":200,
		"msg":"success"
	}
```

<br/>
**状态码详细定义**
|状态码|含义|消息|
|---|
|80010|Token不合法或过期|Invalid token|
|80011|上传失败|failed|
|200|上传成功|success|


<br/>
#### 获取头像URL列表（部分）

接口名称：/user/files/getfiles

接口类型：POST

是否需要Token：是

示例URL：http://127.0.0.1:3000/user/files/getfiles

<br/>
**请求参数列表**
|参数|含义|类型|备注|
|---|
|usernames|用户名列表|array||

<br/>
**响应参数列表**
|参数|含义|类型|备注|
|---|
|code|状态值|number||
|data|返回值|array|请求头像的URL列表，没有则返回null|
|msg|消息|string||

<br/>
**请求示例**
```json
	{
		"usernames": [
			"admin",
			"test"
		]
	}
```

<br/>
**响应示例**
```json
	{
	    "code": 200,
	    "data": [
	        "public\\upload\\admin.jpg",
	        null
	    ],
	    "msg": "files"
	}
```

<br/>
**状态码详细定义**
|状态码|含义|消息|
|---|
|200|请求成功|files|


<br/>
#### 获取全部用户的头像URL列表

接口名称：/user/files/getallfiles

接口类型：GET

是否需要Token：是

示例URL：http://127.0.0.1:3000/user/files/getallfiles

<br/>
**无请求参数列表**

<br/>
**响应参数列表**
|参数|含义|类型|备注|
|---|
|code|状态值|number||
|data|返回值|array|请求成功时返回|
|msg|消息|string||

<br/>
**响应示例**
```json
	{
	    "code": 200,
	    "data": [
	        "public\\upload\\admin.jpg"
	    ],
	    "msg": "success"
	}
```

<br/>
**状态码详细定义**
|状态码|含义|消息|
|---|
|500|服务器错误|Error|
|200|请求成功|success|

## 附录

### 附录Ⅰ（模块路由与状态码分发）

|模块|绑定路由|状态码开头|状态码位数|
|---|
|主页|/...|300**|5|
|登陆模块|/user/...|400**|5|
|注册模块|/...|900**|5|
|找回密码模块|/lost/...|1000**|6|
|Daily CSS模块|/user/dailycss/...|500**|5|
|评论模块|/user/comment/...|600**|5|
|个人信息模块|/user/personal/...|700**|5|
|头像传输模块|/user/files/...|800**|5|


### 附录Ⅱ（状态码汇总）


### 附录Ⅲ