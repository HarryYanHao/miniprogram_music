var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const app = getApp()
const host = app.globalData.host
Page({
  data: { // 参与页面渲染的数据
    music_arr:[{
    image_url:'',
    music_name:'',
    author:'',
    album:''}],
    music_trash_arr:[{
    image_url:'',
    music_name:'',
    author:'',
    album:''}],
    tabs: ["喜爱", "垃圾桶"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    openid:null,
    scrollHeight:0,
    loading_hidden:true,
    button_loading_hidden:true,
    like_page:1,
    count:0,
    item_height:0,
    tab_hidden:false,
  },
  onLoad: function () {
  	var user = wx.getStorageSync('user_obj')
  	var openid = user.openid
  	var that = this
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
                    scrollHeight: res.windowHeight,
                    item_height:(res.windowHeight-50)/6,
                    openid:openid

                });
            }
        });
        
    // 页面渲染后 执行
    console.log('this is lists page')

  },
  onShow: function(e){
	var user = wx.getStorageSync('user_obj')
  	var openid = user.openid
  	var that = this
  	var get_likeList_url = host+'/get_like_list'
        wx.request({
        	url:get_likeList_url,
        	data:{openid:openid},
        	success: function(res){
        		console.log(res);
        		if(res.data){
        			that.setData({music_arr:res.data.data.data,count:res.data.data.count,openid:openid});
        		}
        	}
        });
  },
  tabClick: function (e) {
  	var user = wx.getStorageSync('user_obj')
  	var openid = user.openid
  	app.globalData.tab_active = e.currentTarget.id
  	var that = this
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
        if(this.data.activeIndex == 1){
        	var get_likeList_url = host+'/get_trash_list'
        	wx.request({
        	url:get_likeList_url,
        	data:{openid:openid},
        	success: function(res){
        		console.log(res);
        		if(res.data){
        			that.setData({music_trash_arr:res.data.data.data,count:res.data.data.count,openid:openid});
        		}
        	}
        });
        }
    },

  upper: function(e) {
  	var that = this
  	console.log("上拉刷新了....")
if (!that.data.loading_hidden) return
    that.setData({ loading_hidden: false })
    updateRefreshIcon.call(that)
  
        var get_likeList_url = host+'/get_like_list'
        wx.request({
        	url:get_likeList_url,
        	data:{openid:this.data.openid},
        	success: function(res){
        		if(res.data){
        			that.setData({music_arr:res.data.data.data,loading_hidden:true,tab_hidden:false});
        		}
        	}
        });

    
  },
  lower: function(e) {
	var that = this
    if (!that.data.button_loading_hidden) return
    if(that.data.music_arr.length != that.data.count){
    that.setData({ button_loading_hidden: false })
    updateRefreshIcon.call(that)
    var page = that.data.like_page+1;
    var get_likeList_url = host+'/get_like_list'
    
    	wx.request({
       	url:get_likeList_url,
        data:{openid:that.data.openid,
        page:page},
        success: function(res){
        	if(res.data){
        		var music_arr = that.data.music_arr.concat(res.data.data.data)
        		that.setData({music_arr:music_arr,button_loading_hidden:true,page:page});
        	}
        }
      });
    }

  },
  scroll: function(e) {
  	console.log(e)
  	var that = this 
  	that.setData({'tab_hidden':true})
  	
  },
  onPullDownRefresh: function () {
        console.log("下拉")
    },
  onReachBottom: function () {
        console.log("上拉");
    }
  

})
function updateRefreshIcon() {
    var deg = 0;
    var that = this;
    console.log('旋转开始了.....')
    //创建动画
    var animation = wx.createAnimation({
        duration: 1500
    })
    var timer = setInterval(function () {
        if (that.data.loading_hidden)
            clearInterval(timer)
        animation.rotateZ(deg).step();//在Z轴旋转一个deg角度
        deg += 360
        that.setData({
            refreshAnimation: animation.export()
        })
    }, 500);
}
