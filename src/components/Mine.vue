<template>
  <div class="mine">
    <div v-wechat-title="$route.meta.title"></div>
    <div class="mineBox">
      <div class="MineUser">
        <div class="userImg iconfont icon-touxiang" v-if="this.user.wechatUrl == null"></div>
        <img :src="user.wechatUrl" v-else>
        <p style="color:#fff;" v-if="this.user.wechatName == null">-</p>
        <p class="MineNamePosition"><b>{{user.wechatName}}<router-link to="/MineBadge" class="iconfont icon-huaban-"></router-link></b></p>
        <p style="color:#fff;" v-if="this.user.ids == null">-</p>
        <p v-else>ID:{{user.ids}}</p>
      </div>
      <ul class="MineUl">
        <router-link to="/MineConsumeRecord">
          <em><span><i class="iconfont icon-quanbudingdan"></i></span><b>消费记录</b></em>
          <i class="iconfont icon-xiangyou-copy"></i>
        </router-link>
        <a @click="goTruename">
          <em><span><i class="iconfont icon-renzheng"></i></span><b>实名认证</b></em>
          <i class="iconfont icon-xiangyou-copy"></i>
        </a>
        <!-- <router-link to="/MineInvitationCode">
          <em><span><i class="iconfont icon-saoma"></i></span><b>我的邀请码</b></em>
          <i class="iconfont icon-xiangyou-copy"></i>
        </router-link> -->
        <router-link to="/MineCollection">
          <em><span><i class="iconfont icon-shoucang"></i></span><b>我的收藏</b></em>
          <i class="iconfont icon-xiangyou-copy"></i>
        </router-link>
        <!-- <router-link to="/CooperationJoinIn"> -->
        <a @click="openCooperationJoinInDiong">
          <em><span><i class="iconfont icon-hezuo"></i></span><b>合作加盟</b></em>
          <i class="iconfont icon-xiangyou-copy"></i>
          </a>
        <!-- </router-link> -->
      </ul>
      

       <!-- 合作加盟确认组件 -->
      <mu-dialog title="城市展厅说明" width="640px" max-width="90%" dialog-class="cooperationJoinInDiongStyle" :open.sync="cooperationJoinInDiong">
        <img src="static/img/cooperationJoinInbg.png" width="40%">
        <div class="userProExplain">
          <p>展厅就是展览大厅咯，将你的产品摆设好展示给被人看，不过要把展厅布置好不是容易的是哦，这可是有专业考试的哦。展厅的目的就是让别人知道你的东西，了解你的产品和贵公司的状况公司文化，让别人喜欢你的产品，打响产品知名度，买你的东西就有钱赚了。</p>
        </div>
        <div class="userProExplainClose">
          <mu-button  color="info" @click="closeCooperationJoinInDiong" large>不了,谢谢</mu-button>
          <mu-button  color="primary" @click="goCooperationJoinInDiong" large>继续,去加盟</mu-button>
        </div>
        <br/>
    </mu-dialog>

    <!-- 提示 -->
    <Tips v-if="tipss" :message="messagetitle"></Tips>

    </div>
    <Nav></Nav>
  </div>
</template>

<script>
import Nav from '@/components/nav'
import Tips from '@/components/tips'
export default {
  name: 'mine',
  components:{Nav,Tips},
  data () {
    return {
      cooperationJoinInDiong:false,
      user:{},
      openId:"",
      userId:"",

      // 请求数据
      state:null,

      // 是否加盟
      joinCode:"",

      // 提示组件
      tipss:false,
      messagetitle:"",



      Prodata:[]
      
     
    }
  },
  created(){

    this.openId = this.getCookie("openId")
    this.userId = this.getCookie("userId")

      // 用户信息
      let $this = this
      this.$http.get('/palladium/web/selectPdUserInfo?openId=' + this.openId)
        .then(function (response) {
          $this.user = response.data.data
        })
        .catch(function (error) {
        })


        // 合作加盟
      this.$http.get('/palladium/inter/operator/seclectOperators?userId=' + this.userId)
        .then(function (response) {
          if (response.data.code == 200) {
            $this.joinCode = response.data.code
            $this.state = response.data.data
          } else if(response.data.code == 300){
            $this.joinCode = response.data.code
            console.log("暂未加入供应商！")
          }else{
            $this.joinCode = response.data.code
          }
          
        })
        .catch(function (error) {
        })
  },
  methods:{

//  使用说明弹窗
       openCooperationJoinInDiong () {
         if (this.joinCode == 200) {

           if(this.state == "待审核"){
           this.$router.push({
                  path:"/CooperationState",
                  query:{
                    state:this.state
                }
                });
         } else if(this.state == "锁定"){
           this.$router.push({
                  path:"/CooperationState",
                  query:{
                    state:this.state
                }
                });
         } else if(this.state == "正常"){
           window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxa458a437c5eb240b&redirect_uri=http://pd.haokuaichong.cn/palladium/merchant/author?appId=wxa458a437c5eb240b&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect"
         }
         
           
         }else{
           this.cooperationJoinInDiong = true;
           }
         
      
    },

  //  关闭使用说明弹窗
      closeCooperationJoinInDiong () {
        this.cooperationJoinInDiong = false;
      },
    
    // 确认加入城市展厅
    goCooperationJoinInDiong(){
      this.cooperationJoinInDiong = false;
      this.$router.push({path: '/CooperationJoinIn'})
    },

    // 判断是否实名
    goTruename(){
      if (this.user.smsStatus == 1) {
        this.tipss = true
        this.messagetitle = "您已通过实名认证！"
        let $this = this
        setTimeout(function(){$this.tipss = false},1000);
      } else {
        this.$router.push({
                  path:"/Truename"
                });
      }
    }

    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mine{position: absolute;top:0;bottom:0;left:0;right:0;background:#f6f6f6;display: flex;flex-direction: column;}
.mineBox{width:100%;height:100%;position: relative;overflow: hidden; background: #fff;overflow-y: auto;border-bottom: 1px solid #e6e6e6;}

.MineUser{display: flex;flex-direction: column;justify-content: center;background: url(../../static/img/minebg.png) no-repeat; background-size: 100%;}
.MineUser img{width: 5.6rem;height: 5.6rem;border-radius: 100%;overflow: hidden;margin: 3.6rem auto .5rem auto;border: 4px solid #fff;}
.MineUser p{text-align: center;font-size: .9rem;color: #666;}
.MineUser p.MineNamePosition b{position: relative;}
.MineUser p.MineNamePosition b a{position: absolute;right: -1rem;font-size: 1rem;top: -.3rem;color: #ffcc1a;}


/* 默认头像 */
.userImg{background: #fff;width: 5.6rem; height: 5.6rem;border-radius: 100%;overflow: hidden;margin: 3.6rem auto .5rem auto;border: 4px solid #fff;font-size: 3rem;text-align: center;color: #dedede;}

.MineUl{padding:1rem;padding-bottom: 6rem;}
.MineUl a{border-bottom: 1px solid #e5e5e5;width: 100%;display: block;padding: .8rem 0;display: flex;justify-content: space-between;}
.MineUl a em{width: 50%;display: flex;justify-content: flex-start;}
.MineUl a b{font-weight: 500;color: #333;font-size: 1rem;}
.MineUl a i:nth-child(1){font-size: .8rem;}
.MineUl span{width: 1.4rem;border-radius: 100%;text-align: center;line-height: 1.5rem; height: 1.4rem;background:#dedede;display: block;margin-right: .4rem;}
.MineUl a:nth-child(1) span{background:#ffeae4;}
.MineUl a:nth-child(1) span i{color: #ff3000}
.MineUl a:nth-child(2) span{background:#ecf1ff;}
.MineUl a:nth-child(2) span i{color: #3168ff}
.MineUl a:nth-child(3) span{background:#ffeaf2;}
.MineUl a:nth-child(3) span i{color: #ff004e}
.MineUl a:nth-child(4) span{background:#fdf8e6;}
.MineUl a:nth-child(4) span i{color: #eeb700}
.MineUl a:nth-child(5) span{background:#ffeaf2;}
.MineUl a:nth-child(5) span i{color: #ff0e58}





</style>


