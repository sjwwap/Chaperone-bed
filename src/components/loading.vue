<template>
  <div class="loading">
    <div class="loadingbox">
      <i class="iconfont icon-jiazaizhong1"></i>
        <p>{{message}}</p>
        </div>
  </div>
</template>

<script>
export default {
  name: 'loading',
  props:["message"],
  data () {
    return {
      
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.loading{position: absolute;top: 0;bottom: 0;left: 0;right: 0;background: rgba(255,255,255,0.3);z-index: 999999;display: flex;justify-content: center;align-items: center;}
.loadingbox{width: 7rem;height: 7rem;background: rgba(0,0,0,0.7);border-radius: 8px;text-align: center;color: #fff;font-size: .9rem;margin-top: -4rem;padding-top: .6rem;}
.loadingbox i{font-size:2.6rem;color: #fff;animation: 2s Myloading infinite linear;display: block;transform: rotate(0deg)}
@keyframes Myloading {
  0%{transform: rotate(0deg)}
  100%{transform: rotate(360deg)}
}


</style>
