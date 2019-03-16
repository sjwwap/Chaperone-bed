<template>
  <div class="medal">
    <div class="medalHead">
      <div class="medalHeadBox">
        <div>
          <h2>{{userData.wechatName}}</h2>
          <p>ID:{{userData.id}}</p>
          <p>倔强青铜</p>
          </div>
          <div><img src="../../static/img/medalImg.png"></div>
      </div>
    </div>
    <div class="medalBody">
      <div class="medalList">
        <ul>
          <li>
            <img src="../../static/img/medalImg.png" alt="">
            <p>-</p>
            <h4>时尚达人</h4>
            <p>2019.01.18 获得</p>
          </li>
          <li>
            <img src="../../static/img/medalImg.png" alt="">
            <p>-</p>
            <h4>时尚达人</h4>
            <p>2019.01.18 获得</p>
          </li>
          <li>
            <img src="../../static/img/medalImg.png" alt="">
            <p>-</p>
            <h4>时尚达人</h4>
            <p>2019.01.18 获得</p>
          </li>
          <li>
            <img src="../../static/img/medalImg.png" alt="">
            <p>-</p>
            <h4>时尚达人</h4>
            <p>2019.01.18 获得</p>
          </li>
          <li>
            <img src="../../static/img/medalImg.png" alt="">
            <p>-</p>
            <h4>时尚达人</h4>
            <p>2019.01.18 获得</p>
          </li>
          <li>
            <img src="../../static/img/medalImg.png" alt="">
            <p>-</p>
            <h4>时尚达人</h4>
            <p>2019.01.18 获得</p>
          </li>
        </ul>
      </div>
    </div>
    <Waitting v-if="waittinglook"></Waitting>
  </div>
</template>

<script>
import Waitting from '@/components/waitting'
export default {
  name: 'MineBadge',
  components:{Waitting},
  data () {
    return {
      userId:"",
      userData:{},
      waittinglook:false
    }
  },
  created(){

      this.userId = this.getCookie("userId")
      this.waittinglook = true

       // 用户信息
      let $this = this
      this.$http.get('/palladium/web/lipstick/selectByOne?id='+ this.userId)
        .then(function (response) {
          $this.waittinglook = false
          $this.userData = response.data.data.user
        })
        .catch(function (error) {

        })





  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.medal{width: 100%;height: 100%;display: flex;flex-direction: column;}
.medalHead{width: 100%;min-height: 8rem;background: url(../../static/img/medalbg.png) no-repeat; background-size: 100% 100%;position: relative;}
.medalBody{flex: 1;}

.medalHeadBox{width: 90%;height: 8rem;border-radius: 10px;position: absolute; left: 5%; top: 20%;box-shadow: 0 5px 5px #dedede;background:#fff url(../../static/img/medalBoxbg.png) left bottom no-repeat;background-size: 50%;display: flex;justify-content:space-between;padding: 0 6%;}
.medalHeadBox>div:nth-child(1){margin-top: 15%;width: 50%;}
.medalHeadBox>div:nth-child(1) h2{font-size: .9rem;}
.medalHeadBox>div:nth-child(1) p{font-size: .8rem;}
.medalHeadBox>div:nth-child(2){width: 50%;text-align: center;}
.medalHeadBox img{width:60%;margin-top: 20%;}

.medalList{width: 100%;height: 100%;padding:2rem 1rem 0rem 1rem;}
.medalList ul{width: 100%;display: flex;justify-content: space-between;flex-wrap: wrap;}
.medalList ul li{width: 30%;height:10rem;background: #fff;box-shadow: 0 0 5px #dedede;border-radius: 10px;margin-top: 1rem;text-align: center;}
.medalList ul li h4{color: #ff574c;}
.medalList ul li p:nth-child(2){color: #3166fd;}
.medalList ul li p:nth-child(4){font-size: .6rem;}
.medalList ul li img{width: 50%;margin-top: 20%;}

</style>
