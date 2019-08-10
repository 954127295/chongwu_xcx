Page({ 
      data: {
        markers: [],
        move:true,
      },
    onLoad: function() { 
        // this.linkSocket()
        const that = this;
        wx.connectSocket({
          url: 'wss://www.chongwu-family.xyz:9603'
        })

        wx.onSocketOpen(function(res) {
            wx.sendSocketMessage({
              data:"352544071751714"
            })
        })
        wx.onSocketMessage(function (data) {
            // console.log("onSocketMessage ", data.data)
            var result = JSON.parse(data.data);
            console.log("onSocketMessage ", result.xpoint);
            // that.setData({ 
            //     markers: wxMarkerData 
            // }); 
            if(result.ypoint && result.xpoint){
                that.setData({
                    markers:[{
                        iconPath: "../../img/marker_red.png",
                        id: 0,
                        latitude: result.ypoint,
                        longitude: result.xpoint,
                        width: 18,
                        height: 20
                    }]
                });
                if(that.data.move){
                    that.setData({ 
                        latitude: result.ypoint,
                        longitude: result.xpoint,
                        move: false
                    }); 
                }
            }
        })




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
    },
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