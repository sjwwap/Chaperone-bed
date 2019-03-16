<template>
  <div class="minecollection">
    <div v-wechat-title="$route.meta.title"></div>
    <div class="minecollectionBox">
      <div class="minecollectionLogo"><img src="static/img/icon/logo.png" width="100%"></div>
      <p>请选择您加盟的身份！</p>
      <div class="minecollectionBut">
      <mu-button  color="primary" large round :to="{path:'/CooperationJoinInFrom',query:{type:1}}">　全民营销　</mu-button>
      <mu-button  color="primary" large round :to="{path:'/CooperationJoinInFrom',query:{type:2}}">　城市展厅　</mu-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CooperationJoinIn',
  data () {
    return {}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.minecollection{position: absolute;top:0;bottom:0;left:0;right:0;background:#f6f6f6;display: flex;flex-direction: column;}
.minecollectionBox{width:100%;height:100%;position: relative;overflow: hidden; background: #fff;}
.minecollectionLogo{width: 6rem;height: 6rem;margin: 20% auto;margin-bottom: 0; border-radius: 100%;overflow: hidden;}
.minecollectionBox p{text-align: center;font-size: .9rem;margin-top: 1rem;}
.minecollectionBut{display: flex;justify-content:center;margin-top: 2rem;}
.minecollectionBut a:nth-child(2){margin-left: 2rem;}
</style>


