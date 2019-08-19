Page({
	data: {
		iem:null
	},
	onLoad: function () {
		var that = this;
		var openid = wx.getStorageSync('openid');
		if(!openid){
			wx.login({
		        success:function(res){
					var obj = {act:"login",code:res.code};
					that.getUser(obj);
		        }
		    })
		}else{
			var obj = {act:"login",openid:openid};
			that.getUser(obj);
		}
	},
	login:function(e){
		var that = this;
		var iem = that.data.iem;
		var openid = wx.getStorageSync('openid');
		var obj = {act:"register",openid:openid,iem:iem};
		that.getUser(obj);
	},
	iemInput:function(e){
		var that = this;
		var iem = e.detail.value;
		that.setData({
			iem:iem
		});
	},
	getUser:function(obj){
	    var that = this;
		console.log("uuuuuuuuuuuuu",obj)
		wx.request({
			url:'https://api.chongwu-family.xyz/login',
			header:{'Content-Type': 'application/x-www-form-urlencoded'},
			data:obj,
			method:"post",
			dataType:"json",
			success:function(res){
				const result = res.data;
				wx.setStorageSync('openid',result.openid);
				if(result.state == "yes"){
					if(result.iem){
						wx.setStorageSync("iem",result.iem);
						that.setData({iem:result.iem});
					}
					if(result.openid){
						wx.setStorageSync("openid",result.openid);
					}
					if(obj.act == "register"){
						wx.switchTab({
							url: '../index/index',
							success: function (e) {
								var page = getCurrentPages().pop();
								if (page == undefined || page == null) return;
								page.onLoad();
							}
						})
					}
				}
			}
		})
	}
})
