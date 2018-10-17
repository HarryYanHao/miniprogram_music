const innerAudioContext = wx.getBackgroundAudioManager();


Page({
  data: { // 参与页面渲染的数据
    logs: [],
    mode: '',
    music_image:'',
    music_src: '',
    music_name: '',
    music_icon:[{src:'../../assets/icon/play.png',event:'play'},{src:'../../assets/icon/like.png',event:'like'},{src:'../../assets/icon/trash.png',event:'trash'},{src:'../../assets/icon/next.png',event:'next'}],
    extra_info: '',
    avatar_url:'../../assets/icon/avatar.png',
    nick_name:'陌生人',
    disable:false,
    openid: null
  },
  onReady(e){
  	//this.music_src = 'http://music.163.com/song/media/outer/url?id=209326.mp3'
  	var user = wx.getStorageSync('user_obj')
  	var user_info = wx.getStorageSync('user_info_obj')
  	if(user){
  		this.setData({'nick_name':user_info.nickName,
  			'avatar_url':user_info.avatarUrl,
  			'disable':true,'openid':user.openId}) 
  	}
  },
  
  onLoad: function () {
  	var that = this
  	var url = 'http://192.168.15.190:1029/music_info'
  	innerAudioContext.onEnded(function(){
		console.log('song ended')
		that.next();
	})
    // 页面渲染后 执行
    wx.request({
  		url: url, 
  	data: {
  	},
  	header: {
    	'content-type': 'application/json' // 默认值
  	},
  	success (res) {
  		console.log(res.data)
    	that.setData({ mode: "scaleToFill",
  		music_image:res.data.extra_info.pic,
  		music_name:res.data.music_name,
  		music_src:'http://music.163.com/song/media/outer/url?id='+res.data.music_id+'.mp3'
  	})

  	//innerAudioContext.src = 'http://music.163.com/song/media/outer/url?id='+res.data.music_id+'.mp3'
  	innerAudioContext.title = res.data.music_name
  	innerAudioContext.coverImgUrl = res.data.extra_info.pic
  	//innerAudioContext.stop()	
  	
  	}
})
  	
    console.log('this is music page')
  },
  onHide: function(){
  	console.log('page hide')
  },
  play: function(){
  	this.setData({
      'music_icon[0].src':'../../assets/icon/pause.png',
      'music_icon[0].event':'pause'
    })
    if(!innerAudioContext.src){
    	innerAudioContext.src = this.data.music_src
    }else{
    	innerAudioContext.play();
    }
  	console.log('play event')
  },
  pause: function(){
  	innerAudioContext.pause();
  	this.setData({
      'music_icon[0].src':'../../assets/icon/play.png',
      'music_icon[0].event':'play'
    })	
    console.log('pause event')
  },
  next: function(){
  	 var that=this;
  	 wx.request({
  		url: 'http://192.168.15.190:1029/music_info', 
  	data: {
  	},
  	header: {
    	'content-type': 'application/json' // 默认值
  	},
  	success (res) {
    	console.log(res.data)
    	that.setData({ mode: "scaleToFill",
  		music_image:res.data.extra_info.pic,
  		music_name:res.data.music_name,
  		music_src:'http://music.163.com/song/media/outer/url?id='+res.data.music_id+'.mp3',
  	    'music_icon[0].src':'../../assets/icon/pause.png',
      	'music_icon[0].event':'pause'
  		})
  		innerAudioContext.src = 'http://music.163.com/song/media/outer/url?id='+res.data.music_id+'.mp3'
  		innerAudioContext.title = res.data.music_name
  		innerAudioContext.coverImgUrl = res.data.extra_info.pic
  		//innerAudioContext.play()
  	}	

		})
	},
	like: function(){
		var that = this;
		if(that.openid){
			console.log('like event')
		}else{
			wx.showToast({
				'title':'用户未登陆',
				'image':'../../assets/icon/info.png',

			})
		}
	},
	trash: function(){
		var that = this;
		if(that.openid){
			console.log('trash event')
		}else{
			wx.showToast({
				'title':'用户未登陆',
				'image':'../../assets/icon/info.png',

			})
		}
	},
  bindGetUserInfo(e) {
		var that = this
       console.log(e)
      if (e.detail.rawData){

        //用户按了允许授权按钮
     	var rawData = e.detail.rawData
		var rawData = JSON.parse(rawData)
		wx.setStorageSync('user_info_obj', rawData);//存储用户头像等数据  
		this.setData({nick_name:rawData.nickName,avatar_url:rawData.avatarUrl})
		
		
        wx.login({
        	success:function(r){
        		var app = getApp()
				var d= app.globalData;//这里存储了appid、secret、token串 
        		var l='https://api.weixin.qq.com/sns/jscode2session?appid='+d.appid+'&secret='+d.secret+'&js_code='+r.code+'&grant_type=authorization_code'; 
        		wx.request({  
            		url: l,  
            		data: {},  
            		method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
         		 // header: {}, // 设置请求的 header  
            		success: function(res){ 
                	var obj={};
                	obj.openid=res.data.openid;  
                	obj.expires_in=Date.now()+res.data.expires_in;  
                	console.log(obj);
                	wx.setStorageSync('user_obj', obj);//存储openid  
                }  
            });
        	}
        })

        that.setData({disable:true})
        console.log('用户按了允许授权按钮')
      } else {
        //用户按了拒绝按钮
        console.log('用户按了拒绝按钮')
      }
    }


})