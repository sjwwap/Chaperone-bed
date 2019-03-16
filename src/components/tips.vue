<template>
  <div class="tips">
    <a>{{message}}</a>
  </div>
</template>

<script>
export default {
  name: "tips",
  props: ["message"],
  data() {
    return {};
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.tips{position: absolute;width: 100%;height: 2.6rem;z-index: 999;bottom: 2rem;display: flex;justify-content: center; }
.tips a{min-width: 5rem; padding:0 1rem;font-size: .9rem; background: rgba(0,0,0,0.6);color: #fff;text-align: center;line-height: 2.6rem;border-radius: 5px;}
</style>
