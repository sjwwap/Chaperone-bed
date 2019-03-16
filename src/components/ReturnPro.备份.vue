<template>
  <div class="returnPro">
    <div v-wechat-title="$route.meta.title"></div>
    
    <div class="returnBox">
      <div class="useproBoxLi useproBoxLifiex">
        <em></em>
        <div class="userProQuest">
          <mu-button @click="useProjectBut" round color="primary" small>　我要借床<span class="iconfont icon-xiangyou-copy"></span>　</mu-button>
        </div>
      </div>
      <div class="useproBoxLi">
        <em>项目名称：{{Prodata2[0].projectName}}</em>
        <div class="userProQuest" @click="userProExplainDialog">
          <a>归还说明</a><i class="iconfont icon-iconset0143"></i>
        </div>
      </div>
      <div class="useproBoxLi">
        <em>联系电话：{{Prodata2[0].servicePhone}}</em>
      </div>
      <div class="useproBoxLi">
        <em>状态说明</em>
        <div class="clolor">
          <div class="red">
          <i class="iconfont icon-dian1"></i><a>维修中</a>
          </div>
          <div class="blue">
          <i class="iconfont icon-dian1"></i><a>已退还</a>
          </div>
          <div>
          <i class="iconfont icon-dian1"></i><a>可退还</a>
          </div>
        </div>
      </div>
      <div class="useproBoxLi useproBoxLiSelect">
        <div @click="useproBoxLiSH">
        <em class="origin">{{Prodata2[0].deviceAddress}}</em>
        <div>
          <i :class="{useproBoxLiLeft:isuseproBoxLiLeft}" class="up iconfont icon-xiangyou-copy"></i>
        </div>
        </div>
        <ul v-show="useproBoxLiShow">
          <label @click="useproBoxLiActive($event,index)" v-for="(item,index) in Prodata" :key="index">
            <div v-if="item.state == 0" class="busy">
            <span>{{item.port}}号口<p>已退还</p></span>
            </div>
            <div v-if="item.state == 1" class="free">
            <span>{{item.port}}号口<p>可退还</p></span>
            </div>
            <div v-if="item.state == 2" class="repair">
            <span>{{item.port}}号口<p>维修中</p></span>
            </div>
            </label>
        </ul>
      </div>
      <div class="useproBoxLi" v-if="Prodata2[0].isDeposit == 0">
        <em>收费标准<br/>
        <p>使用计费5元/小时，归还{{Prodata2[0].projectName}}结束计费。</p>
        <p v-if="paystate == 1" style="color:#009999;">提示：恭喜您已交过押金了，赶紧体验吧~</p>
        </em>
      </div>
      <div class="useproBoxLi" v-if="Prodata2[0].isDeposit == 1">
        <em>收费标准<br/>
        <p>押金{{Prodata2[0].deposit}}元/次，使用计费5元/<span v-if="Prodata2[0].type == 1">小时</span>
          <span v-if="Prodata2[0].type == 2">次</span>
          ，归还{{Prodata2[0].projectName}}时退回押金。</p>
        </em>
      </div>
      <br/>
      <div style="display:flex;justify-content: space-around">
      <mu-button color="error" large round  @click="userProDepositDialog">　报错　</mu-button>
      <mu-button :disabled="substate" color="primary" large round  @click="returnProject">立即还床</mu-button>
      </div>
      
      <br/>
      <br/>
      <br/>
      <!-- 使用说明弹窗 --> 
      <mu-dialog title="共享陪护床使用说明" width="640px" max-width="90%" dialog-class="userProExplainDiong" :open.sync="userProExplain">
        <img src="static/img/userpro.png" width="100%">
        <div class="userProExplain">
          <h4>共享陪护床注意事项</h4>
          <p><b>•</b> 请您在规定的时间内租借陪护床，非使用期间无法租借；</p>
          <p><b>•</b> 请您按时、对号归还陪护床，并锁好柜门，否则会影响到您的计费与押金退还；</p>
          <p><b>•</b> 试用期间，请妥善保管陪护床，爱惜公共物品；</p>
          <p><b>•</b> 未成年人禁止单独使用陪护床。</p>
        </div>
        <div class="userProExplainClose"><mu-button  color="primary" @click="closeUserProExplainDialog">　我知道了　</mu-button></div>
        <br/>
    </mu-dialog>


    </div>
    <div class="" v-show="prostate !== 200">
      设备暂无法使用！
    </div>
    <Loading v-if="loadinglook"></Loading>
    <Waitting v-if="waittinglook"></Waitting>
  </div>
</template>
<script>
import Loading from '@/components/loading'
import Waitting from '@/components/waitting'
export default {
  name: 'ReturnPro',
  components:{Loading},
  data () {
    return {
      // loading
      loadinglook:false,
      waittinglook:false,
      // 弹窗
      userProExplain: false,
      // 下拉显隐
      useproBoxLiShow:true,
      isuseproBoxLiLeft:false,
      // 设备状态
      prostate:"",


      jxy:0,

      // 提交按钮
      substate:true,
      // 端口号
        Prodata:[
          
        ],
        normal:[
          
        ],
        // 支付状态
        paystate:0,
        // 项目信息
        Prodata2:[
         {projectName:""}
        ],

        // 项目Id
        proId:"",
         // 用户信息
        userId:"",
        // 设备编号
        code:"",
        // openId
        openId:"",
        // 端口号
        port:"",
        // 订单编号
        orderId:"",


      // 支付签名
      signType:"",
      packages:"",
      paySign:"",
      paytimeStamp:"",
      paynonceStr:"",
      appId:"",
      securityOrderNo:"",
      rechargeOrderNo:""





    }
  },

     watch:{
      jxy: {
        deep: true,
        handler(val){
        let $this = this
        const url ='/palladium/pay/payOrder';
        let postData = this.$qs.stringify({
            userId:$this.userId,
            id:$this.orderId,
            type:2
            });
            this.$http({
                method: 'post',
                url:url,
                data:postData
            }).then((res)=>{
            const dataArr = res.data.data
            $this.signType =  res.data.data.signType
            $this.packages =  res.data.data.packages
            $this.paySign =  res.data.data.paySign
            $this.paytimeStamp =  res.data.data.timeStamp
            $this.paynonceStr =  res.data.data.nonceStr
            $this.appId =  res.data.data.appId
            
            console.log(res)
            function onBridgeReady(){
              WeixinJSBridge.invoke(
                  'getBrandWCPayRequest', {
                    "appId":$this.appId,     //公众号名称，由商户传入     
                    "timeStamp": $this.paytimeStamp, //时间戳，自1970年以来的秒数     
                    "nonceStr":$this.paynonceStr, //随机串
                    "package":$this.packages,
                    "signType":$this.signType,         //微信签名方式：     
                    "paySign":$this.paySign //微信签名 
                  },
                  function(res){
                  if(res.err_msg == "get_brand_wcpay_request:ok" ){
                  // 使用以上方式判断前端返回,微信团队郑重提示：
                        //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                         $this.$router.push({
                    name:"Order",
                    params:{
                      codenum:1,
                  }
                  });
                  }else{
                    $this.substate = false
                    alert("支付失败或取消！")
                  }
              }); 
            }

            if (typeof WeixinJSBridge == "undefined"){
              if( document.addEventListener ){
                  document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
              }else if (document.attachEvent){
                  document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
                  document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
              }
            }else{
              onBridgeReady();
            }
        });

          
          
            
        }
      }
},

  created(){

    this.waittinglook = true

    // 绑定订单编号
    this.orderId = this.$route.params.orderId
    this.code = this.$route.params.code

 
    

      // 获取userId
      function getCookie(key){
      
          var arr1 = document.cookie.split("; ");
          for(var i = 0; i < arr1.length; i++){
              var arr2 = arr1[i].split("=");
              if(arr2[0] == key){
                  return decodeURIComponent(arr2[1]);
              }
          }
      }
      var getuserId = getCookie("userId")
      this.userId = getuserId



      // 获取openid
      function getCookie(key){
      
          var arr1 = document.cookie.split("; ");
          for(var i = 0; i < arr1.length; i++){
              var arr2 = arr1[i].split("=");
              if(arr2[0] == key){
                  return decodeURIComponent(arr2[1]);
              }
          }
      }
      var getopenId = getCookie("openId")
      this.openId = getopenId
      var openId = getopenId

      

    // 获取code
  //   function getUrlQuery(name) {
  //   var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i")
  //   var r = window.location.search.substr(1).match(reg)
  //   if (r != null) return decodeURI(r[2])
  //   return null
  // }
  //     var code = getUrlQuery("code")
     
      // alert(this.$route.params.code)
      // alert(window.location.search)

      // 开发环境
      // this.$route.params.codenum = "00000001"
      // this.userId = 36

      // 查询设备编号
          var $this = this
          this.$http.get('/palladium/inter/charge/queryBinDingDevice?code='+ this.code +'&userId='+ this.userId +'')
                    .then(function (response) {
                      console.log(response)
                      $this.prostate = response.data.code
                      $this.Prodata = response.data.data
                      $this.Prodata2 = response.data.data2
                      $this.proId = response.data.data2[0].projectId
                      $this.waittinglook = false
                    }.bind(this))
                    .catch(function (error) {
                      console.log(error.msg)
                    })
          
        function inter(){
        var websocket = null;
        if('WebSocket' in window){
            websocket = new WebSocket("ws://pd.haokuaichong.cn/palladium/inter/chargeSocket")
        }else{
            alert("浏览器不支持此功能")
            false;
        }
        //连接发生失败回调
        websocket.onerror = function(){
            // alert("连接发生错误");
            return false;
        }
        
        //连接成功回调
        // websocket.onopen = (event) => {
        //     alert("连接服务器成功");
        //     websocket.send("user:"+ this.openId)
        // }

        websocket.onopen = function(event){
            websocket.send("user:"+ openId)
        }
        //接受到消息回调
        websocket.onmessage = function(event){
          if (event.data == 1) {
         // 签名成功并获取支付签名需要数据

         $this.jxy = 1

          } else {
            alert("端口占用！")
          }
            
        }

        //连接关闭回调方法
        websocket.onclose = function(){
            // alert("连接关闭");
            websocket.close();
        }

        //监听窗口事件
        window.onbeforeunload = function(){
            websocket.close();
        }
    }

    inter()
    


  },
  mounted(){


   


  },
  methods:{


    


  //  选择空闲设备
   useproBoxLiActive:function(a,e){
     if (this.Prodata[e].state == 1) {
        if ($(a.target).parents("label").hasClass("selectPro")) {
          $(".useproBoxLi").find("label").removeClass("selectPro")
           this.substate = true
        } else {
        $(".useproBoxLi").find("label").removeClass("selectPro")
        $(a.target).parents("label").addClass("selectPro")
        this.port = e + 1
        this.substate = false
        }
     } else if(this.Prodata[e].state == 0){
     }else{
       
     }
   },

  //  我要借床
  useProjectBut(){
    this.$router.push({
              name:"UsePro",
              params:{
                returncode:this.code,
            }
            });
  },

  //  设备口号展开收缩
   useproBoxLiSH:function(){
     if (this.useproBoxLiShow == true) {
       this.useproBoxLiShow = false
       this.isuseproBoxLiLeft = true
     } else {
       this.useproBoxLiShow = true
       this.isuseproBoxLiLeft = false
     }
   },

  //  使用说明弹窗
       userProExplainDialog () {
      this.userProExplain = true;
    },
  //  关闭使用说明弹窗
      closeUserProExplainDialog () {
        this.userProExplain = false;
      },


      // 还床
      returnProject(){

        // alert(this.orderId)
        // alert(this.code)
        // alert(this.port)

        this.substate = true

        let $this = this
        const url ='/palladium/inter/charge/endUse';
        let postData = this.$qs.stringify({
            orderId:$this.orderId,
            deviceCode:$this.code,
            port:$this.port
            });
            this.$http({
                method: 'post',
                url:url,
                data:postData
            }).then((res)=>{
              console.log(res.msg)
        });
        


      },
     




}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.returnPro{position: absolute;top:0;bottom:0;left:0;right:0;background:#fff;display: flex;flex-direction: column;}
.returnBox{width:100%;height:100%;position: relative;overflow: hidden; background-size:100% 120%;overflow: hidden; overflow-y: auto;padding: .6rem;}


.useproBoxLi{display: flex;justify-content: space-between;border-bottom: 1px solid #e5e5e5;padding: .8rem .2rem;}
.useproBoxLi em{color: #333;font-size: .9rem;position: relative;}
.useproBoxLi em.origin{text-indent: .8rem;}
.useproBoxLi em.origin::after{content:"●";position: absolute;left: -.8rem;font-size: .6rem; top: .2rem;}
.useproBoxLi div i.up{font-size: .8rem;font-weight: 700;padding-left: .2rem;transform:rotate(90deg);display: block;}
.useproBoxLi div i.useproBoxLiLeft{transform: rotate(0deg);}
.useproBoxLi em p{font-size: .7rem;color: #999;}

.userProQuest i{font-size: .78rem;font-weight: 700;margin-left: .1rem;}

.useproBoxLi div.clolor{display: flex;}
.useproBoxLi div.clolor div{margin-left: .8rem;}
.useproBoxLi div.clolor div i{font-size: .45rem;margin-right: .2rem}
.useproBoxLi div.clolor div.red a,.useproBoxLi div.clolor div.red i{color: #ff574c;}
.useproBoxLi div.clolor div.blue a,.useproBoxLi div.clolor div.blue i{color: #3166fd;}

/* 悬浮 */
.returnBox .useproBoxLi:nth-child(2){margin-top: 3.2rem;}
.useproBoxLifiex{position: fixed;top: 0;left: 0;width: 100%;border: none;box-shadow: 0 0 5px #dedede;background: #fff;z-index: 99;}


.useproBoxLiSelect{display: flex;flex-direction: column;}
.useproBoxLiSelect>div{display: flex;justify-content: space-between;}
.useproBoxLiSelect ul{display: flex;flex-wrap:wrap;padding-top: .6rem;}
.useproBoxLiSelect ul label{width:23%; height:3.6rem;background: #eeeeee;margin:1%;border-radius: 5px;text-align: center;position: relative;font-size: .9rem;position: relative;overflow: hidden;}
.useproBoxLiSelect ul label.selectPro::after{content:"";width:.56rem;height: .56rem;border-radius: 100%; background: #3166fd;position:absolute; top: .5rem;right: .4rem;overflow: hidden;}
.useproBoxLiSelect ul label i{font-size: .6rem;right: .4rem;top: .8rem;position: absolute;line-height: 0;}
.useproBoxLiSelect ul label i.red{color: #ff574c;}
.useproBoxLiSelect ul label i.blue{color: #3166fd;}
.useproBoxLiSelect ul label i.trint{color: transparent;}
.useproBoxLiSelect ul label span p{font-size: .7rem;}
.useproBoxLiSelect ul label div{padding-top: .7rem;width: 100%;height: 100%;}
.useproBoxLiSelect ul label div.busy{background: #3166fd;color: #fff;}
.useproBoxLiSelect ul label div.repair{background: #ff574c;color: #fff;}
.useproBoxLiSelect ul label.selectPro{background: #3166fd;color: #fff;}


/* 使用说明 */
.userProExplain{padding: 1rem 0;margin-top: .6rem; border-top: 1px solid #e5e5e5;}
.userProExplain h4{font-weight: 500;color: #333;margin-bottom: .2rem;}
.userProExplain p{font-size: .8rem;}
.userProExplainClose{text-align: center;}

</style>
