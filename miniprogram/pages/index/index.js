var plugin = requirePlugin("myPlugin")
Page({
  onLoad: function() {
  	wx.getLocation({
  		type: 'wgs84',
  		success: (res) => {
    	var latitude = res.latitude // 纬度
    	var longitude = res.longitude // 经度
  	}
})
    plugin.getData()
  },
  clickMe:function(){
  	this.setData({msg:"Hello world ! "})
  },
  scan:function(){
  	wx.navigateTo({
    url:'../logs/logs?id=1&page=4',  //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
    success:function(){},        //成功后的回调；
    fail:function(){},          //失败后的回调；
    complete:function(){}      //结束后的回调(成功，失败都会执行)
})
  },

})