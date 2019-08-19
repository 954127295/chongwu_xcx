Page({ 
      data: {
        markers: [],
        move:true,
        iem:null,
        setInter:'',
        pack:1,//重复心跳重连检测
        battery:100,
        gps:false,
      },
    onLoad: function() { 
        // this.linkSocket()
        const that = this;
        var iem = wx.getStorageSync("iem");
        if(iem > 0){
            that.setData({iem:iem});
        }else{
            var openid = wx.getStorageSync('openid');
            console.log("openid",openid);
            if(!openid){
                wx.login({
                    success:function(res){
                      console.log("uuuuuuuuuuuuu",res)
                      var obj = {act:"login",code:res.code};
                      that.getUser(obj);
                    }
                })
            }else{
                var obj = {act:"login",openid:openid};
                that.getUser(obj);
            }
        }

        var obj = {act:"get",imei:that.data.iem,pack:"gps"};
        that.changeGps(obj);

        wx.connectSocket({
          url: 'wss://www.chongwu-family.xyz:9603'
        })

        wx.onSocketOpen(function(res) {
        console.log("sssssssssss",iem)
            if(that.data.setInter){
                that.endSetInter();
                that.setData({pack:1});
            }
            console.log("iemssssss",that.data.iem)
            wx.sendSocketMessage({
              data:that.data.iem
            })
        })
        wx.onSocketMessage(function (data) {
            console.log("onSocketMessage ", data.data)
            var result = JSON.parse(data.data);
            console.log("onSocketMessage ", result.xpoint);
            if(result.ypoint && result.xpoint){
                that.setData({
                    markers:[{
                        iconPath: "../../img/marker_red.png",
                        id: 0,
                        latitude: result.ypoint,
                        longitude: result.xpoint,
                        width: 18,
                        height: 20
                    }],
                    battery:result.battery
                });
                // if(that.data.move){
                    that.setData({ 
                        latitude: result.ypoint,
                        longitude: result.xpoint,
                        move: false
                    }); 
                // }
            }
        })
        wx.onSocketError(function(data){
            console.log('WebSocket连接打开失败')
            if(that.data.pack == 1){
                that.reconnect();
            }
        })
        wx.onSocketClose(function(data){
            console.log('WebSocket关闭了')
            if(that.data.pack == 1){
                that.reconnect();
            }
        })
    },
    gpsChange: function (e){
        var that = this;
        var iem = that.data.iem;
        var egps = e.detail.value;
        if(egps){
            console.log('switch1 发生 change 事件，携带值为', e.detail.value)
            var pack = 'gps,0#';
        }else{
            var pack = 'gps,3#';
        }
        var obj = {act:"set",imei:iem,pack:pack};
        console.log(obj);
        that.changeGps(obj);
    },
    reconnect:function(){
        var that = this;
        that.setData({pack:2});
        that.data.setInter = setInterval(function () {
            console.log("aaa","dd")
            wx.connectSocket({
              url: 'wss://www.chongwu-family.xyz:9603'
            })
        }, 2500);
    },
    endSetInter:function(){
        var that = this;
        //清除计时器  即清除setInter
        clearInterval(that.data.setInter);
    },
	getUser:function(obj){
        var that = this;
		wx.request({
		url:'https://api.chongwu-family.xyz/login',
		header:{'Content-Type': 'application/x-www-form-urlencoded'},
		data:obj,
		method:"post",
        async:false,
		dataType:"json",
		success:function(res){
		  // wx.setStorageSync('uid',res.data.uid);
		  // that.setData({"uid":res.data.uid});
		  const result = res.data;
		  wx.setStorageSync('openid',result.openid);
		  if(result.state == "no"){
			console.log("iiiiiiiiiiiiiii","未登录，请重新绑定")
				wx.switchTab({
					url: '../login/index'
				})
		  }else if(result.state == "yes"){
            console.log("resultiem",result.iem);
            wx.setStorageSync("iem",result.iem);
            that.setData({iem:result.iem});
          }
		}
	  })
	},
    changeGps:function(obj){
        console.log(obj);
        var that = this;
        wx.request({
            url:'https://api.chongwu-family.xyz/set',
            header:{'Content-Type': 'application/x-www-form-urlencoded'},
            data:obj,
            method:"post",
            dataType:"json",
            success:function(res){
              console.log("ffffffff",res)
              if(res.data.result == '0'){
                that.setData({"gps":"checked"});
              }else if(res.data.result == '3'){
                    that.setData({"gps":false});
                }
            }
        })
    }




        // wx.vibrateLong();
        // // 新建百度地图对象 
        // var BMap = new bmap.BMapWX({ 
        //     ak: 'qGN1G3ngflM2NQo4iL1PlUa0FyekGaVM' 
        // }); 
        // var fail = function(data) { 
        //     console.log(data) 
        // }; 
    //     var success = function(data) { 
    //         wxMarkerData = data.wxMarkerData; 
    //         console.log("aaaaaa",wxMarkerData[0].latitude+','+wxMarkerData[0].longitude )
    //         that.setData({ 
    //             markers: wxMarkerData 
    //         }); 
    //         that.setData({ 
    //             latitude: wxMarkerData[0].latitude 
    //         }); 
    //         that.setData({ 
    //             longitude: wxMarkerData[0].longitude 
    //         }); 
    //     } 
    //     // 发起regeocoding检索请求 
    //     BMap.regeocoding({ 
    //         fail: fail, 
    //         success: success, 
    //         iconPath: '../../img/marker_red.png', 
    //         iconTapPath: '../../img/marker_red.png' 
    //     }); 
    // }, 
    // showSearchInfo: function(data, i) { 
    //     var that = this; 
    //     that.setData({ 
    //         rgcData: { 
    //             address: '地址：' + data[i].address + '\n', 
    //             desc: '描述：' + data[i].desc + '\n', 
    //             business: '商圈：' + data[i].business 
    //         } 
    //     }); 
    // linkSocket(){
    //     let that = this
    //     wx.connectSocket({
    //         url: 'wss://www.chongwu-family.xyz:9603',
    //         success() {
    //             console.log('连接成功')
    //             that.initEventHandle()
    //         }
    //     })
    // },
    // initEventHandle(){
    //     let that = this
    //     let heartCheck = {
    //       timeout: 10000, 
    //       timeoutObj: null,
    //       serverTimeoutObj: null,
    //       reset: function () {
    //         clearTimeout(this.timeoutObj);
    //         clearTimeout(this.serverTimeoutObj);
    //         return this;
    //       },
    //       start: function () {
    //         this.timeoutObj = setTimeout(()=> {
    //           console.log("发送ping");
    //           wx.sendSocketMessage({
    //             data:"352544071751714",
    //             // success(){
    //             //   console.log("发送ping成功");
    //             // }
    //           });
    //           this.serverTimeoutObj = setTimeout(() =>{
    //             wx.closeSocket(); 
    //           }, this.timeout);
    //         }, this.timeout);
    //       }
    //     };
    //     wx.onSocketMessage((res) => {
    //       //收到消息
    //         // console.log("onSocketMessage ", data.data)
    //         var result = JSON.parse(res.data);
    //         console.log("onSocketMessage ", result.xpoint);
    //         // that.setData({ 
    //         //     markers: wxMarkerData 
    //         // }); 
    //         if(result.ypoint && result.xpoint){
    //             that.setData({
    //                 markers:[{
    //                     iconPath: "../../img/marker_red.png",
    //                     id: 0,
    //                     latitude: result.ypoint,
    //                     longitude: result.xpoint,
    //                     width: 18,
    //                     height: 20
    //                 }]
    //             });
    //             that.setData({ 
    //                 latitude: result.ypoint,
    //                 longitude: result.xpoint,
    //                 move: false
    //             }); 
    //             // if(that.data.move){
    //             //     that.setData({ 
    //             //         latitude: result.ypoint,
    //             //         longitude: result.xpoint,
    //             //         move: false
    //             //     }); 
    //             // }
    //         }
    //         heartCheck.reset().start()
    //       // if (res.data == "pong"){
    //       //   heartCheck.reset().start()
    //       // }else{
    //       // }
    //     })
    //     wx.onSocketOpen(()=>{
    //         console.log('WebSocket连接打开')
    //         heartCheck.reset().start()
    //     })
    //     wx.onSocketError((res)=>{ 
    //         console.log('WebSocket连接打开失败')
    //         this.reconnect()
    //     })
    //     wx.onSocketClose((res)=> {
    //         console.log('WebSocket 已关闭！')
    //         this.reconnect()
    //     })
    // },
    // reconnect(){
    //     if (this.lockReconnect) return;
    //         this.lockReconnect = true;
    //         clearTimeout(this.timer)
    //         if (this.data.limit<12){
    //             this.timer = setTimeout(() => {
    //             this.linkSocket();
    //             this.lockReconnect = false;
    //         }, 5000);
    //         this.setData({
    //             limit: this.data.limit+1
    //         })
    //     }
    // },
})