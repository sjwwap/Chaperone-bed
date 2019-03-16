exports.install = function (Vue, options) {

  // 获取openid
  Vue.prototype.getCookie = function (name) {
    let arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) return unescape(arr[2]);
    return null;
  }


  // 更改cookie
  Vue.prototype.setCookie = function (name, value, day) {
        var Days = day;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days*24*60*60*1000);
        document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
  }



  // 微信扫一扫方法
  Vue.prototype.sys = function () {
    this.sysBut = true
    var $this = this
    this.$http.get('/palladium/inter/util/interscan?openid=' + this.openId)
      .then(function (response) {
        $this.noncestr = response.data.data[0].noncestr;
        $this.signature = response.data.data[0].signature;
        $this.timestamp = response.data.data[0].timestamp;
        $this.ticket = response.data.data[0].ticket;
        $this.appid = response.data.data[0].appid;
        wx.config({
          debug: false,
          appId: $this.appid,
          timestamp: $this.timestamp,
          nonceStr: $this.noncestr,
          signature: $this.signature,
          jsApiList: ['checkJsApi', 'scanQRCode']
        })
        wx.ready(function () {
          setTimeout(function () {
            $this.sysBut = false
          }, 3000);
          wx.scanQRCode({
            needResult: 1,
            scanType: ["qrCode", "barCode"], 
            success: function (res) {
              var result = res.resultStr;
              var para = result.split('?')[1]
              var str = para.substr(1);
              var strs = str.split("&");
              strs[0].split("=")[1];
              var code = strs[0].split("=")[1];
              $this.$router.push({
                name: "UsePro",
                params: {
                  codenum: code,
                }
              });
            }
          });
        });
        wx.error(function (res) {
          // 签名失败
          console.log("签名失败")
        });
      })
      .catch(function (error) {
        console.log("签名接口请求失败")
      })
  }

  // 微信定位方法
  Vue.prototype.position = function () {
    this.Msg = "定位中."
    this.loadingState = false
    var $this = this
    this.$http.get('/palladium/inter/util/interscan?openid=' + this.openId)
      .then(function (response) {
        console.log(response)
        $this.noncestr = response.data.data[0].noncestr;
        $this.signature = response.data.data[0].signature;
        $this.timestamp = response.data.data[0].timestamp;
        $this.ticket = response.data.data[0].ticket;
        $this.appid = response.data.data[0].appid;
        wx.config({
          debug: false,
          appId: $this.appid,
          timestamp: $this.timestamp,
          nonceStr: $this.noncestr,
          signature: $this.signature,
          jsApiList: ['checkJsApi', 'scanQRCode', 'getLocation']
        })
        wx.ready(function () {
          wx.getLocation({
            type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: function (res) {
              var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
              var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
              var speed = res.speed; // 速度，以米/每秒计
              var accuracy = res.accuracy; // 位置精度
              $this.longitude = longitude
              $this.latitude = latitude
              // wgs84坐标转换
              var x = $this.longitude
              var y = $this.latitude
              var ggPoint = new BMap.Point(x, y);
              var convertor = new BMap.Convertor();
              //坐标转换完之后的回调函数
              translateCallback = function (data) {
                for (var i = 0; i < data.points.length; i++) {
                  var newPoint = data.points[i];
                  $this.longitude = newPoint.lng
                  $this.latitude = newPoint.lat
                }
              }
              var convertor = new BMap.Convertor();
              var pointArr = [];
              pointArr.push(ggPoint);
              convertor.translate(pointArr, 1, 5, translateCallback);
              // 关闭loading
              $this.loadingState = false
              var timestamp = Date.parse(new Date());
              $this.dw = timestamp
            }
          });
        });
        wx.error(function (res) {
          // 签名失败
          console.log("签名失败")
        });
      })
      .catch(function (error) {
        console.log("签名接口请求失败")
      })
  }


  // 封装上传图片
  Vue.prototype.uploadImg = function (parametric) {
    var thisObj={
        maxWidth:parametric.maxNum||680,
        rate:parametric.rate||0.8,
        className:parametric.className||this,
        index:parametric.index||0,
        callback:parametric.callback||function(){alert("No File")}
      }
        var indexValue = thisObj.index
        var className = thisObj.className
        className.on("change",function(e){
        if($(this).val()==""){
            return;
        }
        var _this=this;
        var file=this.files[0];
        var reader0=new FileReader();
        var compressBas;reader0.readAsDataURL(file);
        reader0.onload=function(e){
            var dataUrl=this.result;
            var fileType=file.type;
            var image=new Image();
            image.src=dataUrl;
    image.onload=function(e){
        var width=image.width,height=image.height;
        var scale=width/height;
        var canvas=document.createElement("canvas");
        var ctx=canvas.getContext('2d');
        ctx.clearRect(0,0,canvas.width,canvas.height);
        if(width-height>=0){
            width1=thisObj.maxWidth;
            height1=parseInt(width1/scale);
            if(width>=width1){
                canvas.width=width1;
                canvas.height=height1;
                ctx.drawImage(image,0,0,width1,height1);
            }else{
                canvas.width=width;
                canvas.height=height;
                ctx.drawImage(image,0,0,width,height);
            }}else{
                scale=height/width;
                height1=thisObj.maxWidth;
                width1=parseInt(height1/scale);
                if(height>=height1){
                    canvas.width=width1;
                    canvas.height=height1;ctx.drawImage(image,0,0,width1,height1);
                }else{
                    canvas.width=width;
                    canvas.height=height;
                    ctx.drawImage(image,0,0,width,height);
                }}
                var cropStr=canvas.toDataURL("image/jpeg",thisObj.rate);
                thisObj.callback(cropStr,className,indexValue);}}}
            )
          }





  // cook存取
  //   function getCookie(key){
  //     var arr1 = document.cookie.split("; ");
  //     for(var i = 0; i < arr1.length; i++){
  //         var arr2 = arr1[i].split("=");
  //         if(arr2[0] == key){
  //             return decodeURIComponent(arr2[1]);
  //         }
  //     }
  // }

  // 存入cookie票据
  //   function setCookie(key,value,d){
  //     if(d === undefined){
  //         document.cookie = encodeURIComponent(key) + "=" + encodeURIComponent(value);
  //         alert(1)
  //     }else{
  //         document.cookie = encodeURIComponent(key) + "=" + encodeURIComponent(value) + ";max-age=" + (d*60*60*24);   
  //         alert(1)    
  //     }
  // }

  // 读取cookie中的token
  // Vue.prototype.getCookie = function (key){

  //     var arr1 = document.cookie.split("; ");
  //     for(var i = 0; i < arr1.length; i++){
  //         var arr2 = arr1[i].split("=");
  //         if(arr2[0] == key){
  //             return decodeURIComponent(arr2[1]);
  //         }
  //     }
  // }

  // 刷新token
  // Vue.prototype.timeTask=setInterval(function(){
  //     var date=new Date();
  //     var h=date.getHours();
  //     var m=date.getMinutes();
  //     var s=date.getSeconds();
  //     if(h==12&&m==0&&s==0){
  //          callFunction();                                                         
  //     }
  // },1000);
  // function callFunction(){
  //     alert(1);
  // }

}
