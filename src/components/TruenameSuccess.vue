<template>
  <div class="truenameSuccess">
    <div class="truenameSuccessBox">
      <img src="static/img/Truenamebg.png">
      <h2>认证成功</h2>
      <p>系统已成功审核您的实名认证</p>
      <div class="truenameSuccessBut">
        <mu-button
          to="/Mine"
          color="primary"
          large
          round
        >　知道了　</mu-button>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "truenameSuccess",
  components: {},
  data() {
    return {};
  },
  methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.truenameSuccess{position: absolute;top:0;bottom:0;left:0;right:0;background:#f6f6f6;display: flex;flex-direction: column;}
.truenameSuccessBox{width:100%;height:100%;position: relative;overflow: hidden;overflow-y: auto; background: #fff;text-align: center;}
.truenameSuccessBox img{width: 60%;margin: 20% auto;margin-bottom: 2%;}
.truenameSuccessBox h2{font-size: 1rem;}
.truenameSuccessBox p{font-size: .8rem;padding-top: .2rem;}
.truenameSuccessBut{position: absolute;left: 0;bottom: 8%;width: 100%; text-align: center;}
</style>


