//这个是介绍我现在对这个问题做的调查.

//现在的情况是:meteor支持的不同平台张海来登录meteor应用, 例如accounts-twitter.  但是当一个account登录后, 你如果想给这个用户再加一个关联帐号, //例如用twitter登录, 但是想关联facebook(不为了登录), 现在是不成的.  及时你的meteor user帐号是自建的(在meteor应用上注册的).

//我看了看account-weibo, account-facebook, account-twitter, 以及account-github 的东西.  他们主要都调用了, 这几个东西.
//
//Account_server.js 的123行起.  
//

//这些属于accounts-base中的accounts_client.js & account_server.js, 和 accounts-oauth-helper中的oauth_client.js & oauther_server.js

//我做了一个小的实验, 通过添加facebook, twitter, 以及自创帐号, 得到了这几个db条目
//首先是twitter的
var twitter = { 
	"_id" : "jmpCPxEJdQKaiydcG", 
	"createdAt" : 1367016533855, 
	"profile" : { 
		"name" : "Bo (伯昭)" 
	}, 
	"services" : { 
		"resume" : { 
			"loginTokens" : [ 	
				{ 	"token" : "Ewt73haXCPZjyYBvD", 	"when" : 1367016533855 }, 	
				{ 	"token" : "vJsmocyXgqwrzJjDK", 	"when" : 1367017211819 } 
			] 
		}, 
		"twitter" : { 
			"accessToken" : "15679748-H2J8JhRQENjli90s2P9xASKsbaQ5boNluRjbOw5vs", 
			"accessTokenSecret" : "j4OxP4H99vUQSYm32ZpNoggeYeJlUlB4Ur3fyzMELY", 
			"id" : "15679748", 
			"lang" : "en", 
			"profile_image_url" : "http://a0.twimg.com/profile_images/2904932781/2ced19dc1b1d939b713c81e6aeef7a64_normal.jpeg", 
			"profile_image_url_https" : "https://twimg0-a.akamaihd.net/profile_images/2904932781/2ced19dc1b1d939b713c81e6aeef7a64_normal.jpeg",
			"screenName" : "bozhao" 
		} 
	} 
};

var facebook = { 
	"createdAt" : 1367271090498, 
	"_id" : "qx5BPK3CKn82fi8PJ", 
	"services" : { 
		"facebook" : { 
			"accessToken" : "BAAB81qM1hXsBAHHXL6ikRZBlBSfAw36rXZAZBxuTYfuMHxqgTrfI0Gm4BQIl8ZBfLMSTPcOjXXmFtMTB4HwdUZBdgX24fyy1KyyAjLaZCOMaZAoukNWWsZAcqZCUNZBEpNov8R1JFZBUQ3g5KQzPa9DnZAG8B8SkP6v2ITWuyZCFUCziFq6Xw5NAphD0sCuZArFyhjTXZCEld5ZAF3vPR6gBcXsw1BIZA", 
			"expiresAt" : 1372455089489, 
			"id" : "12812424", 
			"email" : "yubz86@gmail.com", 
			"name" : "Bozhao Yu", 
			"first_name" : "Bozhao", 
			"last_name" : "Yu", 
			"link" : "http://www.facebook.com/yubozhao", 
			"username" : "yubozhao", 
			"gender" : "male", 
			"locale" : "en_US" 
		}, 
		"resume" : { 
			"loginTokens" : [ 
				{ "token" : "e3EYxwSftKKEwPGiv", "when" : 1367271090498 } 
			] 
		} 
	}, 
	"profile" : { 
		"name" : "Bozhao Yu" 
	} 
};
//注册在meteor app上的.
var selfRegister = { 
	"createdAt" : 1367271537301, 
	"_id" : "2gRywhSZkf4bRqnzk", 
	"services" : { 
		"password" : { 
			"srp" : { 
				"identity" : "wgKA7kRCxzqEGffv3", 
				"salt" : "FWNPYz2rgQagE9NPC", 
				"verifier" : "3d759311c250f8a468e38943925f8f376d41cd5a615e2522b4815f5684758c5f11ce7906a6c368106defada963f476730660e20f724159b29231036478e0983659accf3707fdc8cf05a54a3e0613d9f28540296f2a55f5e28e2b6c4de2ec723ab525cf2da967387c9ab75ab890b5ce56743159df4a06d12582265ff0aec2f10b" 
			} 
		}, 
		"resume" : { 
			"loginTokens" : [ 
				{ "token" : "CasGu3tFZfMA5HAme", "when" : 1367271537301 } 
			] 
		} 
	}, 
	"emails" : [ { "address" : "yubozhao@icloud.com", "verified" : false } ] 
};

//通过这些让我觉得, 只要阻止meteor自动创建user, 然后把相关的信息添加到services下就可以解决问题.  

//这个是基于我想法, 以Facebook为例

var unifyAccount = function(options){
  var user = Meteor.users.findOne(Meteor.userId());
  if(user.services.facebook == null){
    Meteor.users.update(
      {_id: Meteor.userId()},
      {$set: {'services.facebook': options.facebook}}
    );
  };
};


//出现的问题在于, 开发者不一定添加accounts packages, 需要修改的地方反而在于那里, 比较烦. 


//for password, we can just write to the password package