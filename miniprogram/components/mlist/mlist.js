// components/mlist/mlist.js
const app = getApp()
const host = app.globalData.host
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    image_url:{
      type:String,
      value:'',
    },
    music_name:{
      type:String,
      value:'',
    },
    author:{
      type:String,
      value:'',
    },
    album:{
      type:String,
      value:'',
    },
    itemHeight:{
      type:String,
      value:0,
    },
    songId:{
      type:String,
      value:0,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    width:0,
    icon_hidden:true,
    show:1,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    itemScrollLower: function(e){
    this.setData({icon_hidden:false})
    },
    itemScrollUpper: function(e){
    this.setData({icon_hidden:true})
    },
    cancel: function(e){
    var that = this
    var song_id=e.currentTarget.dataset['id'];
    var user_obj = wx.getStorageSync('user_obj')
    var openid = user_obj.openid
    var cancel_url = host+'/cancel_like_trash'
    wx.request({
          url:cancel_url,
          method: 'POST',
          header: {'Content-Type': 'application/x-www-form-urlencoded'}, // 设置请求的 header 
          data:{openid:openid, 
            song_id:song_id},
          success: function(res){
            console.log(res);
            if(res.data.data){
              that.setData({show:0});
            }
          }
        }); 

  },
    tapPlay: function(e){
      var tab_active = app.globalData.tab_active
      if(this.data.icon_hidden && tab_active==0){
        var song_id=e.currentTarget.dataset['id']
      app.globalData.song_id = song_id
      wx.switchTab({
        url:"../../pages/music/music"
      });
    }
      }
      
  },
  attached: function(){
    var that = this
    wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    width: res.windowWidth,

                });
            }
        });
  },
  
})
