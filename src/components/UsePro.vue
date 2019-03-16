<template>
  <div class="usepro">
    <div v-wechat-title="$route.meta.title"></div>
    <div class="useproBox">
      <div class="useproBoxImg">
        <img :src="'../../'+Prodata2[0].productPath" alt="">
      </div>
      <div class="useproBoxLi useproBoxLiBet">
        <em>项目名称：</em><em>{{Prodata2[0].projectName}}</em>
      </div>
      <div class="useproBoxLi useproBoxLiBet">
        <em>项目地点：</em><em>{{Prodata2[0].deviceAddress}}</em>
      </div>
      <div class="useproBoxLi useproBoxLiBet">
        <em>状况介绍：</em><em>本项目端口投放总数{{sumProdata}}台，现可用设备{{freeProdata}}台，已使用{{busyProdata}}台。</em>
      </div>
      <div class="useproBoxLi">
        <em>
          <span>
            <span>使用时间及收费标准</span>
            <div
              class="userProQuest"
              @click="userProExplainDialog"
            >
              <a>使用说明</a><i class="iconfont icon-iconset0143"></i>
            </div>
          </span>
          <p><b>•</b> 租床时间：每日18：00~24：00；</p>
          <p><b>•</b> 还床时间：次日06：00~07：30；</p>
          <p><b>•</b> 收费标准：押金300元/张,计费5元/小时,归还陪护床时退回押金；</p>
          <p><b>•</b> 客服电话：400-120-1120（如有疑问，请致电客服）</p>
        </em>
      </div>
      <br />
      <mu-button color="primary" full-width large round @click="submitDeposit" :disabled="borrowstate">立即借出</mu-button>
      <br /><br />

      <mu-button color="primary" full-width large round :disabled="returnstate" @click="returnProject">立即归还</mu-button>

      <br />
      <br />
      <br />
      <!-- 使用说明弹窗 -->
      <mu-dialog title="共享陪护床使用说明" width="640px" max-width="90%" dialog-class="userProExplainDiong" :open.sync="userProExplain">
        <img
          src="static/img/userpro.png"
          width="100%"
        >
        <div class="userProExplain">
          <h4>共享陪护床注意事项</h4>
          <p><em>•</em> 请您在规定的时间内租借陪护床，非使用期间无法租借；</p>
          <p><em>•</em> 请您按时、对号归还陪护床，并锁好柜门，否则会影响到您的计费与押金退还；</p>
          <p><em>•</em> 试用期间，请妥善保管陪护床，爱惜公共物品；</p>
          <p><em>•</em> 未成年人禁止单独使用陪护床。</p>
        </div>
        <div class="userProExplainClose">
          <mu-button
            color="primary"
            @click="closeUserProExplainDialog"
          >　我知道了　</mu-button>
        </div>
        <br />
      </mu-dialog>

      <!-- 押金提示 -->
      <mu-dialog width="640px" max-width="90%" dialog-class="userProDepositDiong" :open.sync="userProDeposit" fullscreen transition="slide-bottom">
        <div class="userProDeposit">
          <div class="head">温馨提示：资金将直接进入商家账户</div>
          <h4><b><i class="iconfont icon-weixin"></i>　确认付款</b><span class="iconfont icon-quxiao" @click="closeUserProDepositDialog"></span></h4>
          <div class="money">￥{{deposit}}</div>
          <p><em>订单信息</em><em>微信支付{{deposit}}元</em></p>
          <p><em>付款方式</em><em>微信零钱></em></p>
        </div>
        <div class="userProDepositClose">
          <mu-button
            :disabled="gopaystate"
            color="primary"
            @click="UserPropay"
            large
            full-width
            round
          >立即付款</mu-button>
        </div>
        <br />
      </mu-dialog>

      <!-- 租赁提示 -->
      <mu-dialog title="租赁选择" width="640px" max-width="90%" dialog-class="styleRentalDiong" :open.sync="RentalDiong">
      
        <div class="RentalDiongBox">
          <i class="iconfont icon-quxiao close" @click="RentalAClose"></i>
          <h4>尊敬的用户</h4>
          <p><em>长期租赁：</em><span>五天一还，逾期将暂扣押金，且按正常使用计费，还床后系统秒退押金!</span></p>
          <p><em>短期租赁：</em><span>一天一还，逾期将暂扣押金，且按正常使用计费，还床后系统秒退押金!</span></p>
        </div>
        <div class="rentalClose">
          <mu-button
            color="primary"
            large
            @click="openRentalAClose"
          >长期租赁</mu-button>
          <mu-button
            color="primary"
            large
            @click="openRentalBClose"
          >短期租赁</mu-button>
        </div>
        <br />
      </mu-dialog>

      <!-- 借出/归还成功提示 -->
      <mu-dialog
        title="温馨提示！" width="640px" max-width="90%" dialog-class="styleLoanSuccDiong" :open.sync="LoanSuccDiong" :overlay-close="false">
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

    <!-- 设备异常 -->
    <mu-dialog title="提示" width="360" overlay-close="false" :open.sync="unitException">
      {{unitExceptionState}}，请选择其他设备！
      <mu-button
        slot="actions"
        flat
        color="primary"
        @click="closeunitExceptionDialog"
      >确定</mu-button>
    </mu-dialog>
    <Loading
      v-if="loadinglook"
      :message="Msg"
    ></Loading>
    <Waitting v-if="waittinglook"></Waitting>
  </div>
</template>
<script>
import Loading from "@/components/loading";
import Waitting from "@/components/waitting";
export default {
  name: "UsePro",
  components: { Loading, Waitting },
  data() {
    return {
      // 设备状态
      unitExceptionState: "",
      unitException: false,
      // loading
      loadinglook: false,
      waittinglook: false,
      Msg: "请稍后.",
      // 使用说明弹窗
      userProExplain: false,
      userProDeposit: false,
      // 租赁弹窗
      RentalDiong: false,

      // 出借成功弹窗
      LoanSuccDiong:false,
      operationState:"领取/归还",
      openPort:"✔",
      openCode:"成功提示",


      // 提交按钮
      borrowstate: true,
      // 提交按钮2
      returnstate: false,
      // 交押金按钮
      gopaystate: false,

      //是否还有还床端口
      dervidestate:0,

      // 监听还床回调
      jxy: 0,

      // 押金
      deposit:0,

      // 端口号
      Prodata: [],
      sumProdata:0,
      freeProdata:0,
      busyProdata:0,

      // 支付状态
      paystate: 0,
      // 归还状态
      // 扣费类型
      type: "",
      // 项目信息
      Prodata2: [{ projectName: "" }],

      // 是否需要还床
      isEnd: "",

      // 项目Id
      proId: "",
      // 用户信息
      userId: "",
      // 设备编号
      code: "",
      // openId
      openId: "",
      // 端口号
      port: "",
      // 订单编号
      orderId: "",
      // 租赁
      orderTimeStatu:"",

      // 支付签名
      signType: "",
      packages: "",
      paySign: "",
      paytimeStamp: "",
      paynonceStr: "",
      appId: "",
      securityOrderNo: "",
      rechargeOrderNo: ""
    };
  },
  watch: {
    paystate: {
      deep: true,
      handler(val) {
        let $this = this;
        // 监听押金支付状态
        this.Prodata2[0].isDeposit = 0;
      }
    },
    jxy: {
      deep: true,
      handler(val) {
        this.loadinglook = false;

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

          console.log(res);
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
                  $this.returnstate = false;
                  $this.LoanSuccDiong = true
                  $this.operationState = "归还"
                  
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

  created() {
    this.waittinglook = true;
    this.openId = this.getCookie("openId");
    this.userId = this.getCookie("userId");
    this.code = this.$route.params.codenum;

    // this.userId = 114
    // this.code = "B0000001"

    // 判断code
    if (this.code == undefined) {
      this.code = this.$route.params.returncode;
    }

    if (this.code == null) {
      this.$router.push({
        name: "Home",
        params: {}
      });
    }

    // 支付type
    this.type = this.Prodata2[0].isDeposit;
    if (this.type == 0) {
      // 不需要押金
      this.type = 2;
    } else {
      // 需要押金
      this.type = 1;
    }

    // 查询设备编号
    var $this = this;
    this.$http
      .get(
        "/palladium/inter/charge/queryBinDingDevice?code=" +
          this.code +
          "&userId=" +
          this.userId +
          ""
      )
      .then(
        function(response) {
          console.log(response)
          if (response.data.code == 400) {
            $this.unitException = true;
            $this.unitExceptionState = response.data.msg;
          } else {
            $this.Prodata = response.data.data;
            $this.Prodata2 = response.data.data2;
            $this.proId = response.data.data2[0].projectId;
            $this.orderId = response.data.data2[0].orderId;
            $this.isEnd = response.data.data2[0].isEnd;
            $this.deposit = response.data.data2[0].deposit;
            $this.openCode = response.data.data2[0].deviceCode;
            $this.openPort = response.data.data2[0].devicePort;



            // 按钮控制
            for (let i = 0; i < $this.Prodata.length; i++) {
              $this.sumProdata += 1
              if ($this.Prodata[i].state == 0) {
                $this.freeProdata += 1
                $this.borrowstate = false;
              } else if ($this.Prodata[i].state == 1) {
                $this.busyProdata +=1
                $this.dervidestate = 1
              }
            }
            
            // 是否存在还床订单
            if ($this.isEnd == 0) {
              $this.returnstate = true
            }


            // 判断押金
            if (response.data.data2[0].isRequired == 1) {
              $this.paystate = 1;
              $this.securityOrderNo = response.data.data2[0].securityOrderNo;
              $this.rechargeOrderNo = response.data.data2[0].rechargeOrderNo;
            } else {
              $this.paystate = 0;
            }

            // 结束等待
            $this.waittinglook = false;
          }
        }.bind(this)
      )
      .catch(function(error) {
        console.log(error.msg);
      });

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
          //  1 借床成功   2 还床成功   0 借床失败    3 还床失败
          if (evt.data.indexOf(",") == -1) {
            if (event.data == 2) {
            var timestamps = Date.parse(new Date());
            $this.jxy = timestamps;
          } else if (event.data == 3) {
            alert("还床失败！");
            $this.loadinglook = false;
          } else if (event.data == 0) {
            alert("接床失败！");
            $this.loadinglook = false;
          }
          } else {
            $this.loadinglook = false
            $this.LoanSuccDiong = true
            $this.openPort = evt.data.split(",")[2]
            $this.openCode = evt.data.split(",")[1]
            $this.operationState = "领取"
            
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
  mounted() {},
  methods: {

    //  使用说明弹窗
    userProExplainDialog() {
      this.userProExplain = true;
    },
    //  关闭使用说明弹窗
    closeUserProExplainDialog() {
      this.userProExplain = false;
    },
    //  关闭押金提醒弹窗
    closeUserProDepositDialog() {
      this.userProDeposit = false;
    },

    // 关闭租赁弹窗
    openRentalAClose() {
      this.gopaystate = false
      this.RentalDiong = false;
      this.userProDeposit = true;
      this.orderTimeStatu = 0
    },
    openRentalBClose() {
      this.gopaystate = false
      this.RentalDiong = false;
      this.userProDeposit = true;
      this.orderTimeStatu = 1
    },
    RentalAClose(){
      this.RentalDiong = false;
    },


    // 关闭出借成功
    openLoanSuccClose(){
        this.LoanSuccDiong = false
        this.$router.push({ name: "Order" });
    },

    // 支付
    UserPropay() {
      this.gopaystate = true;
      // 签名成功并获取支付签名需要数据
      let $this = this;
      const url = "/palladium/pay/payOrder";
      let postData = this.$qs.stringify({
        userId: $this.userId,
        projectId: $this.proId,
        type: $this.type,
        
      });
      this.$http({
        method: "post",
        url: url,
        data: postData
      }).then(res => {
        var athis = $this;
        // 支付签名
        $this.signType = res.data.data.signType;
        $this.packages = res.data.data.packages;
        $this.paySign = res.data.data.paySign;
        $this.paytimeStamp = res.data.data.timeStamp;
        $this.paynonceStr = res.data.data.nonceStr;
        $this.appId = res.data.data.appId;
        $this.securityOrderNo = res.data.data.securityOrderNo;
        $this.rechargeOrderNo = res.data.data.rechargeOrderNo;

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
              //  取消押金后提交按钮变亮
              athis.gopaystate = false;

              if (res.err_msg == "get_brand_wcpay_request:ok") {
                // 使用以上方式判断前端返回,微信团队郑重提示：
                //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                athis.userProDeposit = false;
                athis.paystate = 1;
                // 签名成功并获取支付签名需要数据

                //  立即出借
                athis.boesws();
              } else {
                alert("支付失败！");
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
    },

    // 借床
    submitDeposit() {
      // 不需交押金
      if (this.Prodata2[0].isDeposit == 0) {
        this.loadinglook = true;
        this.boesws();
      } else {
        // 需要交押金
        this.RentalDiong = true
      }
    },

    // 借床
    boesws() {
      let $this = this;
      this.loadinglook = true;
      let mywloadingTime = setTimeout(function() {
        alert("网络错误，请重试！");
        $this.loadinglook = false;
      }, 8000);
      const url = "/palladium/inter/charge/startUse";
      let postData = this.$qs.stringify({
        userId: this.userId,
        projectId: this.proId,
        deviceCode: this.code,
        isDeposit: 0,
        securityOrderNo: this.securityOrderNo,
        openId: this.openId,
        orderTimeStatu: this.orderTimeStatu
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
    },

    // 还床
    returnProject() {
      if (this.dervidestate == 0) {
        alert("当前暂无还床端口！")
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
        deviceCode: $this.code
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



     
    },

    // 设备异常确认
    closeunitExceptionDialog() {
      this.unitException = false;
      this.RentalDiong = false;
      this.$router.push({
        name: "Home",
        params: {}
      });
    },


    test(){
      this.LoanSuccDiong = true
      
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.usepro{position: absolute;top:0;bottom:0;left:0;right:0;background:#fff;display: flex;flex-direction: column;}
.useproBox{width:100%;height:100%;position: relative;overflow: hidden; background-size:100% 120%;overflow: hidden; overflow-y: auto;padding: .6rem;}




.useproBoxLi{display: flex;justify-content: space-between;border-bottom: 1px solid #e5e5e5;padding: .8rem .2rem;}
.useproBoxLi em{color: #333;font-size: .9rem;position: relative;width: 100%;}
.useproBoxLi em.origin{text-indent: .8rem;}
.useproBoxLi em.origin::after{content:"●";position: absolute;left: -.8rem;font-size: .6rem; top: .2rem;}
.useproBoxLi div i.up{font-size: .8rem;font-weight: 700;padding-left: .2rem;transform:rotate(90deg);display: block;}
.useproBoxLi em p{font-size: .7rem;color: #666;margin-top: .1rem;}
.useproBoxLi em>span{display: flex;justify-content: space-between;}
.useproBoxLiBet{justify-content: flex-start;}
.useproBoxLiBet em:nth-child(1){width:25%;}
.useproBoxLiBet em:nth-child(2){width:75%;}
.userProQuest{font-size: .8rem;}
.userProQuest i{font-size: .78rem;font-weight: 700;margin-left: .1rem;}

.useproBoxImg{padding: 1rem 0;text-align: center;}
.useproBoxImg img{width: 40%;}




/* 悬浮 */
.useproBoxLiSelect{display: flex;flex-direction: column;}
.useproBoxLiSelect>div{display: flex;justify-content: space-between;}
.useproBoxLiSelect ul{display: flex;flex-wrap:wrap;padding-top: .6rem;}
.useproBoxLiSelect ul label{width:23%; height:3.6rem;margin:1%;text-align: center;position: relative;font-size: .9rem;position: relative;}

.useproBoxLiSelect ul label i{font-size: .6rem;right: .4rem;top: .8rem;position: absolute;line-height: 0;}
.useproBoxLiSelect ul label i.red{color: #ff574c;}
.useproBoxLiSelect ul label i.blue{color: #3166fd;}
.useproBoxLiSelect ul label i.trint{color: transparent;}
.useproBoxLiSelect ul label span p{font-size: .7rem;}
.useproBoxLiSelect ul label div{padding-top: .7rem;width: 100%;height: 100%;background: #eeeeee;border: 1px solid transparent;border-radius: 5px;overflow: hidden;}
.useproBoxLiSelect ul label div.busy{background: #3166fd;color: #fff;}
.useproBoxLiSelect ul label div.repair{background: #ff574c;color: #fff;}
.useproBoxLiSelect ul label.selectPro div{border: 1px solid #3166fd; background: #fff;color: #333;}


/* 使用说明 */
.userProExplain{padding: 1rem 0;margin-top: .6rem; border-top: 1px solid #e5e5e5;}
.userProExplain h4{font-weight: 500;color: #333;margin-bottom: .2rem;}
.userProExplain p{font-size: .8rem;}
.userProExplain p b{font-size: 4rem;}
.userProExplainClose{text-align: center;}

/* 押金提醒 */
.userProDeposit div.head{height: 2.8rem;width: 100%;background: #3166fd;color: #fff;line-height:2.8rem;text-indent: .6rem;text-align: left;font-size: .9rem;}
.userProDeposit h4{font-weight: 500;color: #333; position: relative;padding: 1rem 0;border-bottom: 1px solid #e5e5e5;}
.userProDeposit h4 b{font-weight: 500;position: relative;}
.userProDeposit h4 b i{position: absolute;left: -.4rem;top: -.4rem;color: #00c800;font-size: 1.4rem;}
.userProDeposit h4 span{position: absolute;right: 1rem;top: .7rem;color: #999999;font-size: 1.4rem;}
.userProDeposit>div.money{font-size: 2rem;color: #333333;padding: .6rem 0;}
.userProDeposit p{font-size: .9rem;text-align: left;border-bottom: 1px solid #dcdcdc;margin: 0 .6rem;line-height: 3.2rem;display: flex;justify-content: space-between;}
.userProDeposit em{color: #333333;}
.userProDepositClose{padding: 1rem 2rem;}


/* 租赁弹窗 */
.RentalDiongBox{position: relative;}
.RentalDiongBox h4{text-align: center;font-size: .9rem;margin-bottom: .6rem;color: #333;position: relative;}
.RentalDiongBox i.close{position: absolute;top: -3rem;right: -.7rem;z-index: 999;font-size: 1.6rem;}
.RentalDiongBox p{display: flex;justify-content: flex-start;font-size: .9rem;color: #333;margin-bottom: 1rem;}
.RentalDiongBox p em{color: #ff574c;min-width:4.8rem;}
.rentalClose{display: flex; justify-content:space-around;}


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

.LoanSuccDiongBox p{line-height: 4rem;font-size: .9rem;}
</style>
