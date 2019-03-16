<template>
  <div class="minecollection">
    <div v-wechat-title="$route.meta.title"></div>
    <div class="minecollectionBox">



    </div>
  </div>
</template>

<script>
export default {
  name: 'minecollection',
  data () {
    return {
      
    }
  },
  methods:{



    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.minecollection{position: absolute;top:0;bottom:0;left:0;right:0;background:#f6f6f6;display: flex;flex-direction: column;}
.minecollectionBox{width:100%;height:100%;position: relative;overflow: hidden; background: #fff url(../../static/img/codeimg.png) bottom no-repeat;background-size: 100%;}




</style>


