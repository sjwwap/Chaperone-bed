<template>
  <div class="nav">
    <router-link to="/" class="navbut" active-class="active" exact><a class="iconfont icon-shouye"></a><p>首页</p></router-link>
    <router-link to="/Project" class="navbut" active-class="active" exact><a class="iconfont icon-chanpin1"></a><p>产品</p></router-link>
    <router-link to="/Order" class="navbut" active-class="active" exact><a class="iconfont icon-quanbudingdan"></a><p>订单</p></router-link>
    <router-link to="/Mine" class="navbut" active-class="active" exact><a class="iconfont icon-wode1"></a><p>我的</p></router-link>
  </div>
</template>
<script>
export default {
  name: 'Nav',
  data () {
    return {
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.nav{width:100%;height:3.8rem;min-height:3.8rem;background:#fff;display: flex;position:relative;}
.nav img{margin-top: .5rem;}
.nav>a{width: 25%;text-align: center;padding-top: .2rem}
.nav>a>a{font-size: 1.4rem;font-weight: 700;}
.nav>a.active{color: #3166fd;}
.nav>a.active>a{color: #3166fd;}
.nav>a.active p{color: #3166fd;font-weight: 700}
.nav p{font-size: .8rem;font-weight: 500;margin-top: -.2rem;}


</style>
