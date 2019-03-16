<template>
  <div class="OrderDetails">
    <div v-wechat-title="$route.meta.title"></div>
    <div class="OrderDetailsBox">
      <div class="orderDiv">
        <img :src="'../../'+orderDetails.productPicture" onerror="javascript:this.src='static/img/noimg.png';this.onerror = null" width="50px">
        <p>{{orderDetails.productName}}</p>
        <p v-if="orderDetails.statu == 2">-{{orderDetails.money}}</p>
        <p v-else></p>
      </div>
      <div class="orderDetailsUl">
        <li>
          <em>当前状态</em>
          <em v-if="orderDetails.statu == 0">已创建</em>
          <em v-if="orderDetails.statu == 1">进行中</em>
          <em v-if="orderDetails.statu == 2">已完成</em>
        </li>
        <li>
          <em>商品名称</em><em>{{orderDetails.productName}}</em>
        </li>
        <!-- <li v-if="this.$route.params.orderTimeStatu == 1">
          <em>租赁类型</em><em>短期租赁</em>
        </li>
        <li v-if="this.$route.params.orderTimeStatu == 0">
          <em>租赁类型</em><em>长期租赁</em>
        </li> -->
        <li v-if="orderDetails.statu == 2">
          <em>支付时间</em><em>{{orderDetails.createTime}}</em>
        </li>
        <li v-else>
          <em>创建时间</em><em>{{orderDetails.createTime}}</em>
        </li>
        <li>
          <em>支付方式</em><em v-if="orderDetails.manyType == 0">微信</em><em v-if="orderDetails.manyType == 1">支付宝</em>
        </li>
        <li>
          <em>设备编号</em><em>{{orderDetails.deviceCode}}</em>
        </li>
        <li>
          <em>端口号</em><em>{{orderDetails.devicePort}}</em>
        </li>
        <li>
          <em>订单编号</em><em>{{this.$route.params.orderNo}}</em>
        </li>
        <li v-if="orderDetails.transactionId > 0">
          <em>消费流水</em><em>{{orderDetails.transactionId}}</em>
        </li>
        <li v-else>
        </li>
        <mu-button
            :disabled="returnstate"
            color="primary"
            @click="returnProject"
            full-width
            large
            round
            v-if="!this.$route.params.end"
          >立即还床</mu-button>
      </div>
      <Loading
      v-if="loadinglook"
      :message="msg"
    ></Loading>

    <!-- 借出/归还成功提示 -->
      <mu-dialog
        title="还床成功！" width="640px" max-width="90%" dialog-class="styleLoanSuccDiong" :open.sync="LoanSuccDiong" :overlay-close="false">
        <div class="LoanSuccDiongBox">
          <div class="round">
             <p>{{openCode}}</p>
            {{openPort}}</div>
          <p>请前往{{openPort}}号端口{{operationState}}您的陪护床</p>
        </div>
        <div class="rentalClose">
          <mu-button
            color="primary"
            large
            @click="openLoanSuccClose"
          >我知道了</mu-button>
        </div>
        <br />
      </mu-dialog>
    </div>
  </div>
</template>

<script>
import Loading from "@/components/loading";
export default {
  name: 'order',
  components: { Loading },
  data () {
    return {
      gopaystate:false,
      orderDetails:[],

      msg:"请稍后.",
      
      // 按钮
      returnstate:false,

      // loading
      loadinglook: false,

      orderId:"",
      // 接床端口
      proId:null,

      jxy:0,

      // 用户信息
      openId:"",
      userId:"",

      // 出借成功弹窗
      LoanSuccDiong:false,
      operationState:"领取/归还",
      openPort:"✔",
      openCode:"成功提示",

      // 支付签名
      signType: "",
      packages: "",
      paySign: "",
      paytimeStamp: "",
      paynonceStr: "",
      appId: "",
      securityOrderNo: "",
      rechargeOrderNo: ""
      
    }
  },
  watch: {
    jxy: {
      deep: true,
      handler(val) {
        let $this = this;
        const url = "/palladium/pay/payOrder";
        let postData = this.$qs.stringify({
          userId: $this.userId,
          id: $this.orderId,
          type: 2
        });
        this.$http({
          method: "post",
          url: url,
          data: postData
        }).then(res => {
          const dataArr = res.data.data;
          $this.signType = res.data.data.signType;
          $this.packages = res.data.data.packages;
          $this.paySign = res.data.data.paySign;
          $this.paytimeStamp = res.data.data.timeStamp;
          $this.paynonceStr = res.data.data.nonceStr;
          $this.appId = res.data.data.appId;
          function onBridgeReady() {
            WeixinJSBridge.invoke(
              "getBrandWCPayRequest",
              {
                appId: $this.appId, //公众号名称，由商户传入
                timeStamp: $this.paytimeStamp, //时间戳，自1970年以来的秒数
                nonceStr: $this.paynonceStr, //随机串
                package: $this.packages,
                signType: $this.signType, //微信签名方式：
                paySign: $this.paySign //微信签名
              },
              function(res) {
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                  // 使用以上方式判断前端返回,微信团队郑重提示：
                  //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                  $this.LoanSuccDiong = true
                  $this.operationState = "归还"
                  // $this.$router.push({
                  //   name:"Home"
                  // })
                } else {
                  $this.returnstate = false;
                }
              }
            );
          }

          if (typeof WeixinJSBridge == "undefined") {
            if (document.addEventListener) {
              document.addEventListener(
                "WeixinJSBridgeReady",
                onBridgeReady,
                false
              );
            } else if (document.attachEvent) {
              document.attachEvent("WeixinJSBridgeReady", onBridgeReady);
              document.attachEvent("onWeixinJSBridgeReady", onBridgeReady);
            }
          } else {
            onBridgeReady();
          }
        });
      }
    }
  },
  created(){

      this.openId = this.getCookie("openId")
      this.userId = this.getCookie("userId")

    let $this = this
     this.$http.get('/palladium/inter/consumRecord/selectOneRecordByOrderId?orderNo='+ this.$route.params.orderNo)
                    .then(function (response) {
                      console.log(response)
                      $this.orderDetails = response.data.data
                      $this.proId = response.data.data.devicePort
                      $this.orderId = response.data.data.idd
                      $this.openPort = response.data.data.devicePort
                      $this.openCode = response.data.data.deviceCode
                      
                    })
                    .catch(function (error) {
                    })


      function WebSocketTest() {
      if ("WebSocket" in window) {
        //  alert("您的浏览器支持 WebSocket!");
        // 打开一个 web socket
        var ws = new WebSocket(
          "ws://pd.haokuaichong.cn/palladium/inter/chargeSocket"
        );

        ws.onopen = function() {
          ws.send("user:" + $this.openId);
        };

        ws.onmessage = function(evt) {
          
          //  2 还床成功   3 还床失败
            if (evt.data == 2) {
            var timestamps = Date.parse(new Date());
            $this.jxy = timestamps;
            $this.loadinglook = false;
          } else if (evt.data == 3) {
            alert("还床失败！")
            $this.$router.push({
                    name:"Order"
                  })
          }else{
            alert("未知错误！")
          }
        };

        ws.onclose = function() {
          // 关闭 websocket
          // alert("连接已关闭...");
        };
      } else {
        // 浏览器不支持 WebSocket
        alert("您的浏览器不支持 WebSocket!");
      }
    }

    WebSocketTest();




  },
  methods:{

    // 关闭出借成功
    openLoanSuccClose(){
        this.LoanSuccDiong = false
        this.$router.push({ name: "Home" });
    },


      // 还床
    returnProject() {
      if (this.isEnd == 0) {
        alert("当前暂未到还床时间！")
      } else {
      this.returnstate = true;
      this.loadinglook = true;
      let $this = this;
      let mywloadingTime = setTimeout(function() {
        alert("网络错误，请重试！");
        $this.returnstate = false;
        $this.loadinglook = false;
      }, 8000);
      const url = "/palladium/inter/charge/endUse";
      let postData = this.$qs.stringify({
        orderId: $this.orderId,
        deviceCode: $this.orderDetails.deviceCode
      });
      this.$http({
        method: "post",
        url: url,
        data: postData
      }).then(res => {
        if (res.data.code == 200) {
          clearTimeout(mywloadingTime);
        } else {
          alert(res.data.msg);
          this.$router.push({
            name: "Order",
            params: {}
          });
        }
      });
    }
  }
}
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.OrderDetails{position: absolute;top:0;bottom:0;left:0;right:0;background:#f6f6f6;display: flex;flex-direction: column;}
.OrderDetailsBox{width:100%;height:100%;position: relative;overflow: hidden;overflow-y: auto; background: #fff;}
.orderDiv{border-bottom: 1px solid #eeeeee; text-align: center;padding-bottom: 2rem;}
.orderDiv p{font-size: 1rem;}
.orderDiv img{margin-top: 4rem;}
.orderDetailsUl{padding: 1rem .8rem;}
.orderDetailsUl li{display: flex;justify-content: space-between;padding: .6rem 0;}
.orderDetailsUl li em{font-size: .8rem;}


/* 出借成功弹窗 */
.LoanSuccDiongBox{position: relative;display: flex;flex-direction: column;text-align: center;}
.LoanSuccDiongBox i.close{position: absolute;top: -3rem;right: -.7rem;z-index: 999;font-size: 1.6rem;}
.LoanSuccDiongBox div.round{width: 7rem;height: 7rem;background: #fff;box-shadow: 0 0 20px #acc2ff; border-radius: 100%;margin:1.2rem auto;text-align: center;font-size: 2.2rem;color: #3166fd;animation:mymove 2s infinite linear;line-height: .4rem;}
.LoanSuccDiongBox div.round p{font-size: .9rem;color: #333;margin-top: .4rem;margin-bottom: 0;}
@keyframes mymove{
  0% {box-shadow: 0 0 20px #acc2ff;}
  50% {box-shadow: 0 0 20px #fff;}
  100% {box-shadow: 0 0 20px #acc2ff;}
  }
.rentalClose{display: flex; justify-content:center;}
.LoanSuccDiongBox p{line-height: 4rem;font-size: .9rem;}
</style>


