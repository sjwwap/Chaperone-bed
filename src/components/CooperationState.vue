<template>
  <div class="CooperationState">
    <div v-wechat-title="$route.meta.title"></div>
    <div class="CooperationStateBox" v-if="this.$route.query.state == '待审核'">
    <img src="static/img/CooperationState.png">
    <h2>提交成功</h2>
    <p>我们将在3个工作日内进行审核，请您耐心等待...</p>
    <div class="truenameSuccessBut">
      <mu-button to="/Mine" color="primary" large round>　知道了　</mu-button>
    </div>
    </div>
    <div class="CooperationStateBox" v-if="this.$route.query.state == '锁定'">
    <img src="static/img/CooperationState.png">
    <h2>已锁定</h2>
    <p>您的加盟商身份已被锁定，请联系管理员...</p>
    <div class="truenameSuccessBut">
      <mu-button to="/Mine" color="primary" large round>　知道了　</mu-button>
    </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CooperationState',
  data () {
    return {
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.CooperationState{position: absolute;top:0;bottom:0;left:0;right:0;background:#f6f6f6;display: flex;flex-direction: column;}
.CooperationStateBox{width:100%;height:100%;position: relative;overflow: hidden; background: #fff;overflow-y: auto;text-align: center;}


.CooperationStateBox img{width: 60%;margin: 20% auto;margin-bottom: 2%;}
.CooperationStateBox h2{font-size: 1rem;}
.CooperationStateBox p{font-size: .8rem;padding-top: .2rem;}
.truenameSuccessBut{position: absolute;left: 0;bottom: 8%;width: 100%; text-align: center;}


</style>


